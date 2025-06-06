/**
 * ================================================================================
 * UNIVERSAL CLINICAL RESEARCH AUTOMATION TEMPLATE
 * ================================================================================
 * Version: 1.0
 * Last Updated: 2025
 * 
 * This template automates participant management for clinical research studies using:
 * - Google Forms for data collection
 * - Google Sheets for data storage
 * - Automated email reminders at customizable intervals
 * - Real-time progress tracking
 * 
 * NO PROGRAMMING KNOWLEDGE REQUIRED - Just modify the configuration section below!
 * ================================================================================
 */

/**
 * ================================================================================
 * SECTION 1: CONFIGURATION - MODIFY ALL VALUES BELOW FOR YOUR STUDY
 * ================================================================================
 * Instructions: Replace all values in quotes ("") with your own information
 * DO NOT modify anything outside this configuration section unless you know JavaScript
 */

// STEP 1: Basic Study Information
const STUDY_CONFIG = {
  // TO MODIFY: Replace with your study name (will appear in emails and reports)
  studyName: "My Clinical Research Study",
  
  // TO MODIFY: Short abbreviation for your study (3-5 letters)
  studyAbbreviation: "MCRS",
  
  // TO MODIFY: Your institution/organization name
  organizationName: "Research Institute",
  
  // TO MODIFY: Primary contact email for the study
  primaryEmail: "study-coordinator@example.com",
  
  // TO MODIFY: Email address that will send automated emails
  senderEmail: "noreply-study@example.com",
  
  // TO MODIFY: Name that will appear as sender in emails
  senderName: "Clinical Research Team"
};

// STEP 2: Google Sheets Configuration
const SPREADSHEET_CONFIG = {
  // TO MODIFY: Your main enrollment spreadsheet ID
  // How to find it: Open your Google Sheet, look at the URL
  // Example URL: https://docs.google.com/spreadsheets/d/1ABC123def456/edit
  // The ID is the part between /d/ and /edit (in this example: 1ABC123def456)
  mainSpreadsheetId: "YOUR_MAIN_SPREADSHEET_ID_HERE",
  
  // TO MODIFY: Name of the sheet tab containing form responses (usually "Form Responses 1")
  formResponsesSheetName: "Form Responses 1"
};

// STEP 3: Study Arms/Interventions Configuration
// TO MODIFY: Define all intervention types or study arms in your research
// Add or remove interventions as needed for your study
const STUDY_INTERVENTIONS = {
  // Example intervention 1
  "Intervention Type A": {
    // Baseline/Initial questionnaire
    baseline: {
      emailSubject: "Pre-intervention Questionnaire: Intervention Type A",
      emailBody: `Dear Participant,

Thank you for enrolling in our study on Intervention Type A. 
Please complete the baseline questionnaire:

👉 [Access questionnaire](YOUR_FORM_URL_HERE)

Your participation is valuable to our research.

Best regards,
The Research Team`,
      // TO MODIFY: Replace with your baseline questionnaire spreadsheet ID
      responseSpreadsheetId: "YOUR_BASELINE_SPREADSHEET_ID",
      responseSheetName: "Baseline"
    },
    // 3-month follow-up
    threeMonth: {
      emailSubject: "3-Month Follow-up: Intervention Type A",
      emailBody: `Dear Participant,

It has been 3 months since your intervention. 
Please complete the follow-up questionnaire:

👉 [3-month questionnaire](YOUR_3MONTH_FORM_URL)

Your continued participation is important.

Best regards,
The Research Team`,
      responseSpreadsheetId: "YOUR_3MONTH_SPREADSHEET_ID",
      responseSheetName: "ThreeMonth"
    },
    // 12-month follow-up
    twelveMonth: {
      emailSubject: "12-Month Follow-up: Intervention Type A",
      emailBody: `Dear Participant,

One year has passed since your intervention. 
Please complete the final questionnaire:

👉 [12-month questionnaire](YOUR_12MONTH_FORM_URL)

Thank you for your participation.

Best regards,
The Research Team`,
      responseSpreadsheetId: "YOUR_12MONTH_SPREADSHEET_ID",
      responseSheetName: "TwelveMonth"
    }
  },
  
  // TO MODIFY: Copy and modify the structure above for each intervention type
  // Example: "Intervention Type B": { ... }
};

// STEP 4: Follow-up Timeline Configuration
// TO MODIFY: Adjust the timing of follow-ups for your study
const FOLLOWUP_SCHEDULE = {
  // Days after enrollment/intervention for each follow-up
  threeMonthDays: 90,    // TO MODIFY: Change to your desired interval (e.g., 30 for 1 month)
  twelveMonthDays: 365,  // TO MODIFY: Change to your desired interval (e.g., 180 for 6 months)
  
  // Days to wait before sending reminder emails
  reminderDelayDays: 7,  // TO MODIFY: How many days after initial email to send reminder
  
  // Maximum number of reminders to send
  maxReminders: 2        // TO MODIFY: How many reminder emails to send (0 = no reminders)
};

// STEP 5: Email Templates for Reminders
// TO MODIFY: Customize reminder email templates
const REMINDER_TEMPLATES = {
  subject: "REMINDER - ",  // This will be prepended to original subject
  bodyPrefix: `Dear Participant,

We noticed you haven't yet completed our questionnaire. Your response is important for our research.

Please take a few minutes to complete it:

`,
  bodySuffix: `

Thank you for your continued participation.

Best regards,
The Research Team`
};

