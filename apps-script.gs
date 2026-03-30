// ============================================================
// SETHAKGA GROUP — Google Apps Script Web App
// Receives form submissions → writes to Google Sheets + sends email
// ============================================================
//
// SETUP STEPS (do this once):
//
//  1. Go to https://sheets.google.com and create a NEW spreadsheet.
//     Name it e.g. "Sethakga Form Submissions".
//
//  2. Copy the Spreadsheet ID from the URL:
//     https://docs.google.com/spreadsheets/d/  <<THIS PART>>  /edit
//     Paste it as the value of SPREADSHEET_ID below.
//
//  3. In the spreadsheet, go to Extensions > Apps Script.
//     Delete any existing code and paste this entire file.
//
//  4. Click Save (Ctrl+S), then:
//       Deploy > New Deployment
//       Type: Web App
//       Execute as: Me (your Google account)
//       Who has access: Anyone
//     Click Deploy, authorize permissions, then copy the Web App URL.
//
//  5. Open main.js in VS Code and paste the URL as APPS_SCRIPT_URL.
//
//  6. To test: run testSetup() manually inside the Apps Script editor.
//     You should receive a test email at Admin@sethakga.co.za.
//
//  NOTE: Every time you change code here, create a NEW deployment
//  (Deploy > New Deployment) and update the URL in main.js.
// ============================================================

const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE'; // ← replace this
const NOTIFY_EMAIL   = 'Admin@sethakga.co.za';

// ---- Main entry point — handles all POST requests from the website ----
function doPost(e) {
  try {
    const params   = e.parameter;          // flat key→value from URLSearchParams
    const formType = params.formType || 'unknown';

    // Route to the correct sheet tab
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const tabNames = {
      residential : 'Residential Bookings',
      commercial  : 'Commercial Bookings',
      referral    : 'Referrals',
      contact     : 'Contact Enquiries',
      maid        : 'Maid Bookings',
      hair        : 'Hair Bookings',
      academy     : 'Academy Applications',
      thushanang  : 'Thushanang Applications',
    };
    const tabName = tabNames[formType] || 'Other';
    const sheet   = ss.getSheetByName(tabName) || ss.insertSheet(tabName);

    // Timestamp in South African time
    const timestamp = Utilities.formatDate(
      new Date(), 'Africa/Johannesburg', 'dd/MM/yyyy HH:mm:ss'
    );

    // Build row — exclude internal fields from sheet columns
    const skipKeys  = ['formType', 'submittedAt'];
    const dataKeys  = Object.keys(params).filter(k => !skipKeys.includes(k));
    const dataVals  = dataKeys.map(k => params[k]);

    // Write header row if this is the first entry on this sheet
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['Timestamp', 'Form Type', ...dataKeys]);
      // Freeze header row and bold it
      sheet.setFrozenRows(1);
      sheet.getRange(1, 1, 1, dataKeys.length + 2).setFontWeight('bold');
    }

    // Append the data row
    sheet.appendRow([timestamp, formType, ...dataVals]);

    // Auto-resize columns for readability
    sheet.autoResizeColumns(1, dataKeys.length + 2);

    // Send email notification
    sendNotificationEmail(formType, timestamp, params, dataKeys);

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    Logger.log('doPost error: ' + err.toString());
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ---- Email notification helper ----
function sendNotificationEmail(formType, timestamp, params, dataKeys) {
  const subjects = {
    residential : '🏠 New Residential Booking — Sethakga Cleaning',
    commercial  : '🏢 New Commercial Quote Request — Sethakga Cleaning',
    referral    : '🌟 New Referral Submission — Sethakga Rewards',
    contact     : '📬 New Contact Enquiry — Sethakga Group',
  };
  const subject = subjects[formType] || '📋 New Form Submission — Sethakga Group';

  let body = `New ${formType.toUpperCase()} submission received\n`;
  body += `Submitted at: ${timestamp}\n`;
  body += `${'─'.repeat(50)}\n\n`;

  dataKeys.forEach(k => {
    const label = k.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    body += `${label}: ${params[k] || '—'}\n`;
  });

  body += `\n${'─'.repeat(50)}\n`;
  body += `View all submissions:\n`;
  body += `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}\n`;
  body += `\nThis is an automated notification from your Sethakga website.\n`;

  GmailApp.sendEmail(NOTIFY_EMAIL, subject, body);
}

// ---- Test function: run manually in the Apps Script editor to verify setup ----
function testSetup() {
  // Test spreadsheet access
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  Logger.log('✅ Spreadsheet connected: ' + ss.getName());

  // Test email
  GmailApp.sendEmail(
    NOTIFY_EMAIL,
    '✅ Sethakga Apps Script — Setup Confirmed',
    'Your Google Apps Script web app is connected and working correctly.\n\n' +
    'Form submissions from your website will now be saved to:\n' +
    'https://docs.google.com/spreadsheets/d/' + SPREADSHEET_ID + '\n\n' +
    'You will receive an email notification for every new submission.'
  );
  Logger.log('✅ Test email sent to ' + NOTIFY_EMAIL);
}

// ---- Handle GET requests (returns a simple status page) ----
function doGet() {
  return ContentService
    .createTextOutput('Sethakga Form Handler is running ✅')
    .setMimeType(ContentService.MimeType.TEXT);
}
