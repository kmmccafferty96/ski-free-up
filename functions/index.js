'use strict';

const functions = require('firebase-functions');
const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

var database = admin.database();

const skiFreeUpEmail = functions.config().skifreeupgmail.email;
const skiFreeUpPassword = functions.config().skifreeupgmail.password;
const skiFreeUpMailTransport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: skiFreeUpEmail,
    pass: skiFreeUpPassword
  }
});

const skiFreeUpAlertsEmail = functions.config().skifreeupalertsgmail.email;
const skiFreeUpAlertsPassword = functions.config().skifreeupalertsgmail.password;
const skiFreeUpAlertsMailTransport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: skiFreeUpAlertsEmail,
    pass: skiFreeUpAlertsPassword
  }
});

const alertRecipientEmail = functions.config()['alert-recipient'].email;

exports.setServerDateOnRecord = functions.database
  .ref('/survey-submission-list/{surveyId}')
  .onCreate(async (snapshot, context) => {
    try {
      database.ref(`survey-submission-list/${snapshot.key}/dateTimeTaken`).set(new Date().toUTCString());
      functions.logger.log(`dateTimeTaken set on ${snapshot.key}`);
    } catch (error) {
      functions.logger.error(`There was an error setting dateTimeTaken for ${snapshot.key}:`, error);
    }

    return null;
  });

exports.sendSurveyAlertEmail = functions.database
  .ref('/survey-submission-list/{surveyId}')
  .onCreate(async (snapshot, context) => {
    const val = snapshot.val();
    const surveyeeFullName = `${val.contactInformation.firstName} ${val.contactInformation.lastName}`;

    const mailOptions = {
      from: '"Ski Free UP Alerts" <skifreeupalerts@gmail.com>',
      to: alertRecipientEmail,
      subject: `🚨 Ski Free UP survey response from ${surveyeeFullName} 🚨`
    };

    // Build email
    let message = `<h1>New Ski Free UP Survey Response</h1>
    <span>Have you ever skied? - <span style="font-weight:bold;">${val.skiedBefore}</span></span><br>
    <span>When was the last time you skied? - <span style="font-weight:bold;">${val.lastTimeSkiing}</span></span><br>
    <span>Please check all ski areas you have skied in UP. - <span style="font-weight:bold;">${
      val.placesSkied ? val.placesSkied.join(', ') : ''
    }</span></span><br>
    <span>How many people do you estimate will ski with you if you receive a free or discounted lift ticket? - <span style="font-weight:bold;">${
      val.numberOfPeople
    }</span></span><br>
    <span>When you ski you... - <span style="font-weight:bold;">${val.leaveDayOrNight}</span></span><br>
    <span>If you recieve a free lift ticket can you ski on a weekday? - <span style="font-weight:bold;">${
      val.canSkiWeekday
    }</span></span><br>
    <h3>Contact Information</h3>
    <span>First Name - <span style="font-weight:bold;">${val.contactInformation.firstName}</span></span><br>
    <span>Last Name - <span style="font-weight:bold;">${val.contactInformation.lastName}</span></span><br>
    <span>Email - <span style="font-weight:bold;">${val.contactInformation.email}</span></span><br>
    <span>Address - <span style="font-weight:bold;">${val.contactInformation.address1}</span></span><br>
    <span>Address 2 - <span style="font-weight:bold;">${val.contactInformation.address2 || 'NONE'}</span></span><br>
    <span>City - <span style="font-weight:bold;">${val.contactInformation.city}</span></span><br>
    <span>State - <span style="font-weight:bold;">${val.contactInformation.state}</span></span><br>
    <span>Zip - <span style="font-weight:bold;">${val.contactInformation.zip}</span></span><br>
    <span>I would like to receive additional specials and promotions. - <span style="font-weight:bold;">${
      val.additionalSpecials
    }</span></span><br><br><br>
    <span>Unique ID - <span style="font-weight:bold;">${val.uniqueId}</span></span>`;

    mailOptions.text = message;
    mailOptions.html = message;

    try {
      await skiFreeUpAlertsMailTransport.sendMail(mailOptions);
      functions.logger.log(`Alert email for surveyee ${surveyeeFullName} sent to:`, alertRecipientEmail);
    } catch (error) {
      functions.logger.error(
        `There was an error while sending the alert email for the surveyee ${surveyeeFullName}:`,
        error
      );
    }

    return null;
  });

