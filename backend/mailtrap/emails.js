import {
  PASSWORD_RESET_REQUEST_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
  VERIFICATION_EMAIL_TEMPLATE,
  WELCOME_EMAIL_STUDENT_TEMPLATE,
} from "./emailTemplates.js";
import { mailtrapClient, sender } from "./mailtrap.config.js";

export const sendVerificationEmail = async (email, verificationToken) => {
  const recipient = [{ email }];

  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Verify your email",
      html: VERIFICATION_EMAIL_TEMPLATE.replace(
        "{verificationCode}",
        verificationToken
      ),
      category: "Email Verification",
    });

    console.log("Email sent successfully", response);
  } catch (error) {
    console.error(`Error sending email: ${error}`);
    throw new Error(`Error sending verification email: ${error}`);
  }
};

export const sendWelcomeEmail = async (email, name) => {
  const recipient = [{ email }];

  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      template_uuid: "491f2852-bb55-4485-bb27-c08a45bbea09",
      template_variables: {
        company_info_name: "Codify",
        name: name,
      },
    });

    console.log("Email sent successfully", response);
  } catch (error) {
    console.error(`Error sending email: ${error}`);
    throw new Error(`Error sending welcome email: ${error}`);
  }
};

export const sendPasswordResetEmail = async (email, resetURL) => {
  const recipient = [{ email }];

  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Reset your password",
      html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
      category: "Password Reset",
    });

    console.log("Password reset email sent successfully", response);
  } catch (error) {
    console.log("Error sending password reset email", error);
    throw new Error(`Error sending password reset email: ${error}`);
  }
};

export const sendResetSuccessEmail = async (email) => {
  const recipient = [{ email }];

  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Password reset successful",
      html: PASSWORD_RESET_SUCCESS_TEMPLATE,
      category: "Password Reset",
    });

    console.log("Password reset success email sent successfully", response);
  } catch (error) {
    console.log("Error sending password reset success email", error);
    throw new Error(`Error sending password reset success email: ${error}`);
  }
};

export const sendStudentWelcomeEmail = async (
  email,
  firstName,
  lastName,
  password,
  institutionName
) => {
  const recipient = [{ email }];

  const emailBody = WELCOME_EMAIL_STUDENT_TEMPLATE.replace(
    /{firstName}/g,
    firstName
  )
    .replace(/{lastName}/g, lastName)
    .replace(/{email}/g, email)
    .replace(/{password}/g, password)
    .replace(/{institutionName}/g, institutionName);

  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Welcome to Your Institution's LMS",
      html: emailBody,
      category: "Student Registration",
    });

    console.log("Student welcome email sent successfully", response);
  } catch (error) {
    console.error(`Error sending student email: ${error}`);
    throw new Error(`Error sending student welcome email: ${error}`);
  }
};

export const sendProfessorWelcomeEmail = async (
  email,
  firstName,
  lastName,
  password,
  institutionName
) => {
  const recipient = [{ email }];

  const emailBody = WELCOME_EMAIL_STUDENT_TEMPLATE.replace(
    /{firstName}/g,
    firstName
  )
    .replace(/{lastName}/g, lastName)
    .replace(/{email}/g, email)
    .replace(/{password}/g, password)
    .replace(/{institutionName}/g, institutionName);

  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Welcome to Your Institution's LMS",
      html: emailBody,
      category: "Professor Registration",
    });

    console.log("Professor welcome email sent successfully", response);
  } catch (error) {
    console.error(`Error sending Professor email: ${error}`);
    throw new Error(`Error sending Professor welcome email: ${error}`);
  }
};
