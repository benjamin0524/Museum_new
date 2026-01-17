---
description: How to deploy the Lilly Museum project to Cloudflare Pages
---

# Deploying to Cloudflare Pages

This guide will help you deploy your "Involuntary Exhibition" to Cloudflare Pages.

## Prerequisites

1.  **Cloudflare Account**: You need a Cloudflare account.
2.  **Node.js**: Already installed.

## Steps

### 1. Build the Project

First, we need to create the production build of your exhibition. This optimizes the 3D assets and code for the web.

```bash
npm run build
```
// turbo
After this command finishes, you will see a `dist` folder created in your project directory.

### 2. Login to Cloudflare (One-time)

If you haven't used Wrangler (Cloudflare's CLI tool) before, you need to login.

```bash
npx wrangler login
```
*   This will open a browser window asking you to authorize Wrangler.
*   Click "Allow".

### 3. Deploy to Cloudflare Pages

Now, deploy the `dist` folder to Cloudflare Pages.

```bash
npx wrangler pages deploy dist --project-name lilly-museum
```

*   **Project Name**: You can change `lilly-museum` to any name you like (e.g., `involuntary-exhibition`).
*   **Create Project**: If it asks to create a new project, select **Yes**.
*   **Production Branch**: Default is usually fine.

### 4. Visit Your Museum!

Once the upload is complete, Wrangler will give you a unique URL (e.g., `https://lilly-museum.pages.dev`). Click it to see your exhibition live on the internet!

---
> [!TIP]
> **Mobile Optimization**: This deployment automatically includes all the mobile optimizations we implemented (touch controls, responsive layout). It will work great on your phone!

## Troubleshooting: Deploying from a Cloud IDE or VM

If `npx wrangler login` hangs or fails because it cannot open a browser (common on cloud servers):

1.  **Generate an API Token**:
    *   Go to [Cloudflare API Tokens](https://dash.cloudflare.com/profile/api-tokens).
    *   Click **Create Token**.
    *   Scroll down and click **Create Custom Token** (or use the *Edit Cloudflare Workers* template).
    *   Under **Permissions**, select:
        *   **Account** -> **Cloudflare Pages** -> **Edit**
    *   Continue to Summary -> **Create Token**.
    *   **Copy** your new token immediately.

2.  **Deploy using the Token**:
    Run the deployment command with the token prefixed:

    ```bash
    CLOUDFLARE_API_TOKEN=your_token_here npx wrangler pages deploy dist --project-name lilly-museum
    ```
    *(Replace `your_token_here` with the actual token code)*