/**
 * ================================================================================
 * SECTION 2: COLUMN MAPPING - CRITICAL FOR PROPER FUNCTION
 * ================================================================================
 * TO MODIFY: These MUST match exactly the column headers in your Google Sheet
 * Common issue: Check for extra spaces, capitalization must match exactly!
 */
const COLUMN_NAMES = {
  // Main participant information columns
  email: "Email Address",                    // TO MODIFY: Your email column header
  interventionType: "Intervention Type",     // TO MODIFY: Your intervention/study arm column
  interventionDate: "Intervention Date",     // TO MODIFY: Your intervention/procedure date column
  enrollmentTimestamp: "Timestamp",          // TO MODIFY: Form submission timestamp column
  
  // Email tracking columns (will be created automatically if they don't exist)
  baselineEmailSent: "Baseline Email Sent",
  baselineCompleted: "Baseline Questionnaire Completed",
  threeMonthEmailSent: "3-Month Email Sent",
  threeMonthCompleted: "3-Month Questionnaire Completed",
  twelveMonthEmailSent: "12-Month Email Sent",
  twelveMonthCompleted: "12-Month Questionnaire Completed",
  
  // Date tracking columns
  threeMonthDueDate: "3-Month Follow-up Due Date",
  twelveMonthDueDate: "12-Month Follow-up Due Date",
  
  // Reminder tracking columns
  baselineReminderSent: "Baseline Reminder Sent",
  threeMonthReminderSent: "3-Month Reminder Sent",
  twelveMonthReminderSent: "12-Month Reminder Sent"
};

/**
 * ================================================================================
 * SECTION 3: AUTOMATED FUNCTIONS - DO NOT MODIFY BELOW THIS LINE
 * ================================================================================
 * The code below handles all automation. Only modify if you have JavaScript knowledge.
 */

/**
 * Main function triggered when a new participant enrolls via Google Form
 * @param {Object} e - Form submission event
 */
function onFormSubmit(e) {
  try {
    Logger.log("New form submission received");
    
    const ss = SpreadsheetApp.openById(SPREADSHEET_CONFIG.mainSpreadsheetId);
    const sheet = ss.getSheetByName(SPREADSHEET_CONFIG.formResponsesSheetName);
    
    if (!sheet) {
      throw new Error(`Sheet "${SPREADSHEET_CONFIG.formResponsesSheetName}" not found. Please check configuration.`);
    }
    
    // Get submission data
    let submissionData;
    if (e && e.namedValues) {
      submissionData = e.namedValues;
    } else {
      // Manual trigger - get last row
      const lastRow = sheet.getLastRow();
      const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
      const values = sheet.getRange(lastRow, 1, 1, sheet.getLastColumn()).getValues()[0];
      
      submissionData = {};
      headers.forEach((header, index) => {
        submissionData[header] = [values[index]];
      });
    }
    
    // Extract participant information
    const email = submissionData[COLUMN_NAMES.email] ? submissionData[COLUMN_NAMES.email][0] : "";
    const interventionType = submissionData[COLUMN_NAMES.interventionType] ? submissionData[COLUMN_NAMES.interventionType][0] : "";
    const interventionDateStr = submissionData[COLUMN_NAMES.interventionDate] ? submissionData[COLUMN_NAMES.interventionDate][0] : "";
    
    // Validate required fields
    if (!email || !interventionType || !interventionDateStr) {
      Logger.log("ERROR: Missing required fields (email, intervention type, or date)");
      return;
    }
    
    // Check if intervention type is configured
    if (!STUDY_INTERVENTIONS[interventionType]) {
      Logger.log(`ERROR: Intervention type "${interventionType}" not configured in STUDY_INTERVENTIONS`);
      return;
    }
    
    const interventionDate = new Date(interventionDateStr);
    
    // Find the row in the spreadsheet
    const rowIndex = findParticipantRow(sheet, email, interventionType);
    if (rowIndex === -1) {
      Logger.log("ERROR: Could not find participant row in spreadsheet");
      return;
    }
    
    // Calculate follow-up dates
    const threeMonthDate = new Date(interventionDate);
    threeMonthDate.setDate(threeMonthDate.getDate() + FOLLOWUP_SCHEDULE.threeMonthDays);
    
    const twelveMonthDate = new Date(interventionDate);
    twelveMonthDate.setDate(twelveMonthDate.getDate() + FOLLOWUP_SCHEDULE.twelveMonthDays);
    
    // Update spreadsheet with calculated dates
    updateCellValue(sheet, rowIndex, COLUMN_NAMES.threeMonthDueDate, threeMonthDate);
    updateCellValue(sheet, rowIndex, COLUMN_NAMES.twelveMonthDueDate, twelveMonthDate);
    
    // Send baseline email
    const emailSent = sendQuestionnaireEmail(email, interventionType, "baseline");
    if (emailSent) {
      updateCellValue(sheet, rowIndex, COLUMN_NAMES.baselineEmailSent, "Yes");
      Logger.log(`Baseline email sent successfully to ${email}`);
    }
    
  } catch (error) {
    Logger.log(`ERROR in onFormSubmit: ${error.message}`);
    Logger.log(`Stack trace: ${error.stack}`);
  }
}

/**
 * Daily check for follow-up emails to send
 * Set up a time-based trigger to run this function daily
 */
