function VerificationEmail(username, otp) {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <title>Email Verification</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 0;
          background-color: #f4f4f4;
          color: #333;
        }
        .container {
          max-width: 600px;
          margin: 20px auto;
          background: #fff;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .otp {
          font-size: 24px;
          font-weight: bold;
          color: #1a73e8;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h2>Hello, ${username}!</h2>
        <p>Thank you for signing up. Please use the OTP below to verify your email:</p>
        <p class="otp">${otp}</p>
        <p>If you didn't request this, you can ignore this email.</p>
        <p>— Your Team</p>
      </div>
    </body>
    </html>
    `;
  }
  
  module.exports = VerificationEmail;
  