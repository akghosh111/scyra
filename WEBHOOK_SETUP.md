# Webhook Setup Instructions for Local Development

Since you're in test mode and using localhost, you CAN set up webhooks! Here's how:

## Option 1: ngrok (Recommended - Free & Easy)

1. **Install ngrok:**
   - Download from: https://ngrok.com/download
   - Or install via npm: `npm install -g ngrok`

2. **Start ngrok for port 3000:**
   ```bash
   ngrok http 3000
   ```

3. **Copy the HTTPS URL:**
   - ngrok will show you a URL like: `https://abc123.ngrok.io`

4. **Configure Dodo Payments Webhook:**
   - Go to Dodo Payments dashboard
   - Navigate to Webhooks section
   - Add webhook URL: `https://your-ngrok-url.ngrok.io/api/webhooks/dodo`
   - Example: `https://abc123.ngrok.io/api/webhooks/dodo`

5. **Test it:**
   - Make a subscription signup
   - Dodo will send webhook to your ngrok URL
   - ngrok forwards it to your localhost:3000

## Option 2: LocalTunnel (Alternative)

1. **Install LocalTunnel:**
   ```bash
   npm install -g localtunnel
   ```

2. **Create tunnel:**
   ```bash
   lt --port 3000
   ```

3. **Use the provided URL in Dodo Payments:**
   - Add: `https://your-subdomain.loca.lt/api/webhooks/dodo`

## Option 3: Use Dodo Payments Test Mode Without Webhooks

If you prefer not to use tunnels:

1. **Test payments manually:**
   - Use Dodo Payments test mode
   - Make test payments
   - The checkout will complete
   - Webhook won't fire but payment will succeed

2. **Simulate subscription:**
   - After test checkout completes, manually update user profile in database
   - Or use the `?checkout=success` URL param to simulate success

3. **For production:**
   - When you deploy, update webhook URL to your production domain
   - Example: `https://yourdomain.com/api/webhooks/dodo`

## Webhook Events Handled

The webhook handler processes:

- `subscription.created` / `subscription.activated`: New Pro subscription
- `subscription.renewed`: Monthly renewal (resets credits to 100)
- `subscription.canceled`: Canceled subscription (downgrade to Free)

## Testing Checklist

- [ ] Start ngrok/LocalTunnel
- [ ] Copy HTTPS URL
- [ ] Add webhook in Dodo Payments dashboard
- [ ] Test Pro plan signup
- [ ] Check user profile updated to PRO with 100 credits
- [ ] Check webhook logs in server console

## Production Deployment

When deploying to production (Vercel, Netlify, etc.):

1. Update webhook URL in Dodo Payments dashboard
2. Use your production domain: `https://yourdomain.com/api/webhooks/dodo`
3. Verify webhook secret validation (add signature verification to webhook handler)
