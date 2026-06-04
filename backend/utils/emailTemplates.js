/**
 * Generates a premium, responsive HTML email template for applicant status updates.
 * @param {string} studentName - The name of the student.
 * @param {string} companyName - The name of the company.
 * @param {string} status - The new recruitment status.
 * @returns {Object} - Object containing subject, text (fallback), and html.
 */
export const generateStatusUpdateEmail = (studentName, companyName, status) => {
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
  const dashboardUrl = `${frontendUrl}/student/applications`;
  
  // Define status details: title, badge color, status text, icons, action items
  let statusTitle = "";
  let badgeBg = "";
  let badgeText = "";
  let statusIcon = "";
  let statusDescription = "";
  let nextSteps = [];
  let timelineSteps = ["Applied", "Round1", "Round2", "HR", "Selected"];
  
  // Custom styling and text content based on the application status
  switch (status) {
    case "Applied":
      statusTitle = "Application Received Successfully";
      badgeBg = "#f0f9ff"; // light blue
      badgeText = "#0369a1"; // dark blue
      statusIcon = "📥";
      statusDescription = `Your profile has been submitted for consideration at <strong>${companyName}</strong>. The placement cell and the company recruitment team will review your application details shortly.`;
      nextSteps = [
        "Ensure your resume and academic profile details are up to date on your dashboard.",
        "Review the company profile, job description, and core requirements to align your skills.",
        "Keep a regular check on your placement portal and email for screening results."
      ];
      break;
      
    case "Round1":
      statusTitle = "Shortlisted for Round 1 (Technical Screening)";
      badgeBg = "#faf5ff"; // light violet
      badgeText = "#6b21a8"; // dark violet
      statusIcon = "🚀";
      statusDescription = `Congratulations! You have been shortlisted for <strong>Round 1</strong> of the recruitment process for <strong>${companyName}</strong>. This stage typically involves technical assessments, coding challenges, or foundational aptitude tests.`;
      nextSteps = [
        "Practice coding challenges on platforms like LeetCode, HackerRank, or GeeksforGeeks.",
        "Revise core computer science concepts including Data Structures, Algorithms, and DBMS.",
        "Ensure you have a stable internet connection, working webcam, and a quiet environment before starting the test."
      ];
      break;
      
    case "Round2":
      statusTitle = "Promoted to Round 2 (Technical Interview)";
      badgeBg = "#fdf4ff"; // light magenta
      badgeText = "#701a75"; // dark magenta
      statusIcon = "💻";
      statusDescription = `Excellent job! You have cleared the initial round and are now invited to <strong>Round 2 (Technical Interview / System Design)</strong> for <strong>${companyName}</strong>. This round focuses deeper on your technical expertise, architectural design skills, and past projects.`;
      nextSteps = [
        "Be ready to explain the architecture, design choices, and key challenges of your major projects.",
        "Practice writing clean code and explaining your logic clearly to the interviewer.",
        "Brush up on Object-Oriented Programming (OOP) principles, system design basics, and databases."
      ];
      break;
      
    case "HR":
      statusTitle = "Shortlisted for final HR Round";
      badgeBg = "#fdf2f8"; // light pink
      badgeText = "#9d174d"; // dark pink
      statusIcon = "👥";
      statusDescription = `Fantastic news! You have successfully passed all the technical screening rounds and are now entering the final stage: the <strong>HR Interview</strong> for <strong>${companyName}</strong>. This session evaluates behavioral skills, cultural alignment, and career aspirations.`;
      nextSteps = [
        "Prepare structured answers using the STAR method (Situation, Task, Action, Result) for behavioral questions.",
        "Thoroughly research the company's core values, mission statement, and latest achievements.",
        "Prepare thoughtful questions to ask the HR manager at the end of your interview."
      ];
      break;
      
    case "Selected":
      statusTitle = "🎉 Huge Congratulations! You are Selected! 🎉";
      badgeBg = "#ecfdf5"; // light emerald green
      badgeText = "#047857"; // dark emerald green
      statusIcon = "🏆";
      statusDescription = `We are absolutely thrilled to inform you that you have cleared all rounds and have been <strong>SELECTED</strong> for the role at <strong>${companyName}</strong>! Your dedication, talent, and hard work have yielded incredible results.`;
      nextSteps = [
        "Log in to your student dashboard to view application details and official coordinator remarks.",
        "Keep your documents ready for submission. The placement coordinator will contact you shortly regarding the formal offer letter.",
        "Take a moment to celebrate this wonderful achievement—you truly earned it!"
      ];
      break;
      
    case "Rejected":
      statusTitle = "Application Status Update";
      badgeBg = "#fef2f2"; // light red
      badgeText = "#991b1b"; // dark red
      statusIcon = "🛡️";
      statusDescription = `Thank you for taking the time to participate in the recruitment process for <strong>${companyName}</strong>. While your qualifications and performance were highly commendable, the selection committee has decided to proceed with other candidates whose profiles more closely match our current requirements.`;
      nextSteps = [
        "Keep your chin up! Rejection is merely redirection towards the right opportunity.",
        "Check the placement dashboard for other amazing active placement drives and apply.",
        "Schedule a mock session or resume review with the placement cell to refine your strategy for the next drive."
      ];
      // Timeline changes slightly for rejected candidates, we will highlight the rejection step at the end.
      timelineSteps = ["Applied", "Round1", "Round2", "HR", "Rejected"];
      break;
      
    default:
      statusTitle = "Application Status Updated";
      badgeBg = "#f3f4f6"; // light gray
      badgeText = "#374151"; // dark gray
      statusIcon = "📌";
      statusDescription = `Your application status for <strong>${companyName}</strong> has been updated to <strong>${status}</strong> by the administration team.`;
      nextSteps = [
        "Check your placement student dashboard for full details and latest notifications.",
        "Reach out to the placement coordinator if you have questions regarding this update."
      ];
  }

  // Generate plain text version (for email client fallback)
  const plainText = `Hello ${studentName},\n\nYour application status for ${companyName} has been updated to "${status}".\n\n${statusTitle}\n\nRecommended Next Steps:\n${nextSteps.map((step, idx) => `${idx + 1}. ${step}`).join("\n")}\n\nLogin to the dashboard to check full details: ${dashboardUrl}\n\nBest regards,\nSmart Placement Tracker Team`;

  // Generate the HTML with beautiful responsive styling
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Application Status Updated</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
  <style>
    body {
      background-color: #f6f9fc;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      margin: 0;
      padding: 0;
      -webkit-font-smoothing: antialiased;
      -ms-text-size-adjust: 100%;
      -webkit-text-size-adjust: 100%;
    }
    table {
      border-collapse: separate;
      mso-table-lspace: 0pt;
      mso-table-rspace: 0pt;
      width: 100%;
    }
    td {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      font-size: 14px;
      vertical-align: top;
    }
    .wrapper {
      background-color: #f6f9fc;
      width: 100%;
      padding: 40px 0;
    }
    .container {
      display: block;
      margin: 0 auto !important;
      max-width: 580px;
      padding: 10px;
      width: 580px;
    }
    .content {
      box-sizing: border-box;
      display: block;
      margin: 0 auto;
      max-width: 580px;
    }
    .main {
      background: #ffffff;
      border-radius: 16px;
      width: 100%;
      border: 1px solid #e2e8f0;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
      overflow: hidden;
    }
    .header-bar {
      background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
      padding: 30px 40px;
      text-align: center;
    }
    .header-bar h2 {
      color: #ffffff;
      font-size: 24px;
      font-weight: 700;
      margin: 0;
      letter-spacing: -0.5px;
    }
    .header-bar p {
      color: #e0e7ff;
      font-size: 14px;
      margin: 6px 0 0 0;
    }
    .body-content {
      padding: 40px;
    }
    .salutation {
      font-size: 18px;
      font-weight: 600;
      color: #1e293b;
      margin-top: 0;
      margin-bottom: 8px;
    }
    .intro-text {
      font-size: 15px;
      line-height: 1.6;
      color: #475569;
      margin-bottom: 24px;
    }
    .status-card {
      background-color: #f8fafc;
      border-radius: 12px;
      padding: 24px;
      border: 1px dashed #cbd5e1;
      text-align: center;
      margin-bottom: 28px;
    }
    .status-badge {
      display: inline-flex;
      align-items: center;
      padding: 8px 16px;
      border-radius: 9999px;
      font-size: 14px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      background-color: ${badgeBg};
      color: ${badgeText};
      margin-bottom: 12px;
    }
    .status-title {
      font-size: 18px;
      font-weight: 700;
      color: #0f172a;
      margin: 4px 0 8px 0;
    }
    .status-desc {
      font-size: 14px;
      line-height: 1.5;
      color: #475569;
      margin: 0;
    }
    .section-title {
      font-size: 15px;
      font-weight: 700;
      color: #1e293b;
      text-transform: uppercase;
      letter-spacing: 0.75px;
      margin-bottom: 14px;
      margin-top: 24px;
      border-left: 3px solid #4f46e5;
      padding-left: 8px;
    }
    .action-list {
      padding-left: 0;
      margin-top: 0;
      margin-bottom: 28px;
      list-style-type: none;
    }
    .action-item {
      position: relative;
      padding-left: 28px;
      margin-bottom: 12px;
      font-size: 14px;
      line-height: 1.5;
      color: #334155;
    }
    .action-item::before {
      content: "✓";
      position: absolute;
      left: 6px;
      top: 1px;
      color: #4f46e5;
      font-weight: bold;
      font-size: 14px;
    }
    .btn-container {
      text-align: center;
      margin-top: 30px;
      margin-bottom: 10px;
    }
    .btn-primary {
      background: linear-gradient(135deg, #4f46e5 0%, #4338ca 100%);
      border: none;
      border-radius: 8px;
      color: #ffffff !important;
      display: inline-block;
      font-size: 15px;
      font-weight: 600;
      text-decoration: none;
      padding: 12px 28px;
      box-shadow: 0 4px 10px rgba(79, 70, 229, 0.2);
      transition: all 0.2s ease;
    }
    
    /* Elegant Vertical Timeline Styles */
    .timeline {
      margin: 28px 0;
      padding-left: 10px;
    }
    .timeline-item {
      position: relative;
      padding-left: 30px;
      padding-bottom: 20px;
      border-left: 2px solid #e2e8f0;
    }
    .timeline-item:last-child {
      border-left: none;
      padding-bottom: 0;
    }
    .timeline-bullet {
      position: absolute;
      left: -7px;
      top: 2px;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background-color: #cbd5e1;
      border: 2px solid #ffffff;
      box-shadow: 0 0 0 1px #cbd5e1;
    }
    .timeline-bullet.completed {
      background-color: #10b981;
      box-shadow: 0 0 0 1px #10b981;
    }
    .timeline-bullet.active {
      background-color: #4f46e5;
      box-shadow: 0 0 0 1px #4f46e5;
      animation: pulse 2s infinite;
    }
    .timeline-bullet.rejected {
      background-color: #ef4444;
      box-shadow: 0 0 0 1px #ef4444;
    }
    .timeline-content {
      font-size: 13px;
      color: #64748b;
      font-weight: 500;
    }
    .timeline-content.completed {
      color: #0f172a;
      font-weight: 600;
    }
    .timeline-content.active {
      color: #4f46e5;
      font-weight: 700;
    }
    .timeline-content.rejected {
      color: #ef4444;
      font-weight: 700;
    }
    
    .footer {
      clear: both;
      margin-top: 20px;
      text-align: center;
      width: 100%;
    }
    .footer td {
      color: #94a3b8;
      font-size: 12px;
      line-height: 1.5;
      padding: 10px 20px 20px 20px;
    }
    .footer a {
      color: #64748b;
      text-decoration: underline;
    }
    @media only screen and (max-width: 620px) {
      table.body .container {
        width: 100% !important;
        max-width: 100% !important;
        padding: 0 !important;
      }
      table.body .main {
        border-radius: 0 !important;
        border-left: none !important;
        border-right: none !important;
      }
      .body-content {
        padding: 24px !important;
      }
      .header-bar {
        padding: 24px !important;
      }
    }
  </style>
</head>
<body>
  <table role="presentation" class="body">
    <tr>
      <td>&nbsp;</td>
      <td class="container">
        <div class="content">
          <!-- START CENTERED WHITE CONTAINER -->
          <table role="presentation" class="main">
            <!-- HEADER -->
            <tr>
              <td class="header-bar">
                <h2>Smart Placement Tracker</h2>
                <p>Campus Recruitment Management System</p>
              </td>
            </tr>
            <!-- BODY -->
            <tr>
              <td class="body-content">
                <p class="salutation">Hello ${studentName},</p>
                <p class="intro-text">We are writing to inform you that your application progress has been updated for the campus drive at <strong>${companyName}</strong>.</p>
                
                <!-- STATUS HIGHLIGHT CARD -->
                <div class="status-card">
                  <div class="status-badge">
                    <span>${statusIcon} &nbsp;${status}</span>
                  </div>
                  <h3 class="status-title">${statusTitle}</h3>
                  <p class="status-desc">${statusDescription}</p>
                </div>
                
                <!-- PROGRESS TIMELINE -->
                <div class="section-title">Application Timeline</div>
                <div class="timeline">
                  ${timelineSteps.map((step, idx) => {
                    const statusIndex = timelineSteps.indexOf(status);
                    const currentStepIndex = idx;
                    
                    let bulletClass = "";
                    let textClass = "";
                    
                    if (status === "Rejected" && step === "Rejected") {
                      bulletClass = "rejected";
                      textClass = "rejected";
                    } else if (currentStepIndex < statusIndex) {
                      bulletClass = "completed";
                      textClass = "completed";
                    } else if (currentStepIndex === statusIndex) {
                      bulletClass = "active";
                      textClass = "active";
                    } else {
                      bulletClass = "";
                      textClass = "";
                    }
                    
                    // Display names mapping
                    let stepName = step;
                    if (step === "Round1") stepName = "Technical Round 1";
                    if (step === "Round2") stepName = "Technical Round 2";
                    if (step === "HR") stepName = "HR Interview Round";
                    
                    return `
                      <div class="timeline-item">
                        <div class="timeline-bullet ${bulletClass}"></div>
                        <div class="timeline-content ${textClass}">
                          ${stepName}
                          ${currentStepIndex === statusIndex ? ` <span style="font-size: 11px; font-weight: normal; font-style: italic; color: #64748b;">(Current Stage)</span>` : ""}
                        </div>
                      </div>
                    `;
                  }).join("")}
                </div>
                
                <!-- NEXT STEPS -->
                <div class="section-title">Recommended Actions</div>
                <ul class="action-list">
                  ${nextSteps.map(step => `<li class="action-item">${step}</li>`).join("")}
                </ul>
                
                <!-- CALL TO ACTION -->
                <div class="btn-container">
                  <a href="${dashboardUrl}" target="_blank" class="btn-primary">View Dashboard Applications</a>
                </div>
              </td>
            </tr>
          </table>
          
          <!-- FOOTER -->
          <table role="presentation" class="footer">
            <tr>
              <td>
                This is an automated notification. Please do not reply directly to this email.<br>
                Placement Cell, Smart Placement Tracker © ${new Date().getFullYear()}<br>
                For support, contact the campus administrator or log in to the <a href="${frontendUrl}">placement portal</a>.
              </td>
            </tr>
          </table>
          <!-- END CENTERED WHITE CONTAINER -->
        </div>
      </td>
      <td>&nbsp;</td>
    </tr>
  </table>
</body>
</html>
  `;

  return {
    subject: `[Placement Update] Status updated for ${companyName} to ${status}`,
    text: plainText,
    html: html
  };
};

export const generateNewDriveEmail = (studentName, company) => {
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
  const dashboardUrl = `${frontendUrl}/student/companies`;

  const driveStartDateStr = company.driveStartDate ? new Date(company.driveStartDate).toLocaleDateString() : 'N/A';
  const driveDeadlineStr = company.driveDeadline ? new Date(company.driveDeadline).toLocaleDateString() : 'N/A';

  const plainText = `Hello ${studentName},\n\nA new placement drive has been announced for ${company.companyName}!\n\nPackage: ${company.package} LPA\nEligibility CGPA: >= ${company.eligibilityCgpa}\nAllowed Branches: ${company.allowedBranches?.join(', ') || 'All'}\nDrive Start Date: ${driveStartDateStr}\nApplication Deadline: ${driveDeadlineStr}\n\nLogin to the dashboard to apply: ${dashboardUrl}\n\nBest regards,\nPlacement Tracker Team`;

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Placement Drive Announced</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
  <style>
    body {
      background-color: #f6f9fc;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      margin: 0;
      padding: 0;
      -webkit-font-smoothing: antialiased;
      -ms-text-size-adjust: 100%;
      -webkit-text-size-adjust: 100%;
    }
    table {
      border-collapse: separate;
      mso-table-lspace: 0pt;
      mso-table-rspace: 0pt;
      width: 100%;
    }
    td {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      font-size: 14px;
      vertical-align: top;
    }
    .wrapper {
      background-color: #f6f9fc;
      width: 100%;
      padding: 40px 0;
    }
    .container {
      display: block;
      margin: 0 auto !important;
      max-width: 580px;
      padding: 10px;
      width: 580px;
    }
    .content {
      box-sizing: border-box;
      display: block;
      margin: 0 auto;
      max-width: 580px;
    }
    .main {
      background: #ffffff;
      border-radius: 16px;
      width: 100%;
      border: 1px solid #e2e8f0;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
      overflow: hidden;
    }
    .header-bar {
      background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
      padding: 30px 40px;
      text-align: center;
    }
    .header-bar h2 {
      color: #ffffff;
      font-size: 24px;
      font-weight: 700;
      margin: 0;
      letter-spacing: -0.5px;
    }
    .header-bar p {
      color: #dbeafe;
      font-size: 14px;
      margin: 6px 0 0 0;
    }
    .body-content {
      padding: 40px;
    }
    .salutation {
      font-size: 18px;
      font-weight: 600;
      color: #1e293b;
      margin-top: 0;
      margin-bottom: 8px;
    }
    .intro-text {
      font-size: 15px;
      line-height: 1.6;
      color: #475569;
      margin-bottom: 24px;
    }
    .details-card {
      background-color: #f8fafc;
      border-radius: 12px;
      padding: 24px;
      border: 1px solid #e2e8f0;
      margin-bottom: 28px;
    }
    .details-title {
      font-size: 16px;
      font-weight: 700;
      color: #0f172a;
      margin-top: 0;
      margin-bottom: 16px;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 8px;
    }
    .detail-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
      font-size: 14px;
    }
    .detail-label {
      color: #64748b;
      font-weight: 500;
    }
    .detail-value {
      color: #0f172a;
      font-weight: 600;
    }
    .description-box {
      background-color: #f1f5f9;
      border-radius: 8px;
      padding: 16px;
      font-size: 13px;
      color: #475569;
      line-height: 1.5;
      margin-top: 16px;
      white-space: pre-wrap;
    }
    .btn-container {
      text-align: center;
      margin-top: 30px;
      margin-bottom: 10px;
    }
    .btn-primary {
      background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
      border: none;
      border-radius: 8px;
      color: #ffffff !important;
      display: inline-block;
      font-size: 15px;
      font-weight: 600;
      text-decoration: none;
      padding: 12px 28px;
      box-shadow: 0 4px 10px rgba(59, 130, 246, 0.2);
      transition: all 0.2s ease;
    }
    .footer {
      clear: both;
      margin-top: 20px;
      text-align: center;
      width: 100%;
    }
    .footer td {
      color: #94a3b8;
      font-size: 12px;
      line-height: 1.5;
      padding: 10px 20px 20px 20px;
    }
    .footer a {
      color: #64748b;
      text-decoration: underline;
    }
    @media only screen and (max-width: 620px) {
      table.body .container {
        width: 100% !important;
        max-width: 100% !important;
        padding: 0 !important;
      }
      table.body .main {
        border-radius: 0 !important;
        border-left: none !important;
        border-right: none !important;
      }
      .body-content {
        padding: 24px !important;
      }
      .header-bar {
        padding: 24px !important;
      }
    }
  </style>
</head>
<body>
  <table role="presentation" class="body">
    <tr>
      <td>&nbsp;</td>
      <td class="container">
        <div class="content">
          <table role="presentation" class="main">
            <!-- HEADER -->
            <tr>
              <td class="header-bar">
                <h2>New Campus Placement Drive</h2>
                <p>Campus Recruitment Management System</p>
              </td>
            </tr>
            <!-- BODY -->
            <tr>
              <td class="body-content">
                <p class="salutation">Hello ${studentName},</p>
                <p class="intro-text">We are excited to announce that a new campus placement drive has been scheduled for your department. Based on your academic profile, you are eligible to register and participate.</p>
                
                <!-- DETAILS CARD -->
                <div class="details-card">
                  <div class="details-title">Drive Specifications</div>
                  
                  <div class="detail-row">
                    <span class="detail-label">Company Name:</span>
                    <span class="detail-value">${company.companyName}</span>
                  </div>
                  
                  <div class="detail-row">
                    <span class="detail-label">Salary Package:</span>
                    <span class="detail-value" style="color: #10b981;">${company.package} LPA</span>
                  </div>
                  
                  <div class="detail-row">
                    <span class="detail-label">Minimum CGPA:</span>
                    <span class="detail-value">&ge; ${company.eligibilityCgpa}</span>
                  </div>
                  
                  <div class="detail-row">
                    <span class="detail-label">Allowed Departments:</span>
                    <span class="detail-value">${company.allowedBranches?.join(', ') || 'All'}</span>
                  </div>

                  <div class="detail-row">
                    <span class="detail-label">Drive Start Date:</span>
                    <span class="detail-value">${driveStartDateStr}</span>
                  </div>

                  <div class="detail-row" style="margin-bottom: 0;">
                    <span class="detail-label">Registration Deadline:</span>
                    <span class="detail-value" style="color: #ef4444;">${driveDeadlineStr}</span>
                  </div>

                  ${company.description ? `
                    <div class="description-box">
                      <strong>Job Description & Instructions:</strong><br>
                      ${company.description}
                    </div>
                  ` : ''}
                </div>
                
                <!-- CALL TO ACTION -->
                <div class="btn-container">
                  <a href="${dashboardUrl}" target="_blank" class="btn-primary">View & Apply on Portal</a>
                </div>
              </td>
            </tr>
          </table>
          
          <!-- FOOTER -->
          <table role="presentation" class="footer">
            <tr>
              <td>
                This is an automated notification. Please do not reply directly to this email.<br>
                Placement Cell, Smart Placement Tracker © ${new Date().getFullYear()}<br>
                For support, contact the campus administrator or log in to the <a href="${frontendUrl}">placement portal</a>.
              </td>
            </tr>
          </table>
        </div>
      </td>
      <td>&nbsp;</td>
    </tr>
  </table>
</body>
</html>
  `;

  return {
    subject: `[New Campus Drive] ${company.companyName} is hiring! Package: ${company.package} LPA`,
    text: plainText,
    html: html
  };
};
