#!/bin/bash

# Generate a secure random secret for Better Auth
# Usage: ./generate-auth-secret.sh

# Generate 32-byte random string and encode as hex
SECRET=$(openssl rand -hex 32)

echo "Generated BETTER_AUTH_SECRET:"
echo ""
echo "BETTER_AUTH_SECRET=\"$SECRET\""
echo ""
echo "Add this to your Vercel environment variables:"
echo "1. Go to your Vercel project settings"
echo "2. Navigate to Environment Variables"
echo "3. Add a new variable named BETTER_AUTH_SECRET"
echo "4. Paste the secret above as the value"
echo "5. Redeploy your application"
