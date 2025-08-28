# Google OAuth Setup Guide for KoriTour

This guide will help you set up Google OAuth authentication for the KoriTour website.

## Prerequisites

- Google account
- Access to Google Cloud Console
- Domain name for your website

## Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" at the top of the page
3. Click "New Project"
4. Enter a project name (e.g., "KoriTour Website")
5. Click "Create"

## Step 2: Enable Google+ API

1. In your new project, go to "APIs & Services" > "Library"
2. Search for "Google+ API" or "Google Identity"
3. Click on "Google+ API" and click "Enable"

## Step 3: Create OAuth 2.0 Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth 2.0 Client IDs"
3. If prompted, configure the OAuth consent screen first:
   - Choose "External" user type
   - Fill in the required information:
     - App name: "KoriTour"
     - User support email: Your email
     - Developer contact information: Your email
   - Add scopes: `email`, `profile`, `openid`
   - Add test users if needed
4. Click "Create OAuth 2.0 Client ID"
5. Choose "Web application" as the application type
6. Add authorized JavaScript origins:
   - `http://localhost:8000` (for local development)
   - `https://yourdomain.com` (for production)
7. Add authorized redirect URIs:
   - `http://localhost:8000/signup.html`
   - `http://localhost:8000/login.html`
   - `https://yourdomain.com/signup.html`
   - `https://yourdomain.com/login.html`
8. Click "Create"

## Step 4: Get Your Credentials

After creating the OAuth 2.0 client ID, you'll see:
- **Client ID**: A long string ending with `.apps.googleusercontent.com`
- **Client Secret**: A long string (keep this secure)

## Step 5: Update Your Code

1. Open `signup.js` and `login.js`
2. Replace `YOUR_GOOGLE_CLIENT_ID` with your actual Client ID:

```javascript
const GOOGLE_CLIENT_ID = '123456789-abcdefghijklmnop.apps.googleusercontent.com';
```

3. Remove or comment out the Client Secret line (not needed for client-side):

```javascript
// const GOOGLE_CLIENT_SECRET = 'YOUR_GOOGLE_CLIENT_SECRET'; // Not needed for client-side
```

## Step 6: Test Your Setup

1. Start your local server:
   ```bash
   python -m http.server 8000
   # or
   npx serve .
   ```

2. Open `http://localhost:8000/signup.html`
3. Click "Continue with Google"
4. You should see the Google sign-in popup
5. Sign in with a test account

## Troubleshooting

### Common Issues:

1. **"Error: redirect_uri_mismatch"**
   - Make sure your redirect URIs in Google Cloud Console match exactly
   - Include both HTTP and HTTPS versions if needed

2. **"Error: invalid_client"**
   - Verify your Client ID is correct
   - Make sure the Google+ API is enabled

3. **"Error: popup_closed_by_user"**
   - This is normal if user closes the popup
   - Check browser console for other errors

4. **"Google sign-in is not available"**
   - Check if the Google API script loaded correctly
   - Verify your Client ID is set correctly

### Browser Console Errors:

- Check for CORS errors
- Verify all scripts are loading
- Check for JavaScript syntax errors

## Security Considerations

1. **Never expose Client Secret in client-side code**
2. **Use HTTPS in production**
3. **Implement proper server-side validation**
4. **Consider implementing CSRF protection**
5. **Validate tokens on your server**

## Production Deployment

1. Update authorized origins in Google Cloud Console
2. Use HTTPS URLs only
3. Remove localhost URLs from authorized origins
4. Test thoroughly before going live

## Additional Features

Once basic OAuth is working, you can add:

- **Profile picture display**
- **User dashboard**
- **Logout functionality**
- **Session management**
- **Role-based access control**

## Support

If you encounter issues:

1. Check the [Google OAuth documentation](https://developers.google.com/identity/protocols/oauth2)
2. Verify your Google Cloud Console settings
3. Check browser console for error messages
4. Test with different browsers and devices

## Next Steps

After successful OAuth setup:

1. Implement server-side token validation
2. Add user profile management
3. Create user dashboard
4. Implement logout functionality
5. Add password reset functionality
6. Consider adding other OAuth providers (Facebook, Apple, etc.)

---

**Note**: This is a client-side implementation for demonstration purposes. In a production environment, you should implement proper server-side authentication and token validation.
