require('dotenv').config(); // Loads .env file
const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// 1. Initialize Express app
const app = express();
app.use(express.json());
app.use(express.static('public')); // Serves your HTML/CSS/JS

// 2. Stripe Checkout Endpoint
app.post('/create-checkout-session', async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'], // Accept credit cards
      line_items: [{
        price: 'price_1R7fS2RtOxWs9089ytr5qhPy',
		quantity: 1,
      }],
      mode: 'payment', // One-time payment
      success_url: `${req.headers.origin}/?payment_success=true`, // Redirect after success
      cancel_url: `${req.headers.origin}/?payment_cancelled=true`, // Redirect if cancelled
    });

    res.json({ id: session.id }); // Send session ID to frontend
  } catch (e) {
	console.error('Stripe Error:', e);
    res.status(500).json({ error: e.message }); // Handle errors
  }
});

// 3. Start Server
app.listen(3000, () => console.log('Server running on http://localhost:3000'));