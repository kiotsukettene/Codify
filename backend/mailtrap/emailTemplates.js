export const VERIFICATION_EMAIL_TEMPLATE = `

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Codify</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #ffffff;">
    <table cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #FBF3FF; border-radius: 24px;">
        

        <tr>
            <td style="padding: 40px;">
                
                <img src="https://i.imgur.com/TfDZDNE.png" alt="Codify" style="width: 100px; height: auto; text-align: center ">

                <div style="text-align: center;">
                    <img src="https://i.imgur.com/eZxhuVn.png" alt="Astronaut" style="width: 250px; height: auto;">
                </div>

                <h1 style="color: #8257E6; font-size: 28px; margin-bottom: 10px; text-align: center;">Verify your Email</h1>

                <p style="color: #333333; font-size: 14px; line-height: 1.6; margin-bottom: 30px; text-align:center">
                   Hello! Thank you for signing up! Your verification code is: </p>
 
 
<table role="presentation" align="center" cellpadding="0" cellspacing="0" border="0">
    <tr>
        <td style="background: #f4f4f4; padding: 10px 20px; font-size: 50px; font-weight: bold; color: #8257E6; text-align: center; letter-spacing: 4px; border-radius: 8px;">
            {verificationCode}
        </td>
    </tr>
</table>

 
 <p>
  Enter this code on the verification page to complete your registration. <br><br>
This code will expire in 1 minute for security reasons
<br><br><br>
If you didn't create an account with us, please ignore this email.
                </p>


              <p style="color: #333333; font-size: 14px; margin-bottom: 5px; padding-top:60px; ">Best regards,</p>
                <p style="color: #333333; font-size: 14px; font-weight: bold;">The Codify Team</p>

            </td>
        </tr>

    </table>
</body>
</html>
`;

export const PASSWORD_RESET_SUCCESS_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Codify</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #ffffff;">
    <table cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #FBF3FF; border-radius: 24px;">
        

        <tr>
            <td style="padding: 40px;">
                
                <img src="https://i.imgur.com/TfDZDNE.png" alt="Codify" style="width: 100px; height: auto; text-align: center ">

                <div style="text-align: center;">
                    <img src="https://i.imgur.com/LGhqlRJ.png" alt="Astronaut" style="width: 250px; height: auto;">
                </div>

                <h1 style="color: #8257E6; font-size: 28px; margin-bottom: 10px; text-align: center;">Password Reset Successfully!</h1>

                <p style="color: #333333; font-size: 14px; line-height: 1.6; margin-bottom: 30px;">
                   <strong> Hello!👋 </strong> <br>
we're writing to confirm that your password has been successfully reset.<br><br>

<strong> For security reasons, we recommend that you: </strong> <br><br>
🪐 Use a strong, unique password <br>
🪐 Enable two-factor authentication if available <br>
🪐 Avoid using the same password across multiple sites <br>

<br><br>
If you did not initiate this password reset, please contact our support team immediately. 🚀
                </p>


                <p style="color: #333333; font-size: 14px; margin-bottom: 5px;">Best regards,</p>
                <p style="color: #333333; font-size: 14px; font-weight: bold;">The Codify Team</p>

            </td>
        </tr>

    </table>
</body>
</html>
`;

export const PASSWORD_RESET_REQUEST_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Codify</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #ffffff;">
    <table cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #FBF3FF; border-radius: 24px;">
        

        <tr>
            <td style="padding: 40px;">
                
                <img src="https://i.imgur.com/TfDZDNE.png" alt="Codify" style="width: 100px; height: auto; text-align: center ">

                <div style="text-align: center;">
                    <img src="https://i.imgur.com/JyLYCRk.png" alt="Astronaut" style="width: 250px; height: auto;">
                </div>

                <h1 style="color: #8257E6; font-size: 28px; margin-bottom: 10px; text-align: center;">Forgot your password?</h1>

                <p style="color: #333333; font-size: 14px; line-height: 1.6; margin-bottom: 30px; text-align: center;">
                    We received a request to reset your password. <br />
                    If you didn’t make this request, simply ignore this email. 
                </p>

                <div style="border-bottom: 3px solid #E5E7EB; margin: 20px 0;"></div>

                <p style="color: #64748B; font-size: 14px; line-height: 1.6; margin-bottom: 30px; text-align: center;">
                    If you did make this request, just click the button below:
                </p>

                <div style="margin: 40px 0; text-align: center;">
                    <a href="{resetURL}" style="background-color: #8257E6; color: white; padding: 12px 40px; text-decoration: none; border-radius: 4px; font-weight: bold;">Reset Password</a>
                </div>

                <p style="color: #333333; font-size: 14px; margin-bottom: 5px;">Best regards,</p>
                <p style="color: #333333; font-size: 14px; font-weight: bold;">The Codify Team</p>

            </td>
        </tr>

    </table>
</body>
</html>

`;
export const WELCOME_EMAIL_STUDENT_TEMPLATE = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Codify</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #ffffff;">
    <table cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #FBF3FF; border-radius: 24px;">
        

        <tr>
            <td style="padding: 40px;">
                
                <img src="https://i.imgur.com/TfDZDNE.png" alt="Codify" style="width: 100px; height: auto; text-align: center ">

                <div style="text-align: center;">
                    <img src="https://i.imgur.com/jPYv7jE.png" alt="Astronaut" style="width: 250px; height: auto;">
                </div>

                <h1 style="color: #8257E6; font-size: 28px; margin-bottom: 10px; text-align: center;">Account Details</h1>

                <p style="color: #333333; font-size: 14px; line-height: 1.6; margin-bottom: 30px;">
                  Hi {firstName} {lastName}, 
 <br><br>
 You have been registered under <strong>{institutionName}</strong>. Welcome to Codify! We are thrilled to have you join our journey towards simplifying and revolutionizing software development. Get ready for an innovative experience!
  <p style="color: #333333; font-size: 14px; margin-bottom: 20px;">Below are your account details to get started:</p>

                    <div style="border-bottom: 1px solid #E5E7EB; margin: 20px 0;"></div>

                    <p style="color: #666666; margin: 10px 0;"><Strong> Email:</strong> {email}</p>
                    <p style="color: #666666; margin: 10px 0;"><strong> Password:</strong> {password} </p>

                    <div style="border-bottom: 1px solid #E5E7EB; margin: 20px 0;"></div>

                    <div style="text-align: center; margin: 30px 0;">
                        <a href="#" style="background-color: #8257E6; color: white; padding: 12px 40px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">Get Started</a>
                    </div>

                    <p style="color: #666666; font-size: 14px; margin-bottom: 20px;">
                        Please make sure to change your password after logging in for the first time to ensure your account's security.
                    </p>

                    <p style="color: #333333; font-size: 14px; margin-bottom: 10px;">We're excited to have you on board!</p>


              <p style="color: #333333; font-size: 14px; margin-bottom: 5px; padding-top:30px; ">Best regards,</p>
                <p style="color: #333333; font-size: 14px; font-weight: bold;">The Codify Team</p>

            </td>
        </tr>

    </table>
</body>
</html>`;