exports.sendSurveyConfirmationEmail = functions.database
  .ref('/survey-submission-list/{surveyId}')
  .onCreate(async (snapshot, context) => {
    const val = snapshot.val();
    const surveyeeFullName = `${val.contactInformation.firstName} ${val.contactInformation.lastName}`;
    const surveyeeEmail = val.contactInformation.email;

    const mailOptions = {
      from: '"Ski Free UP" <skifreeup@gmail.com>',
      to: surveyeeEmail,
      subject: `Ski Free UP Survey Confirmation`
    };

    // Build email
    mailOptions.text = `Dear ${surveyeeFullName},\r\n\r\nThank you for supporting Upper Peninsula ski areas in the Ski Free UP Promotion.
    You have the unique opportunity to receive a free lift ticket from a UP ski area. Pine Mountain Ski Resort has been selected
    to be your ski destination through this promotion. Please expect an email from Pine Mountain Ski & Golf Resort with details within
    the next 24 to 48 hours. If 48 hours have passed and you have still not received a ticket, please reply to this email and we will get it sorted out.
    \r\n\r\nThank you,\r\nSki Free UP\r\nwww.skifreeup.com`;

    mailOptions.html = `<p>Dear ${surveyeeFullName},</p>
    <p>Thank you for supporting Upper Peninsula ski areas in the Ski Free UP Promotion.
    You have the unique opportunity to receive a free lift ticket from a UP ski area. <span style="font-weight: bold;">Pine Mountain Ski Resort</span>
    has been selected to be your ski destination through this promotion. Please expect an email from Pine Mountain Ski & Golf Resort with details within
    the next 24 to 48 hours. If 48 hours have passed and you have still not received a ticket, please reply to this email and we will get it sorted out.</p>
    <p>Thank you,<br>Ski Free UP<br><a href="https://www.skifreeup.com">www.skifreeup.com</a></p>`;

    try {
      await skiFreeUpMailTransport.sendMail(mailOptions);
      functions.logger.log(`Confirmation email to surveyee ${surveyeeFullName} sent to:`, surveyeeEmail);
    } catch (error) {
      functions.logger.error(
        `There was an error while sending the confirmation email to the surveyee ${surveyeeFullName}:`,
        error
      );
    }

    return null;
  });

exports.scheduledSendLiftTickets = functions.pubsub.schedule('10 10 * * *').onRun(async (context) => {
  var ref = database.ref('survey-submission-list');

  var surveyEmails = [];

  // Build surveyEmails array
  ref
    .orderByChild('ticketEmailSent')
    .equalTo(false)
    .once('value', async (snapshot) => {
      snapshot.forEach((s) => {
        const val = s.val();

        if (!val.ticketEmailSent) {
          const surveyeeFullName = `${val.contactInformation.firstName} ${val.contactInformation.lastName}`;
          const surveyeeEmail = val.contactInformation.email;
          const surveyEmail = {
            key: s.key,
            to: surveyeeEmail,
            surveyeeFullName,
            surveyeeEmail
          };

          functions.logger.log(`Adding ticket email for ${surveyeeFullName} (${surveyeeEmail})`);

          // Build email
          surveyEmail.textMessage = `Dear ${surveyeeFullName},\r\n\r\n

        Thank you for supporting Upper Peninsula ski resorts. Enclosed is a free lift ticket ($55 value) which can be used after January 1st, 2021. Pine Mountain Ski & Golf Resort located in Iron Mountain, Michigan was selected for your free lift ticket. Pine Mountain is the only ski in/ski out resort in the Upper Peninsula and just completed a 4 million dollar renovation which makes it one of the top ski destinations in the Upper Peninsula. Visit our website for additional information on lodging, food, and activities. www.pinemountainresort.com.\r\n\r\n

        Please review the rules and regulations below regarding your free lift ticket.\r\n\r\n

        1.  In addition to your free lift ticket, you may purchase up to 2 additional lift tickets for 50% off regulate rate during your visit for friends and family.\r\n
        2.  Free lift ticket is valid any Monday or Thursday between January 1st and April 30th, 2021 or the end of the season, whichever comes first.\r\n
        3.  Proper id is required to claim free lift ticket.\r\n
        4.  Paper copy or this email on your cell phone is required to claim free lift ticket.\r\n
        5.  Free lift ticket is transferable to a family member with same last name.\r\n
        6.  One free lift ticket per household per day.\r\n
        7.  Children under age 9 always ski for free at Pine Mountain Ski & Golf Resort with each adult lift ticket.\r\n
        8.  One free lift ticket per person per season.\r\n\r\n

        Be sure to show this email to Guest Services at Pine Mountain Ski & Golf Resort to redeem your free lift ticket.\r\n\r\n

        Pine Mountain Ski & Golf Resort is taking additional precautions during Covid-19 to keep you and your family healthy during this ski season.\r\n\r\n

        Visit www.pinemountainresort.com for more information on lodging, food, and activities prior to your visit.\r\n\r\n

        Redemption Code: ${val.uniqueId}
        `;

          surveyEmail.htmlMessage = `<div style="max-width: 900px; width: 100%; background-color: white;">
        <a href="https://www.pinemountainresort.com/">
          <img src="https://www.skifreeup.com/assets/pm_letterhead_top.jpg" alt="Pine Mountain Resort Letter Header" style="width: 100%;">
        </a>
        <div style="padding: 25px 20px;">
          <p>
            Dear ${surveyeeFullName},
          </p>
          <p>
            Thank you for supporting Upper Peninsula ski resorts. Enclosed is a free lift ticket ($55 value) which can be used after January 1<sup>st</sup>, 2021.
            Pine Mountain Ski & Golf Resort located in Iron Mountain, Michigan was selected for your free lift ticket.
            Pine Mountain is the only ski in/ski out resort in the Upper Peninsula and just completed a 4 million dollar renovation which makes it one of
            the top ski destinations in the Upper Peninsula.
            <a href="https://www.pinemountainresort.com/">Visit our website</a> for additional information on lodging, food, and activities.
          <p>
          <p>
            Please review the rules and regulations below regarding your free lift ticket.
          </p>
          <p>
            <ol>
              <li>In addition to your free lift ticket, you may purchase up to 2 additional lift tickets for 50% off the regular rate during your visit for friends and family.</li>
              <li>Free lift ticket is valid any Monday or Thursday between January 1<sup>st</sup> and April 30<sup>th</sup>, 2021 or the end of the season, whichever comes first.</li>
              <li>Proper id is required to claim free lift ticket.</li>
              <li>Paper copy or this email on your cell phone is required to claim free lift ticket.</li>
              <li>Free lift ticket is transferable to a family member with same last name.</li>
              <li>One free lift ticket per household per day.</li>
              <li>Children under age 9 always ski for free at Pine Mountain Ski & Golf Resort with each adult lift ticket.</li>
              <li>One free lift ticket per person per season.</li>
            </ol>
          </p>
          <p>
            Be sure to show this email to Guest Services at Pine Mountain Ski & Golf Resort to redeem your free lift ticket.
          </p>
          <p>
            Pine Mountain Ski & Golf Resort is taking additional precautions during COVID-19 to keep you and your family healthy during this ski season.
          </p>
          <p>
            Visit <a href="https://www.pinemountainresort.com/">www.pinemountainresort.com</a> for more information on lodging, food, and activities prior to your visit.
          </p>
          <p>
            Redemption Code: <span style="font-weight: bold;">${val.uniqueId}</span>
          </p>
        </div>
        <img src="https://www.skifreeup.com/assets/pm_letterhead_bottom.jpg" alt="Pine Mountain Resort Letter Footer" style="width: 100%;">
      </div>`;

          surveyEmails.push(surveyEmail);
        }
      });

      // Loop surveyEmails array and send emails
      for (let i = 0; i < surveyEmails.length; i++) {
        const mailOptions = {
          from: '"Ski Free UP" <skifreeup@gmail.com>',
          to: surveyEmails[i].surveyeeEmail,
          subject: `Free Lift Ticket from Pine Mountain Ski & Golf Resort!`,
          text: surveyEmails[i].textMessage,
          html: surveyEmails[i].htmlMessage
        };

        try {
          await skiFreeUpMailTransport.sendMail(mailOptions);
          functions.logger.log(
            `TIcket email to surveyee ${surveyEmails[i].surveyeeFullName} sent to:`,
            surveyEmails[i].surveyeeEmail
          );
          database.ref(`survey-submission-list/${surveyEmails[i].key}/ticketEmailSent`).set(true);
        } catch (error) {
          functions.logger.error(
            `There was an error while sending the ticket email to the surveyee ${surveyEmails[i].surveyeeFullName}:`,
            error
          );
        }
      }
    });

  return null;
});