function dailyFollowUpCheck() {
  try {
    Logger.log("Starting daily follow-up check");
    
    const ss = SpreadsheetApp.openById(SPREADSHEET_CONFIG.mainSpreadsheetId);
    const sheet = ss.getSheetByName(SPREADSHEET_CONFIG.formResponsesSheetName);
    
    if (!sheet) {
      throw new Error(`Sheet "${SPREADSHEET_CONFIG.formResponsesSheetName}" not found`);
    }
    
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let emailsSent = 0;
    
    // Check each participant
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const email = getValueByHeader(row, headers, COLUMN_NAMES.email);
      const interventionType = getValueByHeader(row, headers, COLUMN_NAMES.interventionType);
      
      if (!email || !interventionType || !STUDY_INTERVENTIONS[interventionType]) {
        continue;
      }
      
      // Check 3-month follow-up
      const threeMonthDue = getValueByHeader(row, headers, COLUMN_NAMES.threeMonthDueDate);
      const threeMonthSent = getValueByHeader(row, headers, COLUMN_NAMES.threeMonthEmailSent);
      const baselineCompleted = getValueByHeader(row, headers, COLUMN_NAMES.baselineCompleted);
      
      if (threeMonthDue && !threeMonthSent && baselineCompleted === "Yes") {
        const dueDate = new Date(threeMonthDue);
        if (dueDate <= today) {
          if (sendQuestionnaireEmail(email, interventionType, "threeMonth")) {
            updateCellValue(sheet, i + 1, COLUMN_NAMES.threeMonthEmailSent, "Yes");
            emailsSent++;
            Logger.log(`3-month follow-up sent to ${email}`);
          }
        }
      }
      
      // Check 12-month follow-up
      const twelveMonthDue = getValueByHeader(row, headers, COLUMN_NAMES.twelveMonthDueDate);
      const twelveMonthSent = getValueByHeader(row, headers, COLUMN_NAMES.twelveMonthEmailSent);
      const threeMonthCompleted = getValueByHeader(row, headers, COLUMN_NAMES.threeMonthCompleted);
      
      if (twelveMonthDue && !twelveMonthSent && threeMonthCompleted === "Yes") {
        const dueDate = new Date(twelveMonthDue);
        if (dueDate <= today) {
          if (sendQuestionnaireEmail(email, interventionType, "twelveMonth")) {
            updateCellValue(sheet, i + 1, COLUMN_NAMES.twelveMonthEmailSent, "Yes");
            emailsSent++;
            Logger.log(`12-month follow-up sent to ${email}`);
          }
        }
      }
      
      // Rate limiting to avoid quota issues
      if (emailsSent > 0 && emailsSent % 20 === 0) {
        Utilities.sleep(1000);
      }
    }
    
    Logger.log(`Daily check complete. ${emailsSent} follow-up emails sent.`);
    
  } catch (error) {
    Logger.log(`ERROR in dailyFollowUpCheck: ${error.message}`);
  }
}

/**
 * Check for questionnaire responses and update tracking
 * Set up a time-based trigger to run this function every few hours
 */
function checkQuestionnaireResponses() {
  try {
    Logger.log("Checking questionnaire responses");
    
    const ss = SpreadsheetApp.openById(SPREADSHEET_CONFIG.mainSpreadsheetId);
    const sheet = ss.getSheetByName(SPREADSHEET_CONFIG.formResponsesSheetName);
    
    if (!sheet) {
      throw new Error(`Sheet "${SPREADSHEET_CONFIG.formResponsesSheetName}" not found`);
    }
    
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    
    let responsesFound = 0;
    
    // Check each participant
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const email = getValueByHeader(row, headers, COLUMN_NAMES.email);
      const interventionType = getValueByHeader(row, headers, COLUMN_NAMES.interventionType);
      
      if (!email || !interventionType || !STUDY_INTERVENTIONS[interventionType]) {
        continue;
      }
      
      // Check baseline response
      const baselineSent = getValueByHeader(row, headers, COLUMN_NAMES.baselineEmailSent);
      const baselineCompleted = getValueByHeader(row, headers, COLUMN_NAMES.baselineCompleted);
      
      if (baselineSent === "Yes" && baselineCompleted !== "Yes") {
        if (hasCompletedQuestionnaire(email, interventionType, "baseline")) {
          updateCellValue(sheet, i + 1, COLUMN_NAMES.baselineCompleted, "Yes");
          responsesFound++;
          Logger.log(`Baseline response found for ${email}`);
        }
      }
      
      // Check 3-month response
      const threeMonthSent = getValueByHeader(row, headers, COLUMN_NAMES.threeMonthEmailSent);
      const threeMonthCompleted = getValueByHeader(row, headers, COLUMN_NAMES.threeMonthCompleted);
      
      if (threeMonthSent === "Yes" && threeMonthCompleted !== "Yes") {
        if (hasCompletedQuestionnaire(email, interventionType, "threeMonth")) {
          updateCellValue(sheet, i + 1, COLUMN_NAMES.threeMonthCompleted, "Yes");
          responsesFound++;
          Logger.log(`3-month response found for ${email}`);
        }
      }
      
      // Check 12-month response
      const twelveMonthSent = getValueByHeader(row, headers, COLUMN_NAMES.twelveMonthEmailSent);
      const twelveMonthCompleted = getValueByHeader(row, headers, COLUMN_NAMES.twelveMonthCompleted);
      
      if (twelveMonthSent === "Yes" && twelveMonthCompleted !== "Yes") {
        if (hasCompletedQuestionnaire(email, interventionType, "twelveMonth")) {
          updateCellValue(sheet, i + 1, COLUMN_NAMES.twelveMonthCompleted, "Yes");
          responsesFound++;
          Logger.log(`12-month response found for ${email}`);
        }
      }
    }
    
    Logger.log(`Response check complete. ${responsesFound} new responses found.`);
    
  } catch (error) {
    Logger.log(`ERROR in checkQuestionnaireResponses: ${error.message}`);
  }
}

