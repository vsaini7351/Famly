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
//           ${family.description ? <p>${family.description}</p> : ""}
//           <p class="members">
//             Root Members: 
//             ${rootMap[family.male_root_member] ? rootMap[family.male_root_member].name : 'N/A'} (M), 
//             ${rootMap[family.female_root_member] ? rootMap[family.female_root_member].name : 'N/A'} (F)
//           </p>
//           ${members.length ? <p class="members">Other Members: ${members.map(m => m.fullname).join(', ')}</p> : ""}
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
//               ${media.text ? <p class="caption">${media.text}</p> : ""}
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
//       "Content-Disposition": attachment; filename="family_${familyId}_memories.pdf",
//       "Content-Length": pdfBuffer.length,
//     });
//     res.send(pdfBuffer);

//   } catch (error) {
//     console.error("PDF generation error:", error);
//     res.status(500).json({ error: "Failed to generate PDF" });
//   }
// };

// import puppeteer from "puppeteer"; 
// import { Story } from "../models/story.models.js";
// import { User, Family, Membership } from "../models/index.js";


// export const generateFamilyStoriesPDF = async (req, res) => {
//   try {
//     const { familyId } = req.params;
//     const { title, subtitle, description } = req.body; // ✅ Added new dynamic fields

//     if (!familyId) return res.status(400).json({ error: "familyId is required" });

//     // Fetch family info
//     const family = await Family.findByPk(familyId);
//     if (!family) return res.status(404).json({ error: "Family not found" });

//     // Root members
//     const rootMemberIds = [family.male_root_member, family.female_root_member].filter(Boolean);
//     const rootMembers = await User.findAll({ where: { user_id: rootMemberIds } });

//     // Other members
//     const memberships = await Membership.findAll({ where: { family_id: familyId } });
//     const memberIds = memberships.map(m => m.user_id).filter(id => !rootMemberIds.includes(id));
//     const members = await User.findAll({ where: { user_id: memberIds } });

//     // Build user map
//     const userMap = {};
//     [...rootMembers, ...members].forEach(u => {
//       userMap[u.user_id] = { name: u.fullname, profilePhoto: u.profilePhoto };
//     });

//     // Fetch stories
//     const stories = await Story.find({ family_id: parseInt(familyId) })
//       .sort({ memory_date: 1, createdAt: 1 });

//     // Build HTML
//     let html = `
//     <html>
//       <head>
//         <style>
    
//         body {
//           font-family: "Poppins", Arial, sans-serif;
//           margin: 0;
//           padding: 0;
//           background: linear-gradient(to bottom right, #f0fdf4, #e0f2fe);
//           color: #2e2e2e;
//         }

//         /* Cover Section */
//         .cover {
//           text-align: center;
//           padding: 60px 20px;
//           background: linear-gradient(135deg, #a7f3d0, #93c5fd);
//           border-bottom: 3px solid #2563eb;
//           border-radius: 0 0 25px 25px;
//           box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
//         }

//         .cover h1 {
//           font-size: 40px;
//           margin-bottom: 10px;
//           color: #1e3a8a;
//         }

//         .cover h2 {
//           font-size: 22px;
//           margin-bottom: 8px;
//           color: #1d4ed8;
//         }

//         .cover p.desc {
//           font-size: 15px;
//           color: #0f172a;
//           margin: 15px auto;
//           max-width: 700px;
//           line-height: 1.6;
//         }

//         .members {
//           font-size: 14px;
//           color: #0f172a;
//           margin-top: 10px;
//         }

//         /* Memories Section */
//         .memories {
//           padding: 30px 20px;
//           display: block;
//         }

//         .memory {
//           border: none;
//           border-radius: 16px;
//           background: #ffffffcc;
//           padding: 16px;
//           margin-bottom: 24px;
//           box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
//           page-break-inside: avoid;
//           transition: transform 0.2s ease, box-shadow 0.2s ease;
//         }

//         .memory:hover {
//           transform: translateY(-2px);
//           box-shadow: 0 6px 14px rgba(0, 0, 0, 0.12);
//         }

//         .memory .header {
//           margin-bottom: 8px;
//         }

//         .username {
//           font-size: 18px;
//           font-weight: 600;
//           color: #1e40af;
//         }

//         .date {
//           font-size: 14px;
//           color: #6b7280;
//           margin-left: 6px;
//         }

//         .memory img {
//           border-radius: 10px;
//           margin-bottom: 10px;
//           max-width: 100%;
//           height: auto;
//           object-fit: cover;
//         }

//         .memory.landscape img {
//           width: 100%;
//         }

//         .memory.portrait {
//           display: flex;
//           flex-direction: row;
//           align-items: flex-start;
//           gap: 14px;
//         }

//         .memory.portrait img {
//           max-width: 40%;
//         }

//         .memory.portrait .details {
//           flex: 1;
//           display: flex;
//           flex-direction: column;
//         }

//         .caption {
//           font-size: 14px;
//           color: #374151;
//           margin-top: 6px;
//           text-align: justify;
//           line-height: 1.5;
//         }

