# FAQ & Troubleshooting Guide - Clinical Research Automation

## Table of Contents
1. [Most Common Questions](#most-common-questions)
2. [Setup Problems](#setup-problems)
3. [Email Issues](#email-issues)
4. [Data Tracking Problems](#data-tracking-problems)
5. [Customization Questions](#customization-questions)
6. [Advanced Troubleshooting](#advanced-troubleshooting)
7. [Quick Fixes](#quick-fixes)

---

## Most Common Questions

### Q: Do I need to pay for anything?
**A:** No! This system uses completely free Google tools. The only limitation is:
- Free Gmail accounts: 100 emails/day
- Google Workspace accounts: 1,500 emails/day

### Q: Can I use this for multiple studies?
**A:** Yes! You can:
- Copy the entire system for each study
- Or modify the code to handle multiple studies (advanced)

### Q: How long does setup take?
**A:** 
- First-time setup: 1-2 hours
- Additional studies: 30-45 minutes (you'll be faster!)

### Q: Do participants need Google accounts?
**A:** No! Participants only need:
- An email address (any provider)
- Internet access to complete forms

### Q: Is the data secure?
**A:** Your data is as secure as your Google account:
- Use strong passwords
- Enable 2-factor authentication
- Control spreadsheet sharing carefully
- Consider using participant IDs instead of names

### Q: Can I modify the follow-up schedule?
**A:** Absolutely! You can:
- Change from 3/12 months to any interval
- Add more follow-up points
- Use days, weeks, or months

### Q: What happens if I make a mistake?
**A:** Don't worry! You can:
- Fix configuration and re-run setup
- Manually edit the spreadsheet
- Delete test data easily
- The system is very forgiving

---

## Setup Problems

### "Cannot find spreadsheet" Error

**Problem:** Script can't access your spreadsheet

**Solutions:**
1. **Check the Spreadsheet ID**
   ```
   Correct format: "1ABC123def456"
   Wrong formats: 
   - "https://docs.google.com/spreadsheets/d/1ABC123def456/edit"
   - "1ABC123def456/edit"
   - "spreadsheets/d/1ABC123def456"
   ```

2. **Verify Permissions**
   - Make sure you're logged into the correct Google account
   - Re-run the setup and grant permissions again

3. **Check for Typos**
   - No extra spaces before/after the ID
   - No quotation marks missing

### "Sheet not found" Error

**Problem:** Can't find "Form Responses 1"

**Solutions:**
1. **Check the Tab Name**
   - Look at the bottom of your spreadsheet
   - Common variations:
     - "Form Responses 1" (space after "Form")
     - "Form responses 1" (lowercase 'r')
     - "Form Responses" (no number)

2. **Update Configuration**
   ```javascript
   formResponsesSheetName: "Form Responses 1"  // Change to match exactly
   ```

### Permissions Errors

**Problem:** "Authorization required" or similar

**Solutions:**
1. **Re-authorize the Script**
   - Run `setupStudy()` again
   - Click through all permission screens
   - Choose "Advanced" → "Go to project" if needed

2. **Check Account**
   - Make sure you're using the account that owns the spreadsheet
   - Log out of other Google accounts

3. **Clear and Retry**
   - Go to [myaccount.google.com/permissions](https://myaccount.google.com/permissions)
   - Remove the script project
   - Re-run setup

---

## Email Issues

### Emails Not Sending

**Problem:** Participants aren't receiving emails

**Solutions:**

1. **Check Email Quota**
   - Free accounts: max 100/day
   - Check Script editor → View → Executions
   - Look for quota errors

2. **Verify Email Addresses**
   - Check for typos in email column
   - Remove extra spaces
   - Ensure valid format (name@domain.com)

3. **Check Spam Folders**
   - Ask participants to check spam
   - Add sender email to contacts

4. **Test Email Function**
   ```javascript
   // In script editor, modify and run:
   function testEmail() {
     MailApp.sendEmail("your-email@gmail.com", "Test", "This is a test");
   }
   ```

### Wrong Email Content

**Problem:** Emails have wrong information or broken links

**Solutions:**

1. **Check Form URLs**
   - URLs must be complete: `https://forms.gle/...`
   - Test each link manually

2. **Fix Email Template**
   ```javascript
   emailBody: `Dear Participant,
   
   // Make sure backticks (`) are used, not quotes (")
   // Keep link format: [Text](URL)
   
   👉 [Complete questionnaire](https://forms.gle/your-actual-form-id)
   
   Thank you!`
   ```

3. **Verify Intervention Names**
   - Email templates must match intervention types exactly

### Emails Sending Multiple Times

**Problem:** Participants getting duplicate emails

**Solutions:**

1. **Check Triggers**
   - Script editor → Triggers (clock icon)
   - Delete duplicate triggers
   - Should only have one of each type

2. **Check Status Columns**
   - Make sure "Email Sent" columns are updating
   - Manually mark as "Yes" if needed

---

## Data Tracking Problems

### Responses Not Recording

**Problem:** Questionnaires completed but not showing as "Yes"

**Solutions:**

1. **Verify Spreadsheet IDs**
   ```javascript
   // Check each one:
   responseSpreadsheetId: "1ABC123def456"  // Must be correct
   ```

2. **Check Email Matching**
   - Emails must match EXACTLY
   - "John@gmail.com" ≠ "john@gmail.com"
   - Remove extra spaces

3. **Check Response Sheet Names**
   ```javascript
   responseSheetName: "Form Responses 1"  // Default
   // Check the actual tab name in your response spreadsheet
   ```

4. **Run Manual Check**
   - Run `checkQuestionnaireResponses()` manually
   - Check logs for errors

### Follow-up Emails Not Sending

**Problem:** 3-month or 12-month emails not going out

**Solutions:**

1. **Check Prerequisites**
   - Baseline must be completed first
   - Check "Baseline Questionnaire Completed" = "Yes"

2. **Verify Dates**
   - Check "3-Month Follow-up Due Date" is correct
   - Make sure date has passed

3. **Check Daily Trigger**
   - Must have daily trigger for `dailyFollowUpCheck()`
   - Script editor → Triggers
   - Add if missing

4. **Run Manually**
   - Run `dailyFollowUpCheck()` manually
   - Check logs for issues

### Wrong Dates Calculated

**Problem:** Follow-up dates are incorrect

**Solutions:**

1. **Check Date Format**
   - Ensure "Intervention Date" is a valid date
   - Google Sheets: Format → Number → Date

2. **Verify Calculation**
   ```javascript
   // Check these values:
   threeMonthDays: 90,   // Change if needed
   twelveMonthDays: 365, // Change if needed
   ```

3. **Fix Existing Dates**
   - Manually edit in spreadsheet
   - Or delete and re-run setup

---

## Customization Questions

### How to Add a 6-Month Follow-up?

**Step 1:** Add to configuration
```javascript
const FOLLOWUP_SCHEDULE = {
  threeMonthDays: 90,
  sixMonthDays: 180,    // Add this
  twelveMonthDays: 365,
  // ...
};
```

**Step 2:** Add to column names
```javascript
const COLUMN_NAMES = {
  // ... existing columns ...
  sixMonthEmailSent: "6-Month Email Sent",
  sixMonthCompleted: "6-Month Questionnaire Completed",
  sixMonthDueDate: "6-Month Follow-up Due Date",
  sixMonthReminderSent: "6-Month Reminder Sent"
};
```

**Step 3:** Add to each intervention
```javascript
sixMonth: {
  emailSubject: "6-Month Follow-up",
  emailBody: `Your 6-month questionnaire...`,
  responseSpreadsheetId: "YOUR_6MONTH_ID",
  responseSheetName: "Form Responses 1"
}
```

**Step 4:** Add logic to daily check (advanced)

### How to Change Email Timing?

**For different intervals:**
```javascript
const FOLLOWUP_SCHEDULE = {
  threeMonthDays: 30,   // 1 month instead of 3
  twelveMonthDays: 180, // 6 months instead of 12
  // ...
};
```

**For weekly follow-ups:**
```javascript
const FOLLOWUP_SCHEDULE = {
  threeMonthDays: 7,    // 1 week
  twelveMonthDays: 14,  // 2 weeks
  // ...
};
```

### How to Add More Intervention Types?

**Copy and modify:**
```javascript
const STUDY_INTERVENTIONS = {
  "Surgery Type A": {
    // ... existing configuration ...
  },
  
  "Surgery Type B": {  // Add comma above!
    baseline: {
      emailSubject: "Baseline - Surgery Type B",
      emailBody: `...your content...`,
      responseSpreadsheetId: "YOUR_ID",
      responseSheetName: "Form Responses 1"
    },
    threeMonth: {
      // ... similar structure ...
    },
    twelveMonth: {
      // ... similar structure ...
    }
  }  // No comma on last one!
};
```

### How to Track Additional Data?

**Add to column names:**
```javascript
const COLUMN_NAMES = {
  // ... existing columns ...
  phoneNumber: "Phone Number",           // Add your column
  studySite: "Study Site",              // Must match form exactly
  consentDate: "Consent Date"
};
```

**No other changes needed!** The system will create columns automatically.

---

## Advanced Troubleshooting

### Script Execution Errors

**Check Execution History:**
1. Script editor → View → Executions
2. Look for red ❌ marks
3. Click to see error details

**Common Execution Errors:**

1. **"Exceeded maximum execution time"**
   - Too many participants to process
   - Solution: Process in batches

2. **"Service invoked too many times"**
   - Hit Google's rate limits
   - Solution: Add delays between operations

3. **"Authorization required"**
   - Permissions expired
   - Solution: Re-run setup

### Debugging Specific Participants

**To debug one participant:**
```javascript
function debugParticipant() {
  const email = "problem-patient@email.com";
  const ss = SpreadsheetApp.openById(SPREADSHEET_CONFIG.mainSpreadsheetId);
  const sheet = ss.getSheetByName(SPREADSHEET_CONFIG.formResponsesSheetName);
  const data = sheet.getDataRange().getValues();
  
  // Find participant
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === email) {  // Assumes email is first column
      Logger.log("Found participant at row " + (i+1));
      Logger.log("Data: " + data[i].join(", "));
      break;
    }
  }
}
```

### Performance Issues

**If the system is running slowly:**

1. **Too Many Participants**
   - Archive completed participants
   - Split into multiple spreadsheets

2. **Too Many Columns**
   - Hide unused columns
   - Delete test columns

3. **Complex Formulas**
   - Remove spreadsheet formulas
   - Let the script do calculations

---

## Quick Fixes

### Reset Everything
```javascript
function resetForTesting() {
  // WARNING: This clears email sent markers!
  const ss = SpreadsheetApp.openById(SPREADSHEET_CONFIG.mainSpreadsheetId);
  const sheet = ss.getSheetByName(SPREADSHEET_CONFIG.formResponsesSheetName);
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  
  // Find status columns
  const statusColumns = [
    "Baseline Email Sent",
    "3-Month Email Sent", 
    "12-Month Email Sent"
  ];
  
  statusColumns.forEach(colName => {
    const colIndex = headers.indexOf(colName);
    if (colIndex !== -1) {
      for (let i = 2; i <= sheet.getLastRow(); i++) {
        sheet.getRange(i, colIndex + 1).setValue("");
      }
    }
  });
  
  Logger.log("Reset complete - emails will resend!");
}
```

### Force Send Email
```javascript
function forceSendEmail() {
  const email = "specific-patient@email.com";
  const interventionType = "Surgery Type A";
  const period = "baseline";  // or "threeMonth" or "twelveMonth"
  
  sendQuestionnaireEmail(email, interventionType, period);
  Logger.log("Email sent!");
}
```

### Check System Status
```javascript
function systemHealthCheck() {
  Logger.log("=== SYSTEM HEALTH CHECK ===");
  
  // Check spreadsheet access
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_CONFIG.mainSpreadsheetId);
    Logger.log("✓ Spreadsheet access: OK");
  } catch (e) {
    Logger.log("✗ Spreadsheet access: FAILED");
  }
  
  // Check triggers
  const triggers = ScriptApp.getProjectTriggers();
  Logger.log(`✓ Active triggers: ${triggers.length}`);
  triggers.forEach(t => {
    Logger.log(`  - ${t.getHandlerFunction()}: ${t.getTriggerSource()}`);
  });
  
  // Check email quota
  const quota = MailApp.getRemainingDailyQuota();
  Logger.log(`✓ Email quota remaining: ${quota}`);
  
  // Check configuration
  const interventions = Object.keys(STUDY_INTERVENTIONS).length;
  Logger.log(`✓ Configured interventions: ${interventions}`);
  
  Logger.log("=== END HEALTH CHECK ===");
}
```

---

## Still Having Issues?

### Before Asking for Help

1. **Run** `systemHealthCheck()` and save the output
2. **Check** the execution history for errors
3. **Try** the relevant quick fix function
4. **Test** with a single participant first
5. **Document** exactly what's not working

### Information to Gather

When seeking help, provide:
- Error messages (exact text)
- What you expected to happen
- What actually happened
- Your configuration (remove sensitive data)
- Log output from test functions

### Remember

- This system is very forgiving
- Most problems are simple typos
- You can always manually fix data
- The community is here to help!

---

*Last tip: When in doubt, check for typos. 90% of problems are spelling/capitalization mismatches!* 😊
