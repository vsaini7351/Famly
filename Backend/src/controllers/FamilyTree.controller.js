
import { QueryTypes } from "sequelize";
import { sequelize } from "../db/index.js";
import { Membership, User, Family } from "../models/index.js";

export async function getFamilyAncestorsAndDescendants(req, res) {
  try {
    
    const userId = parseInt(req.user.user_id);
    if (!userId) {
      return res.status(400).json({ error: "User not found in request" });
    }

    // ✅ 1. Get user details (to check gender)
    const user = await User.findByPk(userId, { attributes: ["user_id", "gender"] });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    console.log(user)
    // ✅ 2. Find the family where this user is the root member (based on gender)
    const rootFamily = await Family.findOne({
      where:
        user.gender === "male"
          ? { male_root_member: userId }
          : { female_root_member: userId },
    });

    if (!rootFamily) {
      return res.status(404).json({ error: "User is not a root member of any family" });
    }

    const familyId = Number(rootFamily.family_id);
    
    if (!familyId) {
      return res.status(400).json({ error: "familyId not found" });
    }

    const ancestorOffset = Number(req.query.ancestorOffset ?? 0);
    const descendantOffset = Number(req.query.descendantOffset ?? 0);

    // 1) Ancestors query (4 at a time)
    const ancestorQuery = `
      WITH RECURSIVE ancestors AS (
        SELECT f.family_id, f.family_name, f."familyPhoto", f.ancestor, 0 AS depth, ARRAY[f.family_id] AS path
        FROM families f
        WHERE f.family_id = :familyId

        UNION ALL

        SELECT f.family_id, f.family_name, f."familyPhoto", f.ancestor, a.depth + 1, a.path || f.family_id
        FROM families f
        JOIN ancestors a ON f.family_id = a.ancestor
        WHERE NOT f.family_id = ANY(a.path)
      )
      SELECT family_id, family_name, "familyPhoto", depth
      FROM ancestors
      WHERE depth > 0
      ORDER BY depth ASC
      OFFSET :ancestorOffset * 4
      LIMIT 4;
    `;

    // 2) Descendants query (4 at a time)
    const descendantQuery = `
      WITH RECURSIVE descendants AS (
        SELECT f.family_id, f.family_name, f."familyPhoto", f.ancestor, 0 AS depth, ARRAY[f.family_id] AS path
        FROM families f
        WHERE f.family_id = :familyId

        UNION ALL

        SELECT f.family_id, f.family_name, f."familyPhoto", f.ancestor, d.depth - 1, d.path || f.family_id
        FROM families f
        JOIN descendants d ON f.ancestor = d.family_id
        WHERE NOT f.family_id = ANY(d.path)
      )
      SELECT family_id, family_name, "familyPhoto", depth
      FROM descendants
      WHERE depth < 0
      ORDER BY depth DESC
      OFFSET :descendantOffset * 4
      LIMIT 4;
    `;

    const ancestors = await sequelize.query(ancestorQuery, {
      replacements: { familyId, ancestorOffset },
      type: QueryTypes.SELECT,
    });

    const descendants = await sequelize.query(descendantQuery, {
      replacements: { familyId, descendantOffset },
      type: QueryTypes.SELECT,
    });

    // 3) Current family
    const [currentFamily] = await sequelize.query(
      `
      SELECT f.family_id, f.family_name, f."familyPhoto", f.male_root_member, f.female_root_member, 0 AS depth
      FROM families f
      WHERE f.family_id = :familyId
      `,
      { replacements: { familyId }, type: QueryTypes.SELECT }
    );

    // 4) Collect all family IDs to fetch members
    const familiesToFetch = [
      familyId,
      ...ancestors.map(f => f.family_id),
      ...descendants.map(f => f.family_id),
    ];

    let members = [];
    if (familiesToFetch.length > 0) {
      members = await sequelize.query(
        `
        SELECT m.family_id, u.user_id, u.fullname AS name, u."profilePhoto"
        FROM memberships m
        JOIN users u ON u.user_id = m.user_id
        WHERE m.family_id = ANY(ARRAY[:familyIds]::int[])
        `,
        { replacements: { familyIds: familiesToFetch }, type: QueryTypes.SELECT }
      );
    }

    // 5) Group members by family
    const membersByFamily = members.reduce((acc, m) => {
      if (!acc[m.family_id]) acc[m.family_id] = [];
      acc[m.family_id].push({ user_id: m.user_id, name: m.name, profilePhoto: m.profilePhoto });
      return acc;
    }, {});

    // Helper to attach root members
    const attachRootMembers = async family => {
      const maleRoot =
        family.male_root_member &&
        members.find(m => m.user_id === family.male_root_member) || null;
      const femaleRoot =
        family.female_root_member &&
        members.find(m => m.user_id === family.female_root_member) || null;

      return {
        ...family,
        rootMembers: { male: maleRoot, female: femaleRoot },
        members: membersByFamily[family.family_id] || [],
      };
    };

    // 6) Attach members and rootMembers
    const enrichedCurrentFamily = await attachRootMembers(currentFamily);
    const enrichedAncestors = await Promise.all(
      ancestors.map(async f => {
        const fam = await sequelize.query(
          `SELECT male_root_member, female_root_member FROM families WHERE family_id = :familyId`,
          { replacements: { familyId: f.family_id }, type: QueryTypes.SELECT }
        );
        return attachRootMembers({ ...f, ...fam[0] });
      })
    );
    const enrichedDescendants = await Promise.all(
      descendants.map(async f => {
        const fam = await sequelize.query(
          `SELECT male_root_member, female_root_member FROM families WHERE family_id = :familyId`,
          { replacements: { familyId: f.family_id }, type: QueryTypes.SELECT }
        );
        return attachRootMembers({ ...f, ...fam[0] });
      })
    );

    return res.json({
      currentFamily: enrichedCurrentFamily,
      ancestors: enrichedAncestors,
      descendants: enrichedDescendants,
    });
  } catch (err) {
    console.error("Error in getFamilyAncestorsAndDescendants:", err);
    return res.status(500).json({ error: err.message });
  }
}
