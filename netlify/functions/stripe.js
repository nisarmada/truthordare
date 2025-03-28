// netlify/functions/stripe.js
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  // Validate that it's a POST request
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  // Parse incoming data
  let parsedBody;
  try {
    parsedBody = JSON.parse(event.body || '{}');
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid JSON' })
    };
  }

  const { price, product } = parsedBody;

  // Validate price
  if (!price || isNaN(price)) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid price' })
    };
  }

  try {
    // Create Stripe session with dynamic price
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          unit_amount: price, // Use the passed price
          product_data: {
            name: product || "Truth or Dare Game Access"
          }
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${event.headers.origin}/?payment_success=true`,
      cancel_url: `${event.headers.origin}/?payment_cancelled=true`,
      metadata: {
        product_name: product || "Truth or Dare Game Access"
      }
    });

    // Return success response
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        id: session.id,
        url: session.url
      })
    };

  } catch (e) {
    console.error('Stripe session creation error:', e);
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