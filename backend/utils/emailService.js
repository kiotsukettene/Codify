import { sendInquiryEmail } from "../mailtrap/emails.js";

const sendEmail = async ({ name, email, message }) => {
  return await sendInquiryEmail({ name, email, message });
};

export default sendEmail;
