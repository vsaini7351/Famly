// import puppeteer from "puppeteer";
// import { Story } from "../models/story.models.js";
// import { User, Family, Membership } from "../models/index.js";

// export const generateFamilyStoriesPDF = async (req, res) => {
//   try {
//     const { familyId } = req.params;
//     if (!familyId) return res.status(400).json({ error: "familyId is required" });

//     const family = await Family.findByPk(familyId);
//     if (!family) return res.status(404).json({ error: "Family not found" });

//     const rootMemberIds = [family.male_root_member, family.female_root_member].filter(Boolean);
//     const rootMembers = await User.findAll({ where: { user_id: rootMemberIds } });
//     const rootMap = {};
//     rootMembers.forEach(u => rootMap[u.user_id] = { name: u.fullname, profilePhoto: u.profilePhoto });

//     const memberships = await Membership.findAll({ where: { family_id: familyId } });
//     const memberIds = memberships.map(m => m.user_id).filter(id => !rootMemberIds.includes(id));
//     const members = await User.findAll({ where: { user_id: memberIds } });

//     const stories = await Story.find({ family_id: parseInt(familyId) })
//       .sort({ memory_date: 1, createdAt: 1 });

//     let html = `
//     <html>
//       <head>
//         <style>
//           body { font-family: Arial, sans-serif; margin: 0; padding: 0; background: #fefefe; }
//           .cover { text-align: center; padding: 40px 20px; background: #e0f7fa; border-bottom: 4px solid #00796b; }
//           .cover h1 { font-size: 36px; margin-bottom: 10px; color: #004d40; }
//           .cover p { font-size: 16px; color: #00695c; margin-bottom: 5px; }
//           .members { font-size: 14px; color: #004d40; margin-top: 10px; }
//           .memories { padding: 20px; display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
//           .memory { border: 2px solid #00796b; border-radius: 10px; padding: 10px; page-break-inside: avoid; display: flex; flex-direction: column; }
//           .memory h2 { margin: 0 0 10px 0; font-size: 16px; color: #004d40; text-align: center; }
//           .memory img { border-radius: 6px; margin-bottom: 8px; max-width: 100%; object-fit: cover; }
//           .memory .caption { font-size: 14px; color: #555; text-align: justify; }
//           .memory.landscape img { width: 100%; }
//           .memory.portrait { flex-direction: row; align-items: flex-start; }
//           .memory.portrait img { max-width: 40%; margin-right: 12px; }
//           .memory.portrait .caption { flex: 1; }
//           .footer { text-align: center; padding: 20px; border-top: 2px solid #00796b; font-size: 12px; color: #555; }
//           @media print {
//             .memories { display: block; }
//             .memory { page-break-inside: avoid; margin-bottom: 20px; }
//           }
//         </style>
//       </head>
//       <body>
//         <div class="cover">
//           <h1>Beautiful Memories of ${family.family_name}</h1>
//           ${family.description ? `<p>${family.description}</p>` : ""}
//           <p class="members">
//             Root Members: 
//             ${rootMap[family.male_root_member] ? rootMap[family.male_root_member].name : 'N/A'} (M), 
//             ${rootMap[family.female_root_member] ? rootMap[family.female_root_member].name : 'N/A'} (F)
//           </p>
//           ${members.length ? `<p class="members">Other Members: ${members.map(m => m.fullname).join(', ')}</p>` : ""}
//         </div>

//         <div class="memories">
//     `;

//     stories.forEach(story => {
//       const memoryDate = new Date(story.memory_date).toLocaleDateString();

//       story.media.forEach(media => {
//         if (media.type === "image") {
//           const orientation = media.width && media.height && media.width > media.height ? 'landscape' : 'portrait';
//           html += `
//             <div class="memory ${orientation}">
//               <h2>${memoryDate}</h2>
//               <img src="${media.url}" />
//               ${media.text ? `<p class="caption">${media.text}</p>` : ""}
//             </div>
//           `;
//         }
//       });
//     });

//     html += `
//         </div>
//         <div class="footer">Made with love for preserving precious family moments</div>
//       </body>
//     </html>
//     `;

//     const browser = await puppeteer.launch({ headless: true });
//     const page = await browser.newPage();
//     await page.setContent(html, { waitUntil: 'networkidle0' });

//     const pdfBuffer = await page.pdf({
//       format: 'A4',
//       printBackground: true,
//       margin: { top: '20px', bottom: '20px', left: '20px', right: '20px' }
//     });

//     await browser.close();

//     res.set({
//       "Content-Type": "application/pdf",
//       "Content-Disposition": `attachment; filename="family_${familyId}_memories.pdf"`,
//       "Content-Length": pdfBuffer.length,
//     });
//     res.send(pdfBuffer);

//   } catch (error) {
//     console.error("PDF generation error:", error);
//     res.status(500).json({ error: "Failed to generate PDF" });
//   }
// };

import puppeteer from "puppeteer"; 
import { Story } from "../models/story.models.js";
import { User, Family, Membership } from "../models/index.js";

