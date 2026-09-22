import { sendContactEmail } from '../utils/emailService.js';

// @desc    Submit Contact Us inquiry message
// @route   POST /api/contact
export const submitContactMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Please provide your name' });
    }

    if (!email || !email.trim()) {
      return res.status(400).json({ success: false, message: 'Please provide a valid email address' });
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      return res.status(400).json({ success: false, message: 'Please provide a valid email format' });
    }

    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, message: 'Please enter your message' });
    }

    // Trigger realtime dispatch to support.afterbuy@gmail.com and user acknowledgement
    const result = await sendContactEmail({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: (subject || '').trim(),
      message: message.trim(),
    });

    if (result.sent) {
      return res.status(200).json({
        success: true,
        message: 'Your message has been delivered to AfterBuy Support! Check your inbox for confirmation.',
      });
    } else {
      // Still return 200 with note if SMTP logged it
      return res.status(200).json({
        success: true,
        message: 'Thank you! Your message was received and logged for the support team.',
      });
    }
  } catch (error) {
    console.error('Contact submit error:', error);
    res.status(500).json({ success: false, message: 'Failed to deliver message. Please try again or email support.afterbuy@gmail.com directly.' });
  }
};
