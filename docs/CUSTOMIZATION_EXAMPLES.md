# Customization Examples for Different Study Types

## Table of Contents
1. [Surgical Follow-up Study](#surgical-follow-up-study)
2. [Mental Health Study with Weekly Check-ins](#mental-health-study)
3. [Medication Trial with Multiple Arms](#medication-trial)
4. [Rehabilitation Program Monitoring](#rehabilitation-program)
5. [Longitudinal Cohort Study](#longitudinal-cohort-study)
6. [Quick Customization Templates](#quick-templates)

---

## 1. Surgical Follow-up Study

**Scenario:** Post-operative recovery tracking for three types of knee surgery

### Configuration Example:

```javascript
// Basic Study Information
const STUDY_CONFIG = {
  studyName: "Knee Surgery Recovery Study",
  studyAbbreviation: "KSRS",
  organizationName: "Orthopedic Surgery Center",
  primaryEmail: "dr.smith@orthocenter.org",
  senderEmail: "knee-study@orthocenter.org",
  senderName: "Knee Recovery Research Team"
};

// Intervention Types
const STUDY_INTERVENTIONS = {
  "Total Knee Replacement": {
    baseline: {
      emailSubject: "Pre-Surgery Assessment - Knee Replacement Study",
      emailBody: `Dear Patient,

Thank you for participating in our knee surgery recovery study.

Before your surgery, please complete this important assessment about your current knee function and pain levels:

👉 [Complete Pre-Surgery Assessment](https://forms.gle/your-form-id)

This takes about 10 minutes and helps us track your recovery progress.

Best wishes for your upcoming surgery,
Dr. Smith's Research Team`,
      responseSpreadsheetId: "YOUR_BASELINE_ID",
      responseSheetName: "Form Responses 1"
    },
    threeMonth: {
      emailSubject: "3-Month Recovery Check - Knee Study",
      emailBody: `Dear Patient,

It's been 3 months since your knee replacement surgery. We hope your recovery is going well!

Please take 10 minutes to complete your recovery assessment:

👉 [Complete 3-Month Assessment](https://forms.gle/your-3month-form)

Your responses help us improve recovery protocols for future patients.

Thank you for your continued participation,
Dr. Smith's Research Team`,
      responseSpreadsheetId: "YOUR_3MONTH_ID",
      responseSheetName: "Form Responses 1"
    },
    twelveMonth: {
      emailSubject: "1-Year Follow-up - Knee Study",
      emailBody: `Dear Patient,

Congratulations on reaching the 1-year mark since your knee surgery!

Please complete this final assessment:

👉 [Complete 1-Year Assessment](https://forms.gle/your-12month-form)

We're interested in your long-term outcomes and quality of life.

Thank you for your valuable contribution to our research,
Dr. Smith's Research Team`,
      responseSpreadsheetId: "YOUR_12MONTH_ID",
      responseSheetName: "Form Responses 1"
    }
  },
  
  "Partial Knee Replacement": {
    // Similar structure with modified emails
  },
  
  "Arthroscopic Surgery": {
    // Similar structure with modified emails
  }
};

// Modified timeline for surgical recovery
const FOLLOWUP_SCHEDULE = {
  threeMonthDays: 90,    // 3 months post-op
  twelveMonthDays: 365,  // 1 year post-op
  reminderDelayDays: 14, // 2 weeks for reminders (surgery patients may need more time)
  maxReminders: 3        // More reminders for surgical patients
};
```

---

## 2. Mental Health Study with Weekly Check-ins

**Scenario:** Depression treatment study with frequent monitoring

### Configuration Example:

```javascript
// Basic Configuration
const STUDY_CONFIG = {
  studyName: "Depression Treatment Outcomes Study",
  studyAbbreviation: "DTOS",
  organizationName: "Mental Health Research Institute",
  primaryEmail: "research@mentalhealthinst.org",
  senderEmail: "wellbeing-study@mentalhealthinst.org",
  senderName: "Wellbeing Research Team"
};

// Note: For weekly check-ins, rename the standard periods
const STUDY_INTERVENTIONS = {
  "Cognitive Behavioral Therapy": {
    baseline: {
      emailSubject: "Welcome - Weekly Wellbeing Check-ins",
      emailBody: `Hello,

Welcome to our wellbeing study. Your participation helps us understand treatment effectiveness.

Please complete your first weekly check-in:

👉 [Week 1 Check-in](https://forms.gle/week1-form)

This brief questionnaire (5 minutes) asks about your mood and daily activities.

Remember: Your responses are confidential and you can withdraw at any time.

Warm regards,
The Wellbeing Research Team

24/7 Crisis Support: 988 (Suicide & Crisis Lifeline)`,
      responseSpreadsheetId: "WEEK1_RESPONSES_ID",
      responseSheetName: "Week 1"
    },
    threeMonth: {  // Repurposed as Week 4
      emailSubject: "Week 4 Check-in - Wellbeing Study",
      emailBody: `Hello,

It's time for your Week 4 check-in.

👉 [Complete Week 4 Check-in](https://forms.gle/week4-form)

Your consistent participation helps us track your progress.

If you're experiencing difficulties, please reach out to your treatment provider.

Take care,
The Wellbeing Research Team`,
      responseSpreadsheetId: "WEEK4_RESPONSES_ID",
      responseSheetName: "Week 4"
    },
    twelveMonth: {  // Repurposed as Week 12 (end of treatment)
      emailSubject: "Final Check-in - Thank You!",
      emailBody: `Hello,

This is your final weekly check-in for our study.

👉 [Complete Final Assessment](https://forms.gle/week12-form)

Thank you for your dedication to this research. Your contributions will help many others.

Best wishes for your continued wellbeing,
The Wellbeing Research Team`,
      responseSpreadsheetId: "WEEK12_RESPONSES_ID",
      responseSheetName: "Week 12"
    }
  },
  
  "Medication Only": {
    // Similar structure
  },
  
  "Combined Treatment": {
    // Similar structure
  }
};

// Weekly check-ins instead of monthly
const FOLLOWUP_SCHEDULE = {
  threeMonthDays: 28,    // Week 4
  twelveMonthDays: 84,   // Week 12
  reminderDelayDays: 2,  // Quick reminders for weekly studies
  maxReminders: 1        // Fewer reminders to avoid overwhelming
};

// Custom column names for clarity
const COLUMN_NAMES = {
  email: "Email Address",
  interventionType: "Treatment Group",
  interventionDate: "Treatment Start Date",
  enrollmentTimestamp: "Timestamp",
  
  // Renamed for weekly context
  baselineEmailSent: "Week 1 Email Sent",
  baselineCompleted: "Week 1 Completed",
  threeMonthEmailSent: "Week 4 Email Sent",
  threeMonthCompleted: "Week 4 Completed",
  twelveMonthEmailSent: "Week 12 Email Sent",
  twelveMonthCompleted: "Week 12 Completed",
  
  threeMonthDueDate: "Week 4 Due Date",
  twelveMonthDueDate: "Week 12 Due Date"
};
```

---

## 3. Medication Trial with Multiple Arms

**Scenario:** Comparing three doses of a new medication vs placebo

### Configuration Example:

```javascript
const STUDY_CONFIG = {
  studyName: "HyperMed Dosing Trial",
  studyAbbreviation: "HMDT",
  organizationName: "Clinical Trials Unit",
  primaryEmail: "trials@university-med.edu",
  senderEmail: "hypermed-trial@university-med.edu",
  senderName: "HyperMed Trial Coordinators"
};

const STUDY_INTERVENTIONS = {
  "Placebo": {
    baseline: {
      emailSubject: "Baseline Health Assessment - HyperMed Trial",
      emailBody: `Dear Participant,

Thank you for enrolling in the HyperMed trial (Participant Group: Control).

Please complete your baseline health assessment:

👉 [Baseline Assessment](https://forms.gle/baseline-form)

Important reminders:
- Take your study medication as directed
- Report any side effects to: 555-0123
- Do not share your group assignment with other participants

Your study coordinator,
Janet Thompson, RN`,
      responseSpreadsheetId: "PLACEBO_BASELINE_ID",
      responseSheetName: "Baseline"
    },
    // Continue for other timepoints...
  },
  
  "Low Dose (10mg)": {
    baseline: {
      emailSubject: "Baseline Health Assessment - HyperMed Trial",
      emailBody: `Dear Participant,

Thank you for enrolling in the HyperMed trial (Participant Group: A).

Please complete your baseline health assessment:

👉 [Baseline Assessment](https://forms.gle/baseline-form)

Important reminders:
- Take ONE blue tablet each morning with food
- Report any side effects immediately to: 555-0123
- Keep medication in original container

Your study coordinator,
Janet Thompson, RN`,
      responseSpreadsheetId: "LOWDOSE_BASELINE_ID",
      responseSheetName: "Baseline"
    }
  },
  
  "Medium Dose (25mg)": {
    // Similar with "TWO blue tablets"
  },
  
  "High Dose (50mg)": {
    // Similar with "ONE white tablet"
  }
};

// More frequent monitoring for medication trial
const FOLLOWUP_SCHEDULE = {
  threeMonthDays: 30,    // 1 month safety check
  twelveMonthDays: 90,   // 3 month efficacy
  reminderDelayDays: 3,  // Quick reminders
  maxReminders: 2
};
```

---

## 4. Rehabilitation Program Monitoring

**Scenario:** Physical therapy outcomes after sports injuries

### Configuration Example:

```javascript
const STUDY_CONFIG = {
  studyName: "Sports Injury Rehabilitation Outcomes",
  studyAbbreviation: "SIRO",
  organizationName: "Sports Medicine Center",
  primaryEmail: "research@sportsmedicine.org",
  senderEmail: "rehab-study@sportsmedicine.org",
  senderName: "Sports Rehab Research"
};

const STUDY_INTERVENTIONS = {
  "ACL Reconstruction Rehab": {
    baseline: {
      emailSubject: "Initial Assessment - ACL Rehab Study",
      emailBody: `Dear Athlete,

Welcome to our ACL rehabilitation study!

Before starting your rehab program, please complete:

👉 [Initial Function Assessment](https://forms.gle/acl-baseline)
👉 [Download our Rehab App](https://yourapp.com/download)

This assessment includes:
- Current pain levels
- Range of motion self-test (instructions provided)
- Daily activity limitations
- Athletic goals

Stay strong!
The Sports Rehab Team`,
      responseSpreadsheetId: "ACL_BASELINE_ID",
      responseSheetName: "Initial"
    },
    threeMonth: {
      emailSubject: "6-Week Progress Check - ACL Rehab",
      emailBody: `Hey there!

You're 6 weeks into recovery - great progress! 💪

Time for your progress assessment:

👉 [6-Week Assessment](https://forms.gle/acl-6week)

New this week:
- Video assessment of your squats (instructions in form)
- Updated strength goals
- Return-to-sport timeline
