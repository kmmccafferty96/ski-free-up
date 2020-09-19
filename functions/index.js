'use strict';

const functions = require('firebase-functions');
const nodemailer = require('nodemailer');

const gmailEmail = functions.config().gmail.email;
const gmailPassword = functions.config().gmail.password;
const recipientEmail = functions.config()['alert-recipient'].email;
const bccEmail = functions.config()['alert-recipient'].bcc;
const mailTransport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: gmailEmail,
    pass: gmailPassword
  }
});

exports.sendSurveyAlertEmail = functions.database
  .ref('/survey-submission-list/{surveyId}')
  .onCreate(async (snapshot, context) => {
    const val = snapshot.val();
    const surveyeeFullName = `${val.contactInformation.firstName} ${val.contactInformation.lastName}`;

    const mailOptions = {
      from: '"Ski Free UP Alerts" <skifreeupalerts@gmail.com>',
      to: recipientEmail,
      bcc: bccEmail,
      subject: `🚨 Ski Free UP survey response from ${surveyeeFullName} 🚨`
    };

    // Build email
    let message = `<h1>New Ski FreeUP Survey Response</h1>`;
    message += `<span>Have you ever skied? - <span style="font-weight:bold;">${val.skiedBefore}</span></span><br>`;
    message += `<span>When was the last time you skied? - <span style="font-weight:bold;">${val.lastTimeSkiing}</span></span><br>`;
    message += `<span>Please check all ski areas you have skied in UP. - <span style="font-weight:bold;">${val.placesSkied.join(
      ', '
    )}</span></span><br>`;
    message += `<span>How many people do you estimate will ski with you if you receive a free or discounted lift ticket? - <span style="font-weight:bold;">${val.numberOfPeople}</span></span><br>`;
    message += `<span>When you ski you... - <span style="font-weight:bold;">${val.leaveDayOrNight}</span></span><br>`;
    message += `<span>If you recieve a free lift ticket can you ski on a weekday? - <span style="font-weight:bold;">${val.canSkiWeekday}</span></span><br>`;
    message += `<h3>Contact Information</h3>`;
    message += `<span>First Name - <span style="font-weight:bold;">${val.contactInformation.firstName}</span></span><br>`;
    message += `<span>Last Name - <span style="font-weight:bold;">${val.contactInformation.lastName}</span></span><br>`;
    message += `<span>Email - <span style="font-weight:bold;">${val.contactInformation.email}</span></span><br>`;
    message += `<span>Address - <span style="font-weight:bold;">${val.contactInformation.address1}</span></span><br>`;
    message += `<span>Address 2 - <span style="font-weight:bold;">${
      val.contactInformation.address2 || 'NONE'
    }</span></span><br>`;
    message += `<span>City - <span style="font-weight:bold;">${val.contactInformation.city}</span></span><br>`;
    message += `<span>State - <span style="font-weight:bold;">${val.contactInformation.state}</span></span><br>`;
    message += `<span>Zip - <span style="font-weight:bold;">${val.contactInformation.zip}</span></span><br>`;
    message += `<span>I would like to receive additional specials and promotions. - <span style="font-weight:bold;">${val.additionalSpecials}</span></span><br><br><br>`;
    message += `<span>Unique ID - <span style="font-weight:bold;">${val.uniqueId}</span></span>`;

    mailOptions.text = message;
    mailOptions.html = message;

    try {
      await mailTransport.sendMail(mailOptions);
      console.log(`Email for surveyee ${surveyeeFullName} sent to:`, recipientEmail);
    } catch (error) {
      console.error(`There was an error while sending the email for the surveyee ${surveyeeFullName}:`, error);
    }

    return null;
  });
