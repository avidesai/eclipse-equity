// index.ts

import app from './app';
import connectDB from './config/db';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// SendGrid Test
import sgMail from '@sendgrid/mail';
sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

(async () => {
  try {
    await sgMail.send({
      to: 'test@example.com',
      from: process.env.EMAIL_USER!,
      subject: 'Test Email',
      text: 'This is a test email.',
    });
    console.log('SendGrid test email sent successfully.');
  } catch (error) {
    if (error instanceof Error) {
      console.error('SendGrid API Key Error:', error.message);
    } else {
      console.error('An unknown error occurred:', error);
    }
  }
})();