/**
 * Send reminder emails to participants who haven't completed questionnaires
 * Set up a time-based trigger to run this weekly
 */
function sendReminders() {
  try {
    Logger.log("Starting reminder email process");
    
    const ss = SpreadsheetApp.openById(SPREADSHEET_CONFIG.mainSpreadsheetId);
    const sheet = ss.getSheetByName(SPREADSHEET_CONFIG.formResponsesSheetName);
    
    if (!sheet) {
      throw new Error(`Sheet "${SPREADSHEET_CONFIG.formResponsesSheetName}" not found`);
    }
    
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    
    const today = new Date();
    let remindersSent = 0;
    
    // Check each participant
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const email = getValueByHeader(row, headers, COLUMN_NAMES.email);
      const interventionType = getValueByHeader(row, headers, COLUMN_NAMES.interventionType);
      
      if (!email || !interventionType || !STUDY_INTERVENTIONS[interventionType]) {
        continue;
      }
      
      // Check if baseline reminder needed
      if (shouldSendReminder(row, headers, "baseline", today)) {
        if (sendReminderEmail(email, interventionType, "baseline")) {
          updateCellValue(sheet, i + 1, COLUMN_NAMES.baselineReminderSent, "Yes");
          remindersSent++;
        }
      }
      
      // Check if 3-month reminder needed
      if (shouldSendReminder(row, headers, "threeMonth", today)) {
        if (sendReminderEmail(email, interventionType, "threeMonth")) {
          updateCellValue(sheet, i + 1, COLUMN_NAMES.threeMonthReminderSent, "Yes");
          remindersSent++;
        }
      }
      
      // Check if 12-month reminder needed
      if (shouldSendReminder(row, headers, "twelveMonth", today)) {
        if (sendReminderEmail(email, interventionType, "twelveMonth")) {
          updateCellValue(sheet, i + 1, COLUMN_NAMES.twelveMonthReminderSent, "Yes");
          remindersSent++;
        }
      }
      
      // Rate limiting
      if (remindersSent > 0 && remindersSent % 10 === 0) {
        Utilities.sleep(2000);
      }
    }
    
    Logger.log(`Reminder process complete. ${remindersSent} reminders sent.`);
    
  } catch (error) {
    Logger.log(`ERROR in sendReminders: ${error.message}`);
  }
}

/**
 * ================================================================================
 * HELPER FUNCTIONS - These handle the technical details
 * ================================================================================
 */

/**
 * Send questionnaire email to participant
 */
function sendQuestionnaireEmail(email, interventionType, timepoint) {
  try {
    const config = STUDY_INTERVENTIONS[interventionType][timepoint];
    
    if (!config) {
      Logger.log(`No configuration found for ${interventionType} at ${timepoint}`);
      return false;
    }
    
    MailApp.sendEmail({
      to: email,
      subject: config.emailSubject,
      body: config.emailBody,
      name: STUDY_CONFIG.senderName,
      replyTo: STUDY_CONFIG.senderEmail
    });
    
    return true;
    
  } catch (error) {
    Logger.log(`ERROR sending email to ${email}: ${error.message}`);
    return false;
  }
}

/**
 * Send reminder email to participant
 */
function sendReminderEmail(email, interventionType, timepoint) {
  try {
    const config = STUDY_INTERVENTIONS[interventionType][timepoint];
    
    if (!config) {
      return false;
    }
    
    // Extract form URL from original email body
    const urlMatch = config.emailBody.match(/\[.*?\]\((https?:\/\/[^\)]+)\)/);
    const formUrl = urlMatch ? urlMatch[1] : "";
    
    const reminderBody = REMINDER_TEMPLATES.bodyPrefix + 
                        `👉 [Complete questionnaire](${formUrl})` + 
                        REMINDER_TEMPLATES.bodySuffix;
    
    MailApp.sendEmail({
      to: email,
      subject: REMINDER_TEMPLATES.subject + config.emailSubject,
      body: reminderBody,
      name: STUDY_CONFIG.senderName,
      replyTo: STUDY_CONFIG.senderEmail
    });
    
    return true;
    
  } catch (error) {
    Logger.log(`ERROR sending reminder to ${email}: ${error.message}`);
    return false;
  }
}

/**
 * Check if participant has completed questionnaire
 */
function hasCompletedQuestionnaire(email, interventionType, timepoint) {
  try {
    const config = STUDY_INTERVENTIONS[interventionType][timepoint];
    
    if (!config || !config.responseSpreadsheetId) {
      return false;
    }
    
    const ss = SpreadsheetApp.openById(config.responseSpreadsheetId);
    const sheet = ss.getSheetByName(config.responseSheetName);
    
    if (!sheet) {
      Logger.log(`Response sheet "${config.responseSheetName}" not found`);
      return false;
    }
    
    const data = sheet.getDataRange().getValues();
    
    // Look for email in responses (case-insensitive)
    for (let i = 1; i < data.length; i++) {
      for (let j = 0; j < data[i].length; j++) {
        if (data[i][j] && data[i][j].toString().toLowerCase() === email.toLowerCase()) {
          return true;
        }
      }
    }
    
    return false;
    
  } catch (error) {
    Logger.log(`ERROR checking questionnaire response: ${error.message}`);
    return false;
  }
}