exports.createRowInSpreadsheet = functions.database
  .ref('/survey-submission-list/{surveyId}')
  .onCreate(async (snapshot, context) => {
    const val = snapshot.val();
    var jwt = getJwt();
    var apiKey = getApiKey();
    var spreadsheetId = '1NCII5zBuvQJd1p7HKE6BbyoEXfEksYK3yCNT1lv4KWg';
    var range = 'A1';
    var row = [
      val.skiedBefore,
      val.lastTimeSkiing,
      val.placesSkied ? val.placesSkied.join(', ') : '',
      val.numberOfPeople,
      val.leaveDayOrNight,
      val.canSkiWeekday,
      val.contactInformation.firstName,
      val.contactInformation.lastName,
      val.contactInformation.email,
      val.contactInformation.address1,
      val.contactInformation.address2,
      val.contactInformation.city,
      val.contactInformation.state,
      val.contactInformation.zip,
      val.additionalSpecials,
      val.dateTimeTaken,
      val.uniqueId
    ];
    appendSheetRow(jwt, apiKey, spreadsheetId, range, row);
  });

function getJwt() {
  var credentials = require('./credentials.json');
  return new google.auth.JWT(credentials.client_email, null, credentials.private_key, [
    'https://www.googleapis.com/auth/spreadsheets'
  ]);
}

function getApiKey() {
  var apiKeyFile = require('./api_key.json');
  return apiKeyFile.key;
}

function appendSheetRow(jwt, apiKey, spreadsheetId, range, row) {
  const sheets = google.sheets({ version: 'v4' });
  sheets.spreadsheets.values.append(
    {
      spreadsheetId: spreadsheetId,
      range: range,
      auth: jwt,
      key: apiKey,
      valueInputOption: 'RAW',
      resource: { values: [row] }
    },
    function (err, result) {
      if (err) {
        throw err;
      } else {
        functions.logger.log('Updated sheet: ' + result.data.updates.updatedRange);
      }
    }
  );
}
