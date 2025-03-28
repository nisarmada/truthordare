// netlify/functions/stripe.js
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  console.log('Stripe function called');
  console.log('Event headers:', JSON.stringify(event.headers));
  console.log('Event body:', event.body);

  // Validate request method
  if (event.httpMethod !== 'POST') {
    console.error('Invalid HTTP method:', event.httpMethod);
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  // Parse body with extensive error handling
  let parsedBody;
  try {
    parsedBody = JSON.parse(event.body || '{}');
    console.log('Parsed body:', JSON.stringify(parsedBody));
  } catch (parseError) {
    console.error('JSON parsing error:', parseError);
    return {
      statusCode: 400,
      body: JSON.stringify({ 
        error: 'Invalid JSON',
        details: parseError.message 
      })
    };
  }

  const { price, product } = parsedBody;

  // Validate price
  if (!price || isNaN(price)) {
    console.error('Invalid price:', price);
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid price' })
    };
  }

  try {
    // Create Stripe session with comprehensive logging
    console.log('Creating Stripe session with:', { price, product });
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          unit_amount: price,
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

    console.log('Stripe session created successfully:', session.id);

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
    console.error('Stripe session creation FULL ERROR:', e);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        error: e.message,
        type: e.type,
        code: e.code,
        raw: JSON.stringify(e)
      })
    };
  }
};
```

3. Checklist of Potential Issues to Investigate
- ✅ Stripe API Keys
  - Verify test/live mode consistency
  - Check key permissions
  - Ensure keys match between frontend and backend

- ✅ Environment Variables
  - Confirm `STRIPE_SECRET_KEY` is set in Netlify
  - Check for any typos or formatting issues

- ✅ Project Structure
  - Verify files are in correct directories
  - Check Netlify function routing
  - Confirm `netlify.toml` configuration

- ✅ Dependency Installation
  - Ensure `stripe` package is installed
  - Check package versions

4. Verification Steps
- Open browser console
- Click "Buy Now"
- Capture and document ALL console logs and error messages
- Check Netlify function logs

5. Troubleshooting Sequence
1. Check browser console logs
2. Check Netlify function logs
3. Verify Stripe dashboard for any additional insights
4. Test with different browsers
5. Validate Stripe API keys
6. Ensure all dependencies are correctly installed

Action Items for You:
1. Implement the updated logging code I provided
2. Click "Buy Now"
3. Take a screenshot of:
   - Browser console
   - Netlify function logs
   - Any error messages

Additional Recommendations:
- Ensure you're using the CORRECT Stripe test keys
- Verify your Stripe account is fully set up
- Check that your Stripe account can create checkout sessions

Questions for you:
1. Have you successfully used Stripe checkout before in this project?
2. Are your Stripe API keys definitely correct?
3. Can you confirm the Stripe package is installed?

Let's systematically diagnose and resolve this payment integration issue!