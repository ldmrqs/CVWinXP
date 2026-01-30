// Simple Express server to handle guestbook submissions securely
import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://ldmrqs.com' 
    : '*',
  credentials: true
}));
app.use(express.json());
app.use(express.static('.')); // Serve static files from current directory

// Store last submission time per IP for rate limiting
const rateLimitMap = new Map();

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Guestbook endpoint
app.post('/api/guestbook', async (req, res) => {
  const { message } = req.body;
  const clientIP = req.ip;

  // Rate limiting (30 seconds)
  const now = Date.now();
  const lastSubmission = rateLimitMap.get(clientIP) || 0;
  if (now - lastSubmission < 30000) {
    const secondsLeft = Math.ceil((30000 - (now - lastSubmission)) / 1000);
    return res.status(429).json({ 
      error: `wait a few ${secondsLeft}s to send another one.` 
    });
  }

  // Input validation
  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: '❌ Write something before saving!' });
  }

  if (message.trim().length < 3) {
    return res.status(400).json({ error: '❌ Too short, try something else, fren.' });
  }

  if (message.length > 1000) {
    return res.status(400).json({ error: '❌ Message too long (max 1000 chars)' });
  }

  // Here you would integrate with EmailJS using their Node.js SDK
  // For now, this is a placeholder - install @emailjs/nodejs and configure
  try {
    // Import EmailJS (you'll need to install: npm install @emailjs/nodejs)
    const emailjs = await import('@emailjs/nodejs').catch(() => null);
    
    if (emailjs) {
      await emailjs.default.send(
        process.env.EMAILJS_SERVICE_ID || 'service_2di7gtn',
        process.env.EMAILJS_TEMPLATE_ID || 'template_svtugz7',
        {
          to_email: process.env.TO_EMAIL || 'ldrmqs@gmail.com',
          from_name: 'Website Visitor',
          message: message,
          timestamp: new Date().toLocaleString('en-US')
        },
        {
          publicKey: process.env.EMAILJS_PUBLIC_KEY || 'vE_JDVEjg4H-6ZnIN',
          privateKey: process.env.EMAILJS_PRIVATE_KEY
        }
      );
    } else {
      // Fallback: just log it if EmailJS isn't installed
      console.log('Guestbook message received:', message);
    }

    // Update rate limit
    rateLimitMap.set(clientIP, now);

    res.json({ success: true });
  } catch (error) {
    console.error('Email send error:', error);
    res.status(500).json({ error: '❌ error! try again, bro' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📝 Guestbook API: http://localhost:${PORT}/api/guestbook`);
});
