import FormData from "form-data"; // form-data v4.0.1
import Mailgun from "mailgun.js"; // mailgun.js v11.1.0
import type { User } from "~~/types/user";

export async function sendSimpleMessage() {
  const mailgun = new Mailgun(FormData);
  console.log("MG_API_KEY:", process.env.MG_API_KEY);
  const mg = mailgun.client({
    username: "api",
    key: process.env.MG_API_KEY || "API_KEY",
    // When you have an EU-domain, you must specify the endpoint:
    // url: "https://api.eu.mailgun.net"
  });
  try {
    const data = await mg.messages.create("email.enrollgsrp.com", {
      from: "Enroll GSRP <postmaster@email.enrollgsrp.com>",
      to: ["Eric Anderson <anderoy@gmail.com>"],
      subject: "Hello Eric Anderson",
      //text: "Eric, this is a test email sent using Mailgun.js. Cheers! Hopefully it doesn't go to spam.",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Password Reset Request</h2>
          <p>You have requested to reset your password. Please click the button below to set a new password:</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://dpscd.enrollgsrp.com/reset-password?token=YOUR_RESET_TOKEN" 
               style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Reset Password
            </a>
          </div>
          
          <p>Or copy and paste the following link into your browser:</p>
          <p style="word-break: break-all; background-color: #f8f9fa; padding: 10px; border-radius: 3px;">
            <a href="$https://dpscd.enrollgsrp.com/reset-password?token=YOUR_RESET_TOKEN">https://dpscd.enrollgsrp.com/reset-password?token=YOUR_RESET_TOKEN</a>
          </p>
          
          <p style="color: #6c757d; font-size: 14px;">
            This link will expire in 1 hour(s).
          </p>
          
          <p style="color: #6c757d; font-size: 14px;">
            If you did not request this password reset, please ignore this email. Your password will remain unchanged.
          </p>
        </div>
      `,
    });

    console.log(data); // logs response data
  } catch (error) {
    console.log(error); //logs any error
  }
}

export async function sendConfirmationMessage(user: { name: string; email: string; confirmationToken: string; }) {
  const mailgun = new Mailgun(FormData);
  console.log("MG_API_KEY:", process.env.MG_API_KEY);
  const mg = mailgun.client({
    username: "api",
    key: process.env.MG_API_KEY || "API_KEY",
    // When you have an EU-domain, you must specify the endpoint:
    // url: "https://api.eu.mailgun.net"
  });
  try {
    const data = await mg.messages.create("email.enrollgsrp.com", {
      from: "Enroll GSRP <postmaster@email.enrollgsrp.com>",
      to: [`${user.name} <${user.email}>`],
      subject: `Hello ${user.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Please Confirm Your New Registration</h2>
          <p>Thank you for registering for EnrollGSRP for Detroit Public Schools Community District. Please click click the link below to confirm your registration:</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://dpscd.enrollgsrp.com/user-confirmation?token=${user.confirmationToken}" 
               style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Confirm Registration
            </a>
          </div>
          
          <p>Or copy and paste the following link into your browser:</p>
          <p style="word-break: break-all; background-color: #f8f9fa; padding: 10px; border-radius: 3px;">
            <a href="https://dpscd.enrollgsrp.com/user-confirmation?token=${user.confirmationToken}">https://dpscd.enrollgsrp.com/user-confirmation?token=${user.confirmationToken}</a>
          </p>

          <p style="color: #6c757d; font-size: 14px;">
            If you did not register for this service, please ignore this email.
          </p>
        </div>
      `,
    });

    console.log(data); // logs response data
  } catch (error) {
    console.log(error); //logs any error
  }
}