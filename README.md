# Daily Report Form

This is a beautified HTML form that collects structured daily input from a user and sends the data formatted to Telegram through Zapier. It includes support for:

- Light/Dark theme toggle
- Background image and watermark icon
- Custom form fields like sleep/wake times, targets, extracurriculars, etc.
- Telegram message formatting
- PDF file attachment

## Features

- **Form Fields**: Collects daily input such as date, sleep time, wake-up time, targets, extracurricular activities, previous day's productivity, and more.
- **Light/Dark Mode Toggle**: Switch between light and dark themes for better readability.
- **Watermark Icon**: Custom logo as a watermark in the corner of the page.
- **Telegram Integration**: Automatically formats the data and sends it to a Telegram bot using Zapier.

## Setup

1. Clone this repository or download the project folder.
2. Add your custom background image (`bg.png`) and logo watermark (`logo.png`) to the `/public` folder.
3. Configure Zapier with a Webhook to send the data to Telegram:
   - In Zapier, create a new "Catch Hook" trigger and copy the URL provided.
   - Replace the placeholder URL in the `script.js` with your Zapier Webhook URL.
4. Push the project to GitHub.
5. Link your GitHub repository to Netlify for auto-deployment.

## How to Deploy to Netlify

1. Push your project to GitHub.
2. Go to [Netlify](https://www.netlify.com/).
3. Click "New site from Git".
4. Select your repository and follow the steps to deploy.
5. Your site will be live on a custom Netlify domain (you can also configure your own domain).

## Example Usage

Once deployed, the form will prompt the user to input
