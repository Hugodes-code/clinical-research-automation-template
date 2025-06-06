# Complete Installation Guide - Clinical Research Automation System

## Table of Contents
1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Step-by-Step Installation](#step-by-step-installation)
4. [Configuration Guide](#configuration-guide)
5. [Testing Your Setup](#testing-your-setup)
6. [Common Issues & Solutions](#common-issues--solutions)
7. [Maintenance & Best Practices](#maintenance--best-practices)

---

## Overview

This guide will help you set up an automated clinical research management system using Google's free tools. The system will:

- ✅ Automatically send questionnaires to participants
- ✅ Track who has completed their questionnaires
- ✅ Send reminders to non-responders
- ✅ Generate progress reports
- ✅ Manage multiple intervention types/study arms

**Time Required**: 1-2 hours for initial setup
**Technical Skill Required**: None! Just follow the steps carefully.

---

## Prerequisites

Before starting, you need:

1. **A Google Account** (free)
   - If you don't have one, create it at [accounts.google.com](https://accounts.google.com)

2. **Google Forms** for your questionnaires
   - One form for participant enrollment
   - One form for each follow-up period (baseline, 3-month, 12-month)

3. **Basic Information About Your Study**
   - Study name
   - Types of interventions/procedures
   - Follow-up schedule
   - Email templates

---

## Step-by-Step Installation

### Step 1: Create Your Master Spreadsheet

1. **Open Google Sheets**
   - Go to [sheets.google.com](https://sheets.google.com)
   - Click the "+" button to create a new spreadsheet

2. **Name Your Spreadsheet**
   - Click "Untitled spreadsheet" at the top
   - Name it: "[Your Study Name] - Master Database"
   - Example: "Heart Surgery Study - Master Database"

3. **Set Up the Enrollment Form**
   - In Google Sheets, go to `Tools → Create a new form`
   - This creates a linked form for participant enrollment

4. **Configure the Enrollment Form**
   
   Your enrollment form MUST include these fields (exact names matter!):
   
   - **Email Address** (Google Forms adds this automatically)
   - **Intervention Type** (Dropdown with your study options)
     - Example options: "Surgery A", "Surgery B", "Control Group"
   - **Intervention Date** (Date field)
   - Any other demographic data you need

5. **Save the Spreadsheet ID**
   - Look at your browser's address bar
   - Find the long string between `/d/` and `/edit`
   - Example: In `https://docs.google.com/spreadsheets/d/1ABC123def456/edit`
   - The ID is: `1ABC123def456`
   - **Save this ID - you'll need it later!**

### Step 2: Create Follow-up Questionnaire Forms

For each follow-up period (baseline, 3-month, 12-month):

1. **Create a New Form**
   - Go to [forms.google.com](https://forms.google.com)
   - Click "+" to create a new form
   - Name it clearly: "[Study Name] - [Period] Questionnaire"
   - Example: "Heart Surgery Study - Baseline Questionnaire"

2. **Add Your Questions**
   - Email address (required - Forms adds this automatically)
   - Your clinical questions
   - Make sure to include the intervention type if needed

3. **Create Response Spreadsheet**
   - In the form, click "Responses" tab
   - Click the green sheets icon
   - Choose "Create a new spreadsheet"
   - Name it: "[Study Name] - [Period] Responses"

4. **Get the Response Spreadsheet ID**
   - Open the newly created response spreadsheet
   - Copy the ID from the URL (same method as Step 1.5)
   - **Save this ID!**

5. **Get the Form URL**
   - In the form, click "Send" button
   - Click the link icon 🔗
   - Copy the form URL
   - **Save this URL!**

Repeat for each follow-up period you need.

### Step 3: Install the Automation Script

1. **Open Script Editor**
   - Go back to your Master Spreadsheet
   - Click `Extensions → Apps Script`
   - This opens the script editor

2. **Clear Default Code**
   - Delete any existing code in the editor
   - The editor should be completely empty

3. **Copy the Template Code**
   - Copy the ENTIRE template code from the provided file
   - Paste it into the script editor

4. **Save the Script**
   - Click the 💾 save icon
   - Name your project: "[Your Study Name] Automation"
   - Click "OK"

### Step 4: Configure the Script

Now comes the most important part - customizing the script for your study:

#### 4.1 Basic Study Information

Find this section in the code:
```javascript
const STUDY_CONFIG = {
  studyName: "My Clinical Research Study",
  studyAbbreviation: "MCRS",
  organizationName: "Research Institute",
  primaryEmail: "study-coordinator@example.com",
  senderEmail: "noreply-study@example.com",
  senderName: "Clinical Research Team"
};
```

Replace with your information:
- `studyName`: Your full study name
- `studyAbbreviation`: Short version (3-5 letters)
- `organizationName`: Your hospital/institution
- `primaryEmail`: Your email address
- `senderEmail`: Email that sends automated messages
- `senderName`: Name shown in emails

#### 4.2 Spreadsheet Configuration

Find this section:
```javascript
const SPREADSHEET_CONFIG = {
  mainSpreadsheetId: "YOUR_MAIN_SPREADSHEET_ID_HERE",
  formResponsesSheetName: "Form Responses 1"
};
```

Replace:
- `mainSpreadsheetId`: The ID you saved from Step 1.5
- `formResponsesSheetName`: Usually "Form Responses 1" (check your sheet tabs)

#### 4.3 Intervention Configuration

This is where you define your study arms. Find this section:
```javascript
const STUDY_INTERVENTIONS = {
  "Intervention Type A": {
    baseline: {
      emailSubject: "Pre-intervention Questionnaire: Intervention Type A",
      emailBody: `...`,
      responseSpreadsheetId: "YOUR_BASELINE_SPREADSHEET_ID",
      responseSheetName: "Baseline"
    },
    ...
  }
};
```

For EACH intervention type:

1. Replace `"Intervention Type A"` with your actual intervention name
   - This MUST match exactly what's in your dropdown menu!

2. For each follow-up period (baseline, threeMonth, twelveMonth):
   - Update `emailSubject`: Subject line for the email
   - Update `emailBody`: 
     - Customize the message
     - Replace `YOUR_FORM_URL_HERE` with the actual form URL
   - Update `responseSpreadsheetId`: The ID from Step 2.4
   - Update `responseSheetName`: Usually the first tab name

3. Add more intervention types by copying the entire block and modifying

#### 4.4 Follow-up Schedule

Find this section:
```javascript
const FOLLOWUP_SCHEDULE = {
  threeMonthDays: 90,
  twelveMonthDays: 365,
  reminderDelayDays: 7,
  maxReminders: 2
};
```

Adjust for your study:
- `threeMonthDays`: Days until first follow-up (90 = 3 months)
- `twelveMonthDays`: Days until second follow-up (365 = 1 year)
- `reminderDelayDays`: Days before sending reminders
- `maxReminders`: How many reminders to send

#### 4.5 Column Names

Find this section:
```javascript
const COLUMN_NAMES = {
  email: "Email Address",
  interventionType: "Intervention Type",
  interventionDate: "Intervention Date",
  ...
};
```

These MUST match your form field names exactly! Check:
- Spelling
- Capitalization  
- Spaces

### Step 5: Initial Setup and Testing

1. **Run the Setup Function**
   - In the script editor, find the dropdown menu (usually says "myFunction")
   - Select `setupStudy`
   - Click the ▶️ Run button

2. **Grant Permissions**
   - Google will ask for permissions
   - Click "Review permissions"
   - Choose your Google account
   - Click "Advanced" → "Go to [Your Project]"
   - Click "Allow"

3. **Check the Logs**
   - Click "View" → "Logs"
   - You should see "✓ Study setup complete!"
   - If you see errors, check your configuration

4. **Run Configuration Test**
   - Select `testConfiguration` from the dropdown
   - Click ▶️ Run
   - Check logs for any issues

5. **Set Up Form Trigger**
   - In your Master Spreadsheet
   - Go to `Extensions → Apps Script`
   - Click the clock icon ⏰ (Triggers)
   - Click "+ Add Trigger"
   - Choose:
     - Function: `onFormSubmit`
     - Event source: "From spreadsheet"
     - Event type: "On form submit"
   - Click "Save"

---

## Configuration Guide

### Email Customization

To customize email messages:

1. Find the intervention configuration section
2. Locate the `emailBody` for each period
3. Edit the text between the backticks (`)
4. Keep the form URL format: `[Link text](URL)`

Example:
```javascript
emailBody: `Dear Participant,

We hope you're doing well after your procedure.

Please complete our follow-up questionnaire:
👉 [Click here to complete](https://forms.gle/your-form-id)

Your responses help improve patient care.

Best regards,
Dr. Smith's Research Team`
```

### Adding New Intervention Types

To add a new study arm:

1. Copy an existing intervention block
2. Paste it after the last intervention
3. Update the intervention name
4. Update all email templates and form IDs
5. Don't forget the comma between interventions!

### Modifying Follow-up Schedule

Common modifications:

- **Monthly follow-ups**: Set days to 30, 60, 90, etc.
- **Weekly follow-ups**: Set days to 7, 14, 21, etc.
- **Single follow-up**: Delete the twelveMonth sections

---

## Testing Your Setup

### Test 1: Form Submission

1. Open your enrollment form
2. Submit a test entry:
   - Email: your-email@gmail.com
   - Intervention: [Choose one]
   - Date: Today's date

3. Check your Master Spreadsheet:
   - New row should appear
   - Check for added columns (dates, status)

4. Check your email:
   - Should receive baseline questionnaire

### Test 2: Manual Email Test

1. In script editor, find `sendTestEmail` function
2. Edit the test email address to yours
3. Run the function
4. Check if email arrives

### Test 3: Response Tracking

1. Complete the baseline questionnaire
2. Run `checkQuestionnaireResponses`
3. Check if "Baseline Questionnaire Completed" = "Yes"

---

## Common Issues & Solutions

### Issue: "Cannot find sheet" error

**Solution**: 
- Check `formResponsesSheetName` matches exactly
- Common issue: It might be "Form responses 1" not "Form Responses 1"

### Issue: Emails not sending

**Solutions**:
1. Check email quota (100/day for free accounts)
2. Verify email addresses are correct
3. Check spam folder
4. Make sure form trigger is set up

### Issue: Responses not tracking

**Solutions**:
1. Verify response spreadsheet IDs are correct
2. Check that email addresses match exactly
3. Make sure response sheet names are correct

### Issue: "TypeError: Cannot read property" errors

**Solution**:
- Column names don't match exactly
- Check for extra spaces, capitalization

### Issue: Participants not receiving follow-ups

**Solutions**:
1. Check if baseline was completed
2. Verify dates are calculated correctly
3. Make sure daily trigger is running

---

## Maintenance & Best Practices

### Daily Tasks

- Check for any error emails from Google
- Monitor response rates
- Run `generateProgressReport()` weekly

### Weekly Tasks

- Review dashboard (run `createDashboard()`)
- Check for participants with missing data
- Send manual reminders if needed

### Monthly Tasks

- Export data for analysis
- Clean up test entries
- Review and update email templates

### Best Practices

1. **Backup Your Data**
   - Weekly exports using `exportStudyData()`
   - Download copies of all spreadsheets

2. **Test Before Major Changes**
   - Always test with fake data first
   - Keep a copy of working code

3. **Document Your Modifications**
   - Add comments when you change code
   - Keep a log of what you modified

4. **Monitor Email Limits**
   - Free accounts: 100 emails/day
   - Workspace accounts: 1,500 emails/day
   - Plan your reminder batches accordingly

5. **Privacy Protection**
   - Keep clinical data separate from identifiers
   - Use participant IDs when possible
   - Secure spreadsheet sharing settings

### Troubleshooting Checklist

If something isn't working, check these in order:

1. ✓ Spreadsheet IDs are correct
2. ✓ Column names match exactly
3. ✓ Intervention names match dropdown options
4. ✓ Form URLs are correct in email templates
5. ✓ Triggers are set up properly
6. ✓ Permissions are granted
7. ✓ No typos in configuration

---

## Quick Reference Card

### Essential Functions to Remember

| Function | What it does | When to run |
|----------|--------------|-------------|
| `setupStudy()` | Initial setup | Once, at start |
| `testConfiguration()` | Checks setup | After setup, before going live |
| `generateProgressReport()` | Shows study progress | Weekly |
| `createDashboard()` | Visual progress summary | Monthly |
| `sendTestEmail()` | Tests email sending | During setup |
| `exportStudyData()` | Backs up all data | Monthly |

### Key Files to Track

| Item | Where to find it | What it's for |
|------|------------------|---------------|
| Master Spreadsheet | Your Google Drive | Central database |
| Script Project | Extensions → Apps Script | Automation code |
| Response Sheets | One per questionnaire | Stores responses |
| Form URLs | In your email templates | Links to questionnaires |

### Email Schedule Summary

- **Enrollment**: Immediate baseline email
- **Follow-up 1**: X days after intervention (default: 90)
- **Follow-up 2**: Y days after intervention (default: 365)
- **Reminders**: Z days after initial email (default: 7)

---

## Next Steps

1. **Complete Setup**
   - Follow all steps above
   - Run test configuration
   - Submit test entries

2. **Train Your Team**
   - Show them how to access forms
   - Explain the email schedule
   - Demonstrate progress reports

3. **Launch Preparation**
   - Test with 5-10 participants first
   - Refine email templates based on feedback
   - Set up data analysis workflow

4. **Go Live**
   - Remove test data
   - Share enrollment form/QR code
   - Monitor daily for first week

---

## Support Resources

### Getting Help

1. **Check the Logs**
   - Script editor → View → Logs
   - Look for error messages

2. **Common Quick Fixes**
   - Refresh the spreadsheet
   - Re-run setup function
   - Check trigger status

3. **Google Resources**
   - [Apps Script Documentation](https://developers.google.com/apps-script)
   - [Google Sheets Help](https://support.google.com/sheets)
   - [Google Forms Help](https://support.google.com/forms)

### Making Modifications

If you need to:

- **Add a 6-month follow-up**: Copy the threeMonth configuration
- **Change email timing**: Modify FOLLOWUP_SCHEDULE
- **Add custom fields**: Add to COLUMN_NAMES
- **Track additional data**: Create new columns

Remember: Always test changes with fake data first!

---

## Congratulations!

You've set up an automated clinical research system that will:

- Save hundreds of hours of manual work
- Reduce human error
- Improve response rates
- Provide real-time progress tracking

**Final Tips:**
- Start small and expand
- Keep email templates friendly and short
- Celebrate your response rate improvements!
- Share this system with other researchers

Good luck with your research! 🎉
