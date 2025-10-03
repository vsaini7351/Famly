// // controllers/familyController.js
// import { QueryTypes } from "sequelize";
// import { sequelize } from "../db/index.js";
// import { Membership ,User,Family} from "../models/index.js";
// export async function getFamilyAncestorsAndDescendants(req, res) {
//   try {
//     const familyId = Number(req.params.familyId ?? req.body.familyId);
//     if (!familyId) {
//       return res.status(400).json({ error: "familyId required" });
//     }

//     // 1) Ancestors query (positive depth, limited to 5)
//     const ancestorQuery = `
//       WITH RECURSIVE ancestors AS (
//         SELECT f.family_id, f.family_name, f.familyPhoto, f.ancestor, 0 AS depth, ARRAY[f.family_id] AS path
//         FROM families f
//         WHERE f.family_id = :familyId

//         UNION ALL

//         SELECT f.family_id, f.family_name, f.familyPhoto, f.ancestor, a.depth + 1, a.path || f.family_id
//         FROM families f
//         JOIN ancestors a ON f.family_id = a.ancestor
//         WHERE NOT f.family_id = ANY(a.path)
//           AND a.depth < 5
//       )
//       SELECT family_id, family_name, familyPhoto, depth
//       FROM ancestors
//       WHERE depth > 0
//       ORDER BY depth ASC
//       LIMIT 5;
//     `;

//     // 2) Descendants query (negative depth, limited to -5)
//     const descendantQuery = `
//       WITH RECURSIVE descendants AS (
//         SELECT f.family_id, f.family_name, f.familyPhoto, f.ancestor, 0 AS depth, ARRAY[f.family_id] AS path
//         FROM families f
//         WHERE f.family_id = :familyId

//         UNION ALL

//         SELECT f.family_id, f.family_name, f.familyPhoto, f.ancestor, d.depth - 1, d.path || f.family_id
//         FROM families f
//         JOIN descendants d ON f.ancestor = d.family_id
//         WHERE NOT f.family_id = ANY(d.path)
//           AND d.depth > -5
//       )
//       SELECT family_id, family_name, familyPhoto, depth
//       FROM descendants
//       WHERE depth < 0
//       ORDER BY depth DESC
//       LIMIT 5;
//     `;

//     const ancestors = await sequelize.query(ancestorQuery, {
//       replacements: { familyId },
//       type: QueryTypes.SELECT,
//     });

//     const descendants = await sequelize.query(descendantQuery, {
//       replacements: { familyId },
//       type: QueryTypes.SELECT,
//     });

//     // 3) Fetch current family info
//     const [currentFamily] = await sequelize.query(
//       `
//       SELECT f.family_id, f.family_name, f.familyPhoto, 0 AS depth
//       FROM families f
//       WHERE f.family_id = :familyId
//       `,
//       {
//         replacements: { familyId },
//         type: QueryTypes.SELECT,
//       }
//     );

//     // 4) Collect all family IDs to fetch members
//     const familiesToFetch = [
//       familyId, // include current family
//       ...ancestors.map(f => f.family_id),
//       ...descendants.map(f => f.family_id),
//     ];

//     let members = [];
//     if (familiesToFetch.length > 0) {
//       members = await sequelize.query(
//         `
//         SELECT m.family_id, u.user_id, u.fullname AS name, u.profilePhoto
//         FROM memberships m
//         JOIN users u ON u.user_id = m.user_id
//         WHERE m.family_id = ANY(:familyIds)
//         `,
//         {
//           replacements: { familyIds: familiesToFetch },
//           type: QueryTypes.SELECT,
//         }
//       );
//     }

//     // 5) Group members by family
//     const membersByFamily = members.reduce((acc, m) => {
//       if (!acc[m.family_id]) acc[m.family_id] = [];
//       acc[m.family_id].push({
//         user_id: m.user_id,
//         name: m.name,
//         profilePhoto: m.profilePhoto,
//       });
//       return acc;
//     }, {});

//     // 6) Attach members into all families
//     const enrichedAncestors = ancestors.map(f => ({
//       ...f,
//       members: membersByFamily[f.family_id] || [],
//     }));

//     const enrichedDescendants = descendants.map(f => ({
//       ...f,
//       members: membersByFamily[f.family_id] || [],
//     }));

//     const enrichedCurrentFamily = {
//       ...currentFamily,
//       members: membersByFamily[currentFamily.family_id] || [],
//     };

//     return res.json({
//       currentFamily: enrichedCurrentFamily,
//       ancestors: enrichedAncestors,
//       descendants: enrichedDescendants,
//     });
//   } catch (err) {
//     console.error("Error in getFamilyAncestorsAndDescendants:", err);
//     return res.status(500).json({ error: err.message });
//   }
// }

import { QueryTypes } from "sequelize";
import { sequelize } from "../db/index.js";
import { Membership, User, Family } from "../models/index.js";

export async function getFamilyAncestorsAndDescendants(req, res) {
  try {
    const familyId = Number(req.params.familyId ?? req.body.familyId);
    if (!familyId) {
      return res.status(400).json({ error: "familyId required" });
    }

    // 1) Ancestors query (positive depth, limited to 5)
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
          AND a.depth < 5
      )
      SELECT family_id, family_name, "familyPhoto", depth
      FROM ancestors
      WHERE depth > 0
      ORDER BY depth ASC
      LIMIT 5;
    `;

    // 2) Descendants query (negative depth, limited to -5)
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
          AND d.depth > -5
      )
      SELECT family_id, family_name, "familyPhoto", depth
      FROM descendants
      WHERE depth < 0
      ORDER BY depth DESC
      LIMIT 5;
    `;

    const ancestors = await sequelize.query(ancestorQuery, {
      replacements: { familyId },
      type: QueryTypes.SELECT,
    });

    const descendants = await sequelize.query(descendantQuery, {
      replacements: { familyId },
      type: QueryTypes.SELECT,
    });

    // 3) Fetch current family info
    const [currentFamily] = await sequelize.query(
      `
      SELECT f.family_id, f.family_name, f."familyPhoto", 0 AS depth
      FROM families f
      WHERE f.family_id = :familyId
      `,
      {
        replacements: { familyId },
        type: QueryTypes.SELECT,
      }
    );

    // 4) Collect all family IDs to fetch members
    const familiesToFetch = [
      familyId, // include current family
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
        WHERE m.family_id = ANY(:familyIds)
        `,
        {
          replacements: { familyIds: familiesToFetch },
          type: QueryTypes.SELECT,
        }
      );
    }

    // 5) Group members by family
    const membersByFamily = members.reduce((acc, m) => {
      if (!acc[m.family_id]) acc[m.family_id] = [];
      acc[m.family_id].push({
        user_id: m.user_id,
        name: m.name,
        profilePhoto: m.profilePhoto,
      });
      return acc;
    }, {});

    // 6) Attach members into all families
    const enrichedAncestors = ancestors.map(f => ({
      ...f,
      members: membersByFamily[f.family_id] || [],
    }));

    const enrichedDescendants = descendants.map(f => ({
      ...f,
      members: membersByFamily[f.family_id] || [],
    }));

    const enrichedCurrentFamily = {
      ...currentFamily,
      members: membersByFamily[currentFamily.family_id] || [],
    };

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