/**
 * Find participant row in spreadsheet
 */
function findParticipantRow(sheet, email, interventionType) {
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  
  const emailIdx = headers.indexOf(COLUMN_NAMES.email);
  const typeIdx = headers.indexOf(COLUMN_NAMES.interventionType);
  
  if (emailIdx === -1 || typeIdx === -1) {
    return -1;
  }
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][emailIdx] === email && data[i][typeIdx] === interventionType) {
      return i + 1; // Return 1-based row index
    }
  }
  
  return -1;
}

/**
 * Update cell value in spreadsheet
 */
function updateCellValue(sheet, rowIndex, columnName, value) {
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const colIndex = headers.indexOf(columnName);
  
  if (colIndex === -1) {
    // Column doesn't exist - create it
    const newColIndex = headers.length + 1;
    sheet.getRange(1, newColIndex).setValue(columnName);
    sheet.getRange(rowIndex, newColIndex).setValue(value);
  } else {
    sheet.getRange(rowIndex, colIndex + 1).setValue(value);
  }
}

/**
 * Get value from row by column header
 */
function getValueByHeader(row, headers, columnName) {
  const index = headers.indexOf(columnName);
  return index !== -1 ? row[index] : null;
}

/**
 * Check if reminder should be sent
 */
function shouldSendReminder(row, headers, timepoint, today) {
  const emailSentColumn = timepoint === "baseline" ? COLUMN_NAMES.baselineEmailSent :
                         timepoint === "threeMonth" ? COLUMN_NAMES.threeMonthEmailSent :
                         COLUMN_NAMES.twelveMonthEmailSent;
                         
  const completedColumn = timepoint === "baseline" ? COLUMN_NAMES.baselineCompleted :
                         timepoint === "threeMonth" ? COLUMN_NAMES.threeMonthCompleted :
                         COLUMN_NAMES.twelveMonthCompleted;
                         
  const reminderColumn = timepoint === "baseline" ? COLUMN_NAMES.baselineReminderSent :
                        timepoint === "threeMonth" ? COLUMN_NAMES.threeMonthReminderSent :
                        COLUMN_NAMES.twelveMonthReminderSent;
  
  const emailSent = getValueByHeader(row, headers, emailSentColumn);
  const completed = getValueByHeader(row, headers, completedColumn);
  const reminderSent = getValueByHeader(row, headers, reminderColumn);
  
  if (emailSent !== "Yes" || completed === "Yes" || reminderSent === "Yes") {
    return false;
  }
  
  // Check if enough time has passed since initial email
  // This is a simplified check - you may want to track email sent dates
  return FOLLOWUP_SCHEDULE.maxReminders > 0;
}

/**
 * ================================================================================
 * SETUP AND UTILITY FUNCTIONS
 * ================================================================================
 */

/**
 * Initial setup function - RUN THIS FIRST!
 * Creates necessary columns and sets up triggers
 */
function setupStudy() {
  try {
    Logger.log("Starting study setup...");
    
    // Verify spreadsheet access
    const ss = SpreadsheetApp.openById(SPREADSHEET_CONFIG.mainSpreadsheetId);
    const sheet = ss.getSheetByName(SPREADSHEET_CONFIG.formResponsesSheetName);
    
    if (!sheet) {
      throw new Error(`Cannot find sheet "${SPREADSHEET_CONFIG.formResponsesSheetName}". Please check configuration.`);
    }
    
    Logger.log("✓ Spreadsheet access verified");
    
    // Add tracking columns if they don't exist
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    const columnsToAdd = [
      COLUMN_NAMES.baselineEmailSent,
      COLUMN_NAMES.baselineCompleted,
      COLUMN_NAMES.threeMonthEmailSent,
      COLUMN_NAMES.threeMonthCompleted,
      COLUMN_NAMES.twelveMonthEmailSent,
      COLUMN_NAMES.twelveMonthCompleted,
      COLUMN_NAMES.threeMonthDueDate,
      COLUMN_NAMES.twelveMonthDueDate,
      COLUMN_NAMES.baselineReminderSent,
      COLUMN_NAMES.threeMonthReminderSent,
      COLUMN_NAMES.twelveMonthReminderSent
    ];
    
    let newColIndex = headers.length + 1;
    columnsToAdd.forEach(colName => {
      if (!headers.includes(colName)) {
        sheet.getRange(1, newColIndex).setValue(colName);
        newColIndex++;
        Logger.log(`✓ Added column: ${colName}`);
      }
    });
    
    // Set up triggers
    setupTriggers();
    
    Logger.log("✓ Study setup complete!");
    Logger.log("Next steps:");
    Logger.log("1. Test the system by submitting a test form");
    Logger.log("2. Verify emails are being sent");
    Logger.log("3. Check that triggers are running properly");
    
  } catch (error) {
    Logger.log(`ERROR in setup: ${error.message}`);
    Logger.log("Please check your configuration and try again");
  }
}

/**
 * Set up time-based triggers for automation
 */
