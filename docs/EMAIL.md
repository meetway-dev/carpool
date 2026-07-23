Email configuration

Development
- The app logs password reset links to the server console when no SMTP provider is configured.
- To generate seed data without a running DB, run the seed script in dry-run mode:

```bash
DRY_RUN=true npm run seed
```

Production
- Configure an SMTP provider (SendGrid, Mailgun, SES, or SMTP relay).
- Recommended env vars:
  - `SMTP_HOST`
  - `SMTP_PORT`
  - `SMTP_USER`
  - `SMTP_PASS`
  - `EMAIL_FROM` (friendly from address)

Implementation notes
- The current reset flow will log reset links when no mailer is set. Integrate a mailer in `app/api/auth/forgot/route.ts` to send `resetUrl` instead of logging.
- Ensure credentials are stored securely (secret manager or environment variables) and the SMTP connection uses TLS.
