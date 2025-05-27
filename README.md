# SSE-Project
A BigCommerce workflow automation platform

## Overview
BCAutomatic is a powerful automation platform that connects your BigCommerce store with custom workflows. Create automated rules that trigger actions based on store events, such as new orders or customer registrations. Perfect for store owners who want to automate routine tasks without complex coding.

<details>
<summary><b>📋 How to Install</b></summary>

## Prerequisites
- Node.js (v20.18.1 or later)
- npm or yarn
- A BigCommerce store with API credentials
- ngrok (for webhook testing)

## Setup Steps

1. **Clone and Install Dependencies**
   ```bash
   git clone https://github.com/Pop-Morris/SSE-Project.git
   cd SSE-Project
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
   - This command updates the authtoken property in your ngrok configuration file - allowing you to start your local server
   - In a separate terminal, start your ngrok server. You can do this with a static server or a randomly generated one.
   - For a static server:
     ```bash
     ngrok http --url={your_unique_ngrok_url} 3000
     ```
     EXAMPLE:
     ```bash
     ngrok http --url=mallard-smashing-blatantly.ngrok-free.app 3000
     ```
   - Note that your unique ngrok URL is generated and displayed on the ngrok dashboard once logged in
   - For a random URL:
     ```bash
     npx ngrok http 3000
     ```

3. **Environment Setup**
   
   Create a `.env` file in the root directory with:
   ```
   DATABASE_URL="file:./dev.db"
   ```

   Create a `.env.local` file with your BigCommerce credentials:
   ```
   BigCommerce API Credentials,
   BIGCOMMERCE_STORE_HASH=your_store_hash
   BIGCOMMERCE_ACCESS_TOKEN=your_access_token
   BIGCOMMERCE_CLIENT_ID=keep_blank
   BIGCOMMERCE_CLIENT_SECRET=keep_blank
 

   Webhook Configuration,
   NEXT_PUBLIC_WEBHOOK_URL=http://localhost:3000/

   NGROK Tunnel URL,
   NEXT_PUBLIC_WEBHOOK_URL={your_ngrok_tunnel_url}

   EXAMPLE_DO_NOT_COPY:
   NEXT_PUBLIC_WEBHOOK_URL=https://mallard-smashing-blatantly.ngrok-free.app
   ```

5. **Database Setup**
   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```

    These commands set up your local SQLite database:
   - `prisma generate` creates the Prisma Client based on your schema
   - `prisma migrate dev` creates and applies the initial database migration, creating the necessary tables for workflows and activity logs

6. **Start Development Server**
   ```bash
   npm run dev
   ```

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
To verify your setup is working correctly:
1. Ensure the development server is running (`npm run dev`)
2. Check that ngrok is running and providing a valid HTTPS URL
3. Verify your BigCommerce credentials are correctly set in `.env.local`
4. Confirm the database migrations have been applied successfully
5. Navigate to http://localhost:3000/api/test-webhook
  - This webpage should return raw JSON that automatically creates a webhook for testing purposes
</details>

<details>
<summary><b>🚀 How to Use</b></summary>

### Creating a Workflow
1. Navigate to https://localhost:3000
2. Navigate to the "Create Workflow" page
3. Fill in the workflow details:
   - Workflow Name: A descriptive name for your workflow
   - Workflow Category: Choose between "New Order" or "Customer Created"
   - Condition Type: Select the condition 
   - Threshold: Set the value to compare against
   - Action Value: Specify the note or tag value

### Managing Workflows
1. Navigate to the "View Workflows" page
   - View all existing workflows
   - Delete workflows using the delete button
  
### Activity Log
1. Navigate to the "Activity Log" page
   - All recent workflow executions can be viewed here
   - Data includes Time, Workflow Name, Status, Message
 

### Example Workflow
Create a workflow that adds a note to orders over $100:
1. Name: "High Value Order Note"
2. Trigger Event: "New Order"
3. Condition Type: "Greater Than"
4. Threshold: 100
5. Action Type: "Add Note"
6. Action Value: "High value order - requires special attention"
</details>

<details>
<summary><b>🔧 Configuration</b></summary>

### Environment Variables
| Variable | Description |
|----------|-------------|
| `BIGCOMMERCE_STORE_HASH` | Your BigCommerce store hash |
| `BIGCOMMERCE_ACCESS_TOKEN` | Your BigCommerce access token |
| `BIGCOMMERCE_CLIENT_ID` | Keep blank |
| `BIGCOMMERCE_CLIENT_SECRET` | Keep blank |
| `NEXT_PUBLIC_WEBHOOK_URL` | Your ngrok HTTPS URL for webhook testing |

### Webhook Configuration
The application automatically configures webhooks in your BigCommerce store for the following events:
- New Order
- Customer Created

### Database
The application uses Prisma with a SQLite database. The schema includes:
- Workflows
- Activity Logs
- Webhook Configurations
</details>

## Project Structure
```
bigcommerce-automation/
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── api/               # API routes
│   │   │   ├── workflows/     # Workflow management endpoints
│   │   │   └── webhooks/      # Webhook handling endpoints
│   │   ├── create/            # Workflow creation page
│   │   ├── view/              # Workflow management page
│   │   ├── monitor/           # Activity monitoring page
│   │   ├── workflows/         # Workflow-related pages
│   │   ├── layout.tsx         # Root layout component
│   │   ├── page.tsx           # Home page
│   │   └── globals.css        # Global styles
│   ├── components/            # Reusable React components
│   ├── lib/                   # Utility functions and shared code
│   │   ├── prisma/            # Database client
│   │   └── workflow/          # Workflow-related utilities
│   └── services/              # External service integrations
│       └── bigcommerce/       # BigCommerce API client
├── prisma/                    # Database schema and migrations
│   └── schema.prisma          # Prisma schema definition
├── public/                    # Static assets
├── .next/                     # Next.js build output
├── node_modules/              # Project dependencies
├── .env                       # Environment variables (development)
├── .env.local                 # Local environment variables
├── next.config.ts             # Next.js configuration
├── postcss.config.js          # PostCSS configuration
├── tsconfig.json              # TypeScript configuration
├── eslint.config.mjs          # ESLint configuration
└── package.json               # Project dependencies and scripts
```


