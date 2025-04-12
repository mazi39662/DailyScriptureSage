import nodemailer from "nodemailer";
import { Verse } from "@shared/schema";
import { storage } from "./storage";

// Create reusable transporter
const createTransporter = () => {
  // For development/testing, use a test account from ethereal.email
  if (process.env.NODE_ENV === "development") {
    return nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER || "ethereal.user@ethereal.email",
        pass: process.env.EMAIL_PASS || "ethereal_password",
      },
    });
  }
  
  // For production, use a real email service
  return nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || "Gmail", // e.g., Gmail, SendGrid, etc.
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

// HTML email template for daily verse
const createEmailTemplate = (verse: Verse, recipient: string): string => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Your Daily Bible Verse</title>
      <style>
        body {
          font-family: 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          text-align: center;
          padding-bottom: 20px;
          border-bottom: 1px solid #eee;
          margin-bottom: 20px;
        }
        .verse {
          font-size: 18px;
          font-style: italic;
          text-align: center;
          margin: 20px 0;
          padding: 15px;
          background-color: #f9f7f0;
          border-radius: 5px;
        }
        .reference {
          text-align: right;
          font-weight: bold;
          margin-bottom: 20px;
        }
        h2 {
          color: #5B8C5A;
          border-bottom: 1px solid #eee;
          padding-bottom: 5px;
        }
        .footer {
          margin-top: 30px;
          font-size: 12px;
          text-align: center;
          color: #777;
          border-top: 1px solid #eee;
          padding-top: 20px;
        }
        .unsubscribe {
          color: #777;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Daily Dose of Bible Verse</h1>
      </div>
      
      <p>Hello ${recipient},</p>
      <p>Here is your daily Bible verse to inspire and guide your day:</p>
      
      <div class="verse">${verse.text}</div>
      <div class="reference">- ${verse.reference}</div>
      
      <h2>Understanding</h2>
      <p>${verse.explanation}</p>
      
      <h2>Today's Application</h2>
      <p>${verse.application}</p>
      
      <div class="footer">
        <p>Daily Dose of Bible Verse - Spiritual nourishment for your daily journey</p>
        <p class="unsubscribe">To unsubscribe from these emails, visit your <a href="${process.env.APP_URL || 'http://localhost:5000'}/dashboard">account dashboard</a>.</p>
      </div>
    </body>
    </html>
  `;
};

// Send daily verse to a single user
export async function sendDailyVerseEmail(verse: Verse, userEmail: string, userName: string) {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: `"Daily Bible Verse" <${process.env.EMAIL_USER || "noreply@dailybibleverse.com"}>`,
      to: userEmail,
      subject: `Daily Bible Verse: ${verse.reference}`,
      html: createEmailTemplate(verse, userName),
    };
    
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${userEmail}: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}

// Send daily verse to all subscribed users
export async function sendDailyVerseToAllUsers(verse: Verse) {
  try {
    const subscribedUsers = await storage.getSubscribedUsers();
    
    for (const user of subscribedUsers) {
      try {
        await sendDailyVerseEmail(verse, user.email, user.fullName);
        // Add a small delay to prevent overwhelming the email server
        await new Promise(resolve => setTimeout(resolve, 200));
      } catch (error) {
        console.error(`Failed to send email to ${user.email}:`, error);
        // Continue with other users even if one fails
      }
    }
    
    return { success: true, sentCount: subscribedUsers.length };
  } catch (error) {
    console.error("Error in batch sending emails:", error);
    throw error;
  }
}
