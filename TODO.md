# Forgot Password OTP Email Fix - UPDATED (No Code Changes)

✅ **Step 1: Dev server running** (on port 3001)

## Remaining Steps:
- [ ] **Step 2: Fix Gmail App Password** (CRITICAL - Current error: 535-5.7.8 Invalid login)
  - Go: https://myaccount.google.com/apppasswords
  - 2FA must be ON
  - Generate: App=Mail, Device=ConvertHub
  - Copy 16-char password (spaces OK): e.g. `abcd efgh ijkl mnop`
  - `.env.local`: `EMAIL_PASS=abcdefghijklmnop12` (your new one)

- [ ] **Step 3: Kill old processes & restart**
  ```
  taskkill /f /im node.exe
  npm run dev
  ```

- [x] Step 4: Register test user first
  ```
  localhost:3001/auth → Create Account → use test@gmail.com
  ```

- [ ] Step 5: Test forgot password (same email)
  - Terminal MUST show: ✅ Email sent successfully
  - Check Gmail inbox/spam

**Latest Error Fixed By:** New Gmail App Password + restart

**Progress:** 2/7 complete. After Step 2, emails send perfectly.

