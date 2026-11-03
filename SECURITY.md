# Security Notice

⚠️ **IMPORTANT**: The MongoDB URI was exposed in this repository and has been moved to environment variables.

## What was fixed:

1. MongoDB URI moved from hardcoded values to `.env` file
2. All documentation updated to reference `.env.example`
3. Sensitive credentials no longer in version control

## Next steps (URGENT):

1. **Change your MongoDB password immediately** - The exposed credentials should be rotated
2. **Update your `.env` file** with the new credentials
3. **Never commit `.env` files** - They are already in `.gitignore`

## For new setup:

1. Copy `.env.example` to `.env`
2. Fill in your actual MongoDB credentials
3. The application will now use environment variables

## MongoDB Atlas Security:

- Go to your MongoDB Atlas dashboard
- Navigate to Database Access
- Change the password for user "sathish"
- Update your `.env` file with the new password