function setupTriggers() {
  // Remove existing triggers to avoid duplicates
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(trigger => {
    if (trigger.getHandlerFunction() === 'dailyFollowUpCheck' ||
        trigger.getHandlerFunction() === 'checkQuestionnaireResponses' ||
        trigger.getHandlerFunction() === 'sendReminders') {
      ScriptApp.deleteTrigger(trigger);
    }
  });
  
  // Daily check for follow-ups at 9 AM
  ScriptApp.newTrigger('dailyFollowUpCheck')
    .timeBased()
    .everyDays(1)
    .atHour(9)
    .create();
  
  // Check for questionnaire responses every 4 hours
  ScriptApp.newTrigger('checkQuestionnaireResponses')
    .timeBased()
    .everyHours(4)
    .create();
  
  // Send reminders weekly (every Monday at 10 AM)
  ScriptApp.newTrigger('sendReminders')
    .timeBased()
    .everyWeeks(1)
    .onWeekDay(ScriptApp.WeekDay.MONDAY)
    .atHour(10)
    .create();
  
  Logger.log("✓ Triggers set up successfully");
}

/**
 * ================================================================================
 * TESTING AND DIAGNOSTIC FUNCTIONS
 * ================================================================================
 */

/**
 * Test configuration and connections
 * RUN THIS AFTER SETUP TO VERIFY EVERYTHING WORKS
 */
function testConfiguration() {
  Logger.log("=== CONFIGURATION TEST ===");
  
  // Test 1: Spreadsheet access
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_CONFIG.mainSpreadsheetId);
    const sheet = ss.getSheetByName(SPREADSHEET_CONFIG.formResponsesSheetName);
    
    if (sheet) {
      Logger.log("✓ Main spreadsheet access: OK");
      Logger.log(`  Found ${sheet.getLastRow() - 1} participants`);
    } else {
      Logger.log("✗ Main spreadsheet access: FAILED - Check sheet name");
    }
  } catch (error) {
    Logger.log("✗ Main spreadsheet access: FAILED");
    Logger.log(`  Error: ${error.message}`);
    Logger.log("  Check that the spreadsheet ID is correct");
  }
  
  // Test 2: Intervention configuration
  Logger.log("\n✓ Configured interventions:");
  Object.keys(STUDY_INTERVENTIONS).forEach(intervention => {
    Logger.log(`  - ${intervention}`);
    
    // Check if all timepoints have valid configurations
    ['baseline', 'threeMonth', 'twelveMonth'].forEach(timepoint => {
      if (!STUDY_INTERVENTIONS[intervention][timepoint]) {
        Logger.log(`    ✗ Missing ${timepoint} configuration`);
      } else {
        const config = STUDY_INTERVENTIONS[intervention][timepoint];
        if (!config.responseSpreadsheetId || config.responseSpreadsheetId.includes("YOUR_")) {
          Logger.log(`    ✗ ${timepoint}: Spreadsheet ID not configured`);
        } else {
          Logger.log(`    ✓ ${timepoint}: Configured`);
        }
      }
    });
  });
  
  // Test 3: Email configuration
  Logger.log("\n✓ Email configuration:");
  Logger.log(`  Study name: ${STUDY_CONFIG.studyName}`);
  Logger.log(`  Sender email: ${STUDY_CONFIG.senderEmail}`);
  Logger.log(`  Primary contact: ${STUDY_CONFIG.primaryEmail}`);
  
  if (STUDY_CONFIG.senderEmail.includes("@example.com")) {
    Logger.log("  ✗ WARNING: Using example email address - update before going live!");
  }
  
  // Test 4: Column mapping
  Logger.log("\n✓ Checking required columns:");
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_CONFIG.mainSpreadsheetId);
    const sheet = ss.getSheetByName(SPREADSHEET_CONFIG.formResponsesSheetName);
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    
    const requiredColumns = [
      COLUMN_NAMES.email,
      COLUMN_NAMES.interventionType,
      COLUMN_NAMES.interventionDate,
      COLUMN_NAMES.enrollmentTimestamp
    ];
    
    requiredColumns.forEach(colName => {
      if (headers.includes(colName)) {
        Logger.log(`  ✓ "${colName}" found`);
      } else {
        Logger.log(`  ✗ "${colName}" NOT FOUND - Check column name spelling`);
      }
    });
  } catch (error) {
    Logger.log("  ✗ Could not check columns - spreadsheet access failed");
  }
  
  Logger.log("\n=== END OF CONFIGURATION TEST ===");
}

/**
 * Generate a study progress report
 */