export const generateFamilyStoriesPDF = async (req, res) => {
  try {
    const { familyId } = req.params;
    if (!familyId) return res.status(400).json({ error: "familyId is required" });

    // Fetch family info
    const family = await Family.findByPk(familyId);
    if (!family) return res.status(404).json({ error: "Family not found" });

    // Root members
    const rootMemberIds = [family.male_root_member, family.female_root_member].filter(Boolean);
    const rootMembers = await User.findAll({ where: { user_id: rootMemberIds } });

    // Other members
    const memberships = await Membership.findAll({ where: { family_id: familyId } });
    const memberIds = memberships.map(m => m.user_id).filter(id => !rootMemberIds.includes(id));
    const members = await User.findAll({ where: { user_id: memberIds } });

    // Build a unified user map (root + other members)
    const userMap = {};
    [...rootMembers, ...members].forEach(u => {
      userMap[u.user_id] = { name: u.fullname, profilePhoto: u.profilePhoto };
    });

    // Fetch all stories
    const stories = await Story.find({ family_id: parseInt(familyId) })
      .sort({ memory_date: 1, createdAt: 1 });

    // Build HTML
    let html = `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 0; background: #fefefe; }
          .cover { text-align: center; padding: 40px 20px; background: #e0f7fa; border-bottom: 4px solid #00796b; }
          .cover h1 { font-size: 36px; margin-bottom: 10px; color: #004d40; }
          .cover p { font-size: 16px; color: #00695c; margin-bottom: 5px; }
          .members { font-size: 14px; color: #004d40; margin-top: 10px; }
          .memories { padding: 20px; display: block; }
          .memory {
            border: 2px solid #00796b;
            border-radius: 10px;
            padding: 12px;
            margin-bottom: 20px;
            page-break-inside: avoid;
            background: #fff;
          }
          .memory .header { margin-bottom: 8px; }
          .username {
            font-size: 18px;
            font-weight: bold;
            color: #004d40;
          }
          .date {
            font-size: 14px;
            color: #777;
            margin-left: 6px;
          }
          .memory img {
            border-radius: 6px;
            margin-bottom: 8px;
            max-width: 100%;
            height: auto;
            object-fit: cover;
          }
          .memory.landscape img { width: 100%; }
          .memory.portrait {
            display: flex;
            flex-direction: row;
            align-items: flex-start;
          }
          .memory.portrait img {
            max-width: 40%;
            margin-right: 12px;
          }
          .memory.portrait .details {
            flex: 1;
            display: flex;
            flex-direction: column;
          }
          .caption {
            font-size: 14px;
            color: #555;
            margin-top: 6px;
            text-align: justify;
          }
          .footer {
            text-align: center;
            padding: 20px;
            border-top: 2px solid #00796b;
            font-size: 12px;
            color: #555;
          }
        </style>
      </head>
      <body>
        <div class="cover">
          <h1>Beautiful Memories of ${family.family_name}</h1>
          ${family.description ? `<p>${family.description}</p>` : ""}
          <p class="members">
            Root Members: 
            ${userMap[family.male_root_member]?.name || 'N/A'} (M), 
            ${userMap[family.female_root_member]?.name || 'N/A'} (F)
          </p>
          ${members.length ? `<p class="members">Other Members: ${members.map(m => m.fullname).join(', ')}</p>` : ""}
        </div>

        <div class="memories">
    `;

    // Build stories layout
    stories.forEach(story => {
      const memoryDate = new Date(story.memory_date).toLocaleDateString();
      const uploader = userMap[story.uploaded_by]?.name || "Unknown User";

      story.media.forEach(media => {
        if (media.type === "image") {
          const orientation = media.width && media.height && media.width > media.height ? "landscape" : "portrait";

          if (orientation === "landscape") {
            html += `
              <div class="memory landscape">
                <div class="header">
                  <span class="username">${uploader}</span> 
                  <span class="date">(${memoryDate})</span>
                </div>
                <img src="${media.url}" />
                ${media.text ? `<p class="caption">${media.text}</p>` : ""}
              </div>
            `;
          } else {
            html += `
              <div class="memory portrait">
                <img src="${media.url}" />
                <div class="details">
                  <div class="header">
                    <span class="username">${uploader}</span> 
                    <span class="date">(${memoryDate})</span>
                  </div>
                  ${media.text ? `<p class="caption">${media.text}</p>` : ""}
                </div>
              </div>
            `;
          }
        }
      });
    });

    html += `
        </div>
        <div class="footer">Made with love for preserving precious family moments</div>
      </body>
    </html>
    `;

    // Generate PDF
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '20px', bottom: '20px', left: '20px', right: '20px' }
    });

    await browser.close();

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="family_${familyId}_memories.pdf"`,
      "Content-Length": pdfBuffer.length,
    });
    res.send(pdfBuffer);

  } catch (error) {
    console.error("PDF generation error:", error);
    res.status(500).json({ error: "Failed to generate PDF" });
  }
};
