# SSE-Project
A zapier-styled automation tool

# Local Development Setup

## Prerequisites
- Node.js (latest LTS version)
- npm or yarn
- A BigCommerce store with API credentials
- ngrok (for webhook testing)

## Setup Steps

1. **Clone and Install Dependencies**
   ```bash
   git clone https://github.com/Pop-Morris/SSE-Project.git
   cd bigcommerce-automation
   npm install
   ```

2. **Install ngrok**
   ```bash
   npm install -g ngrok
   ```
   - Sign up for a free ngrok account at https://ngrok.com
   - Get your authtoken from the ngrok dashboard
   - Configure ngrok with your authtoken:
     ```bash
     ngrok config add-authtoken your_auth_token
     ```

3. **Environment Setup**
   Create a `.env` file in the root directory with:
   ```
   DATABASE_URL="file:./dev.db"
   ```

   Create a `.env.local` file with your BigCommerce credentials:
   ```
   BigCommerce API Credentials
   BIGCOMMERCE_STORE_HASH=your_store_hash
   BIGCOMMERCE_ACCESS_TOKEN=your_access_token
   BIGCOMMERCE_CLIENT_ID=keep_blank
   BIGCOMMERCE_CLIENT_SECRET=keep_blank
 

   Webhook Configuration,
   NEXT_PUBLIC_WEBHOOK_URL=http://localhost:3000/

   NGROK Tunnel URL,
   NEXT_PUBLIC_WEBHOOK_URL={your_ngrok_tunnel_url_(https)}
   ```

4. **Database Setup**
   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

6. **Set Up Webhook Testing**
   In a separate terminal:
   ```bash
   npx ngrok http 3000
   ```
   - Copy the HTTPS URL provided by ngrok
   - Update `NEXT_PUBLIC_WEBHOOK_URL` in `.env.local` with this URL

## Why ngrok?
ngrok is required because:
- BigCommerce needs to send webhooks to a public URL
- Your local development server (localhost) isn't accessible from the internet
- ngrok creates a secure tunnel to your localhost, making it accessible to BigCommerce
- This allows you to receive and test webhooks during local development

## Alternative to ngrok
If you can't use ngrok, you have a few options:
1. Deploy to a staging environment for testing
2. Use a different tunneling service (like localtunnel)


## Verifying Setup
4. **Start Development Server**
   ```bash
   npm run dev
   ```