//         /* Footer Section */
//         .footer {
//           text-align: center;
//           padding: 25px;
//           border-top: 2px solid #2563eb;
//           font-size: 13px;
//           color: #1e3a8a;
//           background: linear-gradient(to right, #bfdbfe, #a7f3d0);
//           border-radius: 25px 25px 0 0;
//           margin-top: 40px;
//         }
//       </style>
//       </head>
//       <body>
//         <div class="cover">
//           <h1>${title || `Beautiful Memories of ${family.family_name}`}</h1>
//           ${subtitle ? `<h2>${subtitle}</h2>` : ""}
//           <p class="desc">${description || family.description || ""}</p>
//           <p class="members">
//             Root Members: 
//             ${userMap[family.male_root_member]?.name || 'N/A'} (M), 
//             ${userMap[family.female_root_member]?.name || 'N/A'} (F)
//           </p>
//           ${members.length ? `<p class="members">Other Members: ${members.map(m => m.fullname).join(', ')}</p>` : ""}
//         </div>

//         <div class="memories">
//     `;

//     // Build stories layout
//     stories.forEach(story => {
//       const memoryDate = new Date(story.memory_date).toLocaleDateString();
//       const uploader = userMap[story.uploaded_by]?.name || "Unknown User";

//       story.media.forEach(media => {
//         if (media.type === "image") {
//           const orientation = media.width && media.height && media.width > media.height ? "landscape" : "portrait";

//           if (orientation === "landscape") {
//             html += `
//               <div class="memory landscape">
//                 <div class="header">
//                   <span class="username">${uploader}</span> 
//                   <span class="date">(${memoryDate})</span>
//                 </div>
//                 <img src="${media.url}" />
//                 ${media.text ? `<p class="caption">${media.text}</p>` : ""}
//               </div>
//             `;
//           } else {
//             html += `
//               <div class="memory portrait">
//                 <img src="${media.url}" />
//                 <div class="details">
//                   <div class="header">
//                     <span class="username">${uploader}</span> 
//                     <span class="date">(${memoryDate})</span>
//                   </div>
//                   ${media.text ? `<p class="caption">${media.text}</p>` : ""}
//                 </div>
//               </div>
//             `;
//           }
//         }
//       });
//     });

//     html += `
//         </div>
//         <div class="footer">Made with love for preserving precious family moments</div>
//       </body>
//     </html>
//     `;

//     // Generate PDF
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

// --- DESIGN & TEMPLATE SECTION (No changes needed here) ---

const getCssTemplate = () => `
  @import url('https://fonts.googleapis.com/css2?family=Lora:wght@500;700&family=Poppins:wght@400;600&display=swap');
  :root {
    --font-heading: 'Lora', serif;
    --font-body: 'Poppins', sans-serif;
    --color-text-dark: #3a3a3a;
    --color-text-light: #5e5e5e;
    --color-card-bg: #fdfcff;
    --color-border: #e9e4f0;
    --page-padding: 1.2cm;
  }
  * { box-sizing: border-box; }
  body {
    font-family: var(--font-body);
    color: var(--color-text-dark);
    background: linear-gradient(to bottom right, #f0fdf4, #f5f3ff);
    -webkit-print-color-adjust: exact;
    margin: 0;
  }
  .page {
    page-break-after: always;
    padding: var(--page-padding);
    position: relative;
    overflow: hidden;
    height: 297mm;
    width: 210mm;
  }
  .page:last-of-type { page-break-after: auto; }
  .cover-page {
    display: flex; flex-direction: column; justify-content: center; align-items: center;
    text-align: center; height: 100%;
    background: linear-gradient(135deg, #e0f2fe, #d8b4fe, #a7f3d0);
  }
  .cover-page h1 { font-family: var(--font-heading); font-size: 40pt; color: white; text-shadow: 2px 2px 6px rgba(0,0,0,0.2); margin: 0; }
  .cover-page h2 { font-size: 16pt; color: white; margin: 10px 0 30px 0; opacity: 0.9; }
  .cover-page .description { font-size: 11pt; max-width: 60ch; color: white; line-height: 1.6; opacity: 0.95; margin-bottom: 40px; }
  .cover-page .members-section {
    background: rgba(255, 255, 255, 0.25); border: 1px solid rgba(255, 255, 255, 0.4);
    backdrop-filter: blur(10px); border-radius: 12px; padding: 20px 30px; color: #2e2e2e;
  }
  .members-section p { margin: 5px 0; font-weight: 600; font-size: 10pt; }
  .members-section span { font-weight: 400; }
  .memory-card {
    background: var(--color-card-bg);
    border: 1px solid var(--color-border);
    border-radius: 16px;
    padding: 24px;
    margin-bottom: 25px;
    box-shadow: 0 6px 20px rgba(100, 80, 130, 0.08);
    page-break-inside: avoid;
  }
  .memory-card .header { margin-bottom: 16px; }
  .header .username { font-size: 14pt; font-weight: 600; color: #6d28d9; }
  .header .date { font-size: 10pt; color: var(--color-text-light); margin-left: 8px; }
  .image-container {
    width: 100%;
    aspect-ratio: 16 / 9;
    border-radius: 10px;
    overflow: hidden;
    background-color: #f0f0f0;
    margin-bottom: 16px;
  }
  .image-container img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .caption {
    font-size: 11pt;
    color: var(--color-text-light);
    line-height: 1.7;
    text-align: justify;
  }
`;