function generateProgressReport() {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_CONFIG.mainSpreadsheetId);
    const sheet = ss.getSheetByName(SPREADSHEET_CONFIG.formResponsesSheetName);
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    
    // Calculate statistics
    const stats = {
      totalParticipants: data.length - 1,
      byIntervention: {},
      completion: {
        baseline: 0,
        threeMonth: 0,
        twelveMonth: 0
      }
    };
    
    // Analyze each participant
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const interventionType = getValueByHeader(row, headers, COLUMN_NAMES.interventionType);
      
      if (interventionType) {
        if (!stats.byIntervention[interventionType]) {
          stats.byIntervention[interventionType] = {
            total: 0,
            baselineComplete: 0,
            threeMonthComplete: 0,
            twelveMonthComplete: 0
          };
        }
        
        stats.byIntervention[interventionType].total++;
        
        if (getValueByHeader(row, headers, COLUMN_NAMES.baselineCompleted) === "Yes") {
          stats.byIntervention[interventionType].baselineComplete++;
          stats.completion.baseline++;
        }
        
        if (getValueByHeader(row, headers, COLUMN_NAMES.threeMonthCompleted) === "Yes") {
          stats.byIntervention[interventionType].threeMonthComplete++;
          stats.completion.threeMonth++;
        }
        
        if (getValueByHeader(row, headers, COLUMN_NAMES.twelveMonthCompleted) === "Yes") {
          stats.byIntervention[interventionType].twelveMonthComplete++;
          stats.completion.twelveMonth++;
        }
      }
    }
    
    // Generate report
    Logger.log(`
================================================================================
STUDY PROGRESS REPORT - ${STUDY_CONFIG.studyName}
Generated: ${new Date().toLocaleString()}
================================================================================

OVERALL STATISTICS:
- Total Participants: ${stats.totalParticipants}
- Baseline Completion: ${stats.completion.baseline} (${Math.round(stats.completion.baseline / stats.totalParticipants * 100)}%)
- 3-Month Completion: ${stats.completion.threeMonth} (${Math.round(stats.completion.threeMonth / stats.totalParticipants * 100)}%)
- 12-Month Completion: ${stats.completion.twelveMonth} (${Math.round(stats.completion.twelveMonth / stats.totalParticipants * 100)}%)

BY INTERVENTION TYPE:`);
    
    Object.keys(stats.byIntervention).forEach(intervention => {
      const data = stats.byIntervention[intervention];
      Logger.log(`
${intervention}:
  - Total: ${data.total}
  - Baseline: ${data.baselineComplete} (${Math.round(data.baselineComplete / data.total * 100)}%)
  - 3-Month: ${data.threeMonthComplete} (${Math.round(data.threeMonthComplete / data.total * 100)}%)
  - 12-Month: ${data.twelveMonthComplete} (${Math.round(data.twelveMonthComplete / data.total * 100)}%)`);
    });
    
    Logger.log(`
================================================================================`);
    
  } catch (error) {
    Logger.log(`ERROR generating report: ${error.message}`);
  }
}

/**
 * Manual function to send test email
 * TO USE: Change the email address and run this function
 */
function sendTestEmail() {
  // TO MODIFY: Replace with your email address for testing
  const testEmail = "your-email@example.com";
  const testIntervention = Object.keys(STUDY_INTERVENTIONS)[0]; // Uses first intervention type
  
  Logger.log(`Sending test email to ${testEmail} for ${testIntervention}`);
  
  const success = sendQuestionnaireEmail(testEmail, testIntervention, "baseline");
  
  if (success) {
    Logger.log("✓ Test email sent successfully! Check your inbox.");
  } else {
    Logger.log("✗ Test email failed. Check your configuration.");
  }
}

/**
 * ================================================================================
 * ADVANCED FUNCTIONS - Optional features
 * ================================================================================
 */

/**
 * Export study data to a new spreadsheet for analysis
 */
function exportStudyData() {
  try {
    const sourceSheet = SpreadsheetApp.openById(SPREADSHEET_CONFIG.mainSpreadsheetId)
      .getSheetByName(SPREADSHEET_CONFIG.formResponsesSheetName);
    
    // Create new spreadsheet for export
    const exportName = `${STUDY_CONFIG.studyName} - Data Export ${new Date().toLocaleDateString()}`;
    const newSpreadsheet = SpreadsheetApp.create(exportName);
    const exportSheet = newSpreadsheet.getActiveSheet();
    
    // Copy all data
    const data = sourceSheet.getDataRange().getValues();
    exportSheet.getRange(1, 1, data.length, data[0].length).setValues(data);
    
    // Format headers
    exportSheet.getRange(1, 1, 1, data[0].length)
      .setFontWeight('bold')
      .setBackground('#f0f0f0');
    
    // Auto-resize columns
    for (let i = 1; i <= data[0].length; i++) {
      exportSheet.autoResizeColumn(i);
    }
    
    Logger.log(`✓ Data exported to: ${newSpreadsheet.getUrl()}`);
    
  } catch (error) {
    Logger.log(`ERROR exporting data: ${error.message}`);
  }
}

/**
 * Clean up test data (use with caution!)
 * This will remove all rows where email contains "test"
 */
function removeTestData() {
  const confirmDelete = false; // TO MODIFY: Change to true to actually delete
  
  if (!confirmDelete) {
    Logger.log("Test data removal not confirmed. Change confirmDelete to true to proceed.");
    return;
  }
  
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_CONFIG.mainSpreadsheetId);
    const sheet = ss.getSheetByName(SPREADSHEET_CONFIG.formResponsesSheetName);
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    
    const emailIdx = headers.indexOf(COLUMN_NAMES.email);
    let rowsDeleted = 0;
    
    // Work backwards to avoid index issues when deleting
    for (let i = data.length - 1; i >= 1; i--) {
      const email = data[i][emailIdx];
      if (email && email.toLowerCase().includes("test")) {
        sheet.deleteRow(i + 1);
        rowsDeleted++;
        Logger.log(`Deleted test row: ${email}`);
      }
    }
    
    Logger.log(`✓ Removed ${rowsDeleted} test entries`);
    
  } catch (error) {
    Logger.log(`ERROR removing test data: ${error.message}`);
  }
}

