import transporter from './config/nodemailer.js';
import dotenv from 'dotenv';

dotenv.config();

async function testEmail() {
  console.log('📧 Testing Email Configuration...\n');

  // Check if email credentials are set
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASSWORD;

  if (!emailUser || !emailPass) {
    console.log('❌ Email credentials not configured in .env file\n');
    console.log('Please add these to your backend/.env file:');
    console.log('EMAIL_HOST=smtp.gmail.com');
    console.log('EMAIL_PORT=587');
    console.log('EMAIL_SECURE=false');
    console.log('EMAIL_USER=your_email@gmail.com');
    console.log('EMAIL_PASSWORD=your_app_password');
    console.log('EMAIL_FROM=noreply@mypetcare.com\n');
    console.log('See EMAIL-CONFIGURATION-GUIDE.md for detailed instructions.');
    process.exit(1);
  }

  console.log('Configuration found:');
  console.log(`   Host: ${process.env.EMAIL_HOST || 'smtp.gmail.com'}`);
  console.log(`   Port: ${process.env.EMAIL_PORT || '587'}`);
  console.log(`   User: ${emailUser}`);
  console.log(`   From: ${process.env.EMAIL_FROM || emailUser}\n`);

  // Test connection
  console.log('Testing SMTP connection...');
  try {
    await transporter.verify();
    console.log('✅ SMTP connection successful!\n');
  } catch (error) {
    console.error('❌ SMTP connection failed:', error.message);
    console.log('\n💡 Troubleshooting:');
    console.log('   1. Check your EMAIL_USER and EMAIL_PASSWORD in .env');
    console.log('   2. For Gmail, make sure you\'re using an App Password');
    console.log('   3. Verify 2-Step Verification is enabled (Gmail)');
    console.log('   4. Check your internet connection');
    console.log('   5. Try port 465 with EMAIL_SECURE=true\n');
    process.exit(1);
  }

  // Test sending email
  const testEmail = process.env.TEST_EMAIL || emailUser;
  console.log(`Sending test email to: ${testEmail}...`);

  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || emailUser,
      to: testEmail,
      subject: 'Test Email - My Pet Care+',
      html: `
        <h2>Email Configuration Test</h2>
        <p>Congratulations! Your email service is configured correctly.</p>
        <p>This is a test email from My Pet Care+ application.</p>
        <p>If you received this, your email settings are working properly.</p>
        <hr>
        <p><small>Sent at: ${new Date().toLocaleString()}</small></p>
      `
    });

    console.log('✅ Test email sent successfully!');
    console.log(`   Message ID: ${info.messageId}`);
    console.log(`   Check your inbox (and spam folder) at: ${testEmail}\n`);
    console.log('🎉 Email service is fully configured and working!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to send test email:', error.message);
    console.log('\n💡 Common issues:');
    console.log('   - Wrong email or password');
    console.log('   - App password expired or invalid');
    console.log('   - SMTP server blocking the connection');
    console.log('   - Check spam folder if email was sent but not received\n');
    process.exit(1);
  }
}

testEmail();