const createHtmlDocument = (content, css) => `
  <html>
    <head><style>${css}</style></head>
    <body>${content}</body>
  </html>
`;

// --- MAIN PDF GENERATION LOGIC ---

export const generateFamilyStoriesPDF = async (req, res) => {
  try {
    const { familyId } = req.params;
    const { title, subtitle, description } = req.body;

    if (!familyId) return res.status(400).json({ error: "familyId is required" });

    // Data Fetching
    const family = await Family.findByPk(familyId);
    if (!family) return res.status(404).json({ error: "Family not found" });

    const rootMemberIds = [family.male_root_member, family.female_root_member].filter(Boolean);
    const rootMembers = await User.findAll({ where: { user_id: rootMemberIds } });
    
    const memberships = await Membership.findAll({ where: { family_id: familyId } });
    const memberIds = memberships.map(m => m.user_id).filter(id => !rootMemberIds.includes(id));
    const members = await User.findAll({ where: { user_id: memberIds } });

    const userMap = {};
    [...rootMembers, ...members].forEach(u => {
      userMap[u.user_id] = { name: u.fullname };
    });

    // ✅ FIX 1: Removed parseInt() to correctly query MongoDB with a string ID.
    const stories = await Story.find({ family_id: familyId })
      .sort({ memory_date: 1 });

    // HTML Page Construction
    let htmlContent = '';

    // 1. Cover Page
    const maleRootName = userMap[family.male_root_member]?.name || 'N/A';
    const femaleRootName = userMap[family.female_root_member]?.name || 'N/A';
    htmlContent += `
      <div class="page cover-page">
        <h1>${title || `The ${family.family_name} Family`}</h1>
        <h2>${subtitle || 'Our Beautiful Memories'}</h2>
        <p class="description">${description || 'A collection of cherished moments, stories, and milestones that define our family.'}</p>
        <div class="members-section">
          <p>Root Members: <span>${maleRootName} & ${femaleRootName}</span></p>
          ${members.length ? `<p>Family: <span>${members.map(m => m.fullname).join(', ')}</span></p>` : ''}
        </div>
      </div>
    `;

    // ✅ FIX 2: Added pagination logic to create new pages for long lists of memories.
    const allMediaItems = [];
    stories.forEach(story => {
        story.media.forEach(media => {
            if (media.type === 'image') {
                allMediaItems.push({
                    uploader: userMap[story.uploaded_by]?.name || "Unknown",
                    memoryDate: new Date(story.memory_date).toLocaleDateString('en-US', { month: 'long', year: 'numeric', day: 'numeric' }),
                    url: media.url,
                    text: media.text
                });
            }
        });
    });

    const itemsPerPage = 2; // Display 2 memories per page
    for (let i = 0; i < allMediaItems.length; i += itemsPerPage) {
        const pageItems = allMediaItems.slice(i, i + itemsPerPage);
        let pageHtml = '<div class="page memories-page">';
        
        pageItems.forEach(item => {
            const captionHtml = item.text ? `<p class="caption">${item.text}</p>` : '';
            pageHtml += `
              <div class="memory-card">
                <div class="header">
                  <span class="username">${item.uploader}</span>
                  <span class="date">${item.memoryDate}</span>
                </div>
                <div class="image-container">
                  <img src="${item.url}" alt="Family memory" />
                </div>
                ${captionHtml}
              </div>
            `;
        });

        pageHtml += '</div>';
        htmlContent += pageHtml;
    }


    // PDF Generation
    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
    const page = await browser.newPage();
    
    const finalHtml = createHtmlDocument(htmlContent, getCssTemplate());
    await page.setContent(finalHtml, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      displayHeaderFooter: true,
      headerTemplate: `
        <div style="font-family: 'Poppins', sans-serif; font-size: 9pt; color: #a0aec0; width: 100%; text-align: center; padding-top: 0.5cm;">
          Famly — Beautiful Memories
        </div>`,
      footerTemplate: `
        <div style="font-family: 'Poppins', sans-serif; font-size: 9pt; color: #a0aec0; width: 100%; text-align: center; padding-bottom: 0.5cm;">
          Made with love for preserving precious family moments 💖
        </div>`,
      margin: { top: '1.5cm', bottom: '1.5cm', left: '0', right: '0' }
    });

    await browser.close();

    // Send Response
    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${family.family_name}_Memories.pdf"`,
    });
    res.send(pdfBuffer);

  } catch (error) {
    console.error("PDF generation error:", error);
    res.status(500).json({ error: "Failed to generate PDF." });
  }
};