/**
 * ================================================================================
 * DASHBOARD FUNCTIONS - Simple study monitoring
 * ================================================================================
 */

/**
 * Create a simple dashboard in a new sheet
 */
function createDashboard() {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_CONFIG.mainSpreadsheetId);
    
    // Create or clear dashboard sheet
    let dashboard = ss.getSheetByName("Dashboard");
    if (!dashboard) {
      dashboard = ss.insertSheet("Dashboard");
    } else {
      dashboard.clear();
    }
    
    // Get study data
    const dataSheet = ss.getSheetByName(SPREADSHEET_CONFIG.formResponsesSheetName);
    const data = dataSheet.getDataRange().getValues();
    const headers = data[0];
    
    // Calculate metrics
    const metrics = calculateDashboardMetrics(data, headers);
    
    // Create dashboard layout
    dashboard.getRange("A1").setValue(STUDY_CONFIG.studyName + " - Dashboard");
    dashboard.getRange("A1").setFontSize(16).setFontWeight("bold");
    
    dashboard.getRange("A3").setValue("Last Updated:");
    dashboard.getRange("B3").setValue(new Date()).setNumberFormat("yyyy-mm-dd hh:mm");
    
    // Overall metrics
    dashboard.getRange("A5").setValue("OVERALL METRICS");
    dashboard.getRange("A5:D5").merge().setBackground("#4472c4").setFontColor("white").setFontWeight("bold");
    
    const overallData = [
      ["Total Participants", metrics.totalParticipants],
      ["Baseline Completion Rate", metrics.baselineRate + "%"],
      ["3-Month Completion Rate", metrics.threeMonthRate + "%"],
      ["12-Month Completion Rate", metrics.twelveMonthRate + "%"]
    ];
    
    dashboard.getRange(6, 1, overallData.length, 2).setValues(overallData);
    
    // By intervention type
    dashboard.getRange("A12").setValue("BY INTERVENTION TYPE");
    dashboard.getRange("A12:F12").merge().setBackground("#4472c4").setFontColor("white").setFontWeight("bold");
    
    const interventionHeaders = ["Intervention", "Total", "Baseline", "3-Month", "12-Month", "Completion %"];
    dashboard.getRange(13, 1, 1, interventionHeaders.length).setValues([interventionHeaders]);
    dashboard.getRange(13, 1, 1, interventionHeaders.length).setBackground("#d9e2f3").setFontWeight("bold");
    
    let row = 14;
    Object.keys(metrics.byIntervention).forEach(intervention => {
      const data = metrics.byIntervention[intervention];
      const completionRate = Math.round((data.baselineComplete + data.threeMonthComplete + data.twelveMonthComplete) / 
                                      (data.total * 3) * 100);
      
      dashboard.getRange(row, 1, 1, 6).setValues([[
        intervention,
        data.total,
        data.baselineComplete,
        data.threeMonthComplete,
        data.twelveMonthComplete,
        completionRate + "%"
      ]]);
      row++;
    });
    
    // Format
    dashboard.autoResizeColumns(1, 6);
    
    Logger.log("✓ Dashboard created successfully");
    
  } catch (error) {
    Logger.log(`ERROR creating dashboard: ${error.message}`);
  }
}

/**
 * Calculate metrics for dashboard
 */
function calculateDashboardMetrics(data, headers) {
  const metrics = {
    totalParticipants: data.length - 1,
    baselineComplete: 0,
    threeMonthComplete: 0,
    twelveMonthComplete: 0,
    byIntervention: {}
  };
  
  // Count completions
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const interventionType = getValueByHeader(row, headers, COLUMN_NAMES.interventionType);
    
    if (!interventionType) continue;
    
    if (!metrics.byIntervention[interventionType]) {
      metrics.byIntervention[interventionType] = {
        total: 0,
        baselineComplete: 0,
        threeMonthComplete: 0,
        twelveMonthComplete: 0
      };
    }
    
    metrics.byIntervention[interventionType].total++;
    
    if (getValueByHeader(row, headers, COLUMN_NAMES.baselineCompleted) === "Yes") {
      metrics.baselineComplete++;
      metrics.byIntervention[interventionType].baselineComplete++;
    }
    
    if (getValueByHeader(row, headers, COLUMN_NAMES.threeMonthCompleted) === "Yes") {
      metrics.threeMonthComplete++;
      metrics.byIntervention[interventionType].threeMonthComplete++;
    }
    
    if (getValueByHeader(row, headers, COLUMN_NAMES.twelveMonthCompleted) === "Yes") {
      metrics.twelveMonthComplete++;
      metrics.byIntervention[interventionType].twelveMonthComplete++;
    }
  }
  
  // Calculate rates
  metrics.baselineRate = Math.round(metrics.baselineComplete / metrics.totalParticipants * 100) || 0;
  metrics.threeMonthRate = Math.round(metrics.threeMonthComplete / metrics.totalParticipants * 100) || 0;
  metrics.twelveMonthRate = Math.round(metrics.twelveMonthComplete / metrics.totalParticipants * 100) || 0;
  
  return metrics;
}

/**
 * ================================================================================
 * END OF TEMPLATE
 * ================================================================================
 * 
 * Remember to:
 * 1. Update all configuration values
 * 2. Run setupStudy() first
 * 3. Run testConfiguration() to verify setup
 * 4. Test with a few participants before full launch
 * 
 * For support, check the documentation or contact your IT department.
 * ================================================================================
 */
