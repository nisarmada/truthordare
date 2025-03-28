// netlify/functions/stripe.js
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  // 1. Parse incoming data (if needed)
  const { price, product } = JSON.parse(event.body || '{}');

  try {
    // 2. Create Stripe session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price: 'price_1R7fS2RtOxWs9089ytr5qhPy', // Your Stripe Price ID
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${event.headers.origin}/?payment_success=true`,
      cancel_url: `${event.headers.origin}/?payment_cancelled=true`,
      // Optional metadata
      metadata: {
        product_name: product || "Truth or Dare Game Access"
      }
    });

    // 3. Return success response
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*', // Enable CORS
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        id: session.id,
        url: session.url // Optional: Direct checkout URL
      })
    };

  } catch (e) {
    // 4. Error handling
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        error: e.message,
        stack: process.env.NODE_ENV === 'development' ? e.stack : undefined
      })
    };
  }
};