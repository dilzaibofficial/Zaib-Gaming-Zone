# 🎮 Zaib Gaming Zone — Website

**Clifton's #1 PS5 & PS4 Gaming Destination | Samwood Mall, Karachi**

---

## 🚀 Quick Setup Guide

### 1. Install Dependencies
```bash
cd "Gaming Zone Website"
npm install
```

### 2. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** → Name it `zaib-gaming-zone`
3. Enable **Google Analytics** (optional)

#### Enable Firebase Services:
- **Authentication** → Sign-in method → Enable: **Email/Password** + **Google**
- **Firestore Database** → Create database (start in **Production mode**)
- **Storage** → Get started

#### Get your config:
- Project Settings → Your apps → **"Add app"** → Web app
- Copy the config object

### 3. Environment Variables

Copy `.env.local.example` to `.env.local`:
```bash
cp .env.local.example .env.local
```

Fill in your Firebase values:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_actual_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_ADMIN_EMAIL=dilzaib5848@gmail.com
```

### 4. Deploy Firestore Rules

In Firebase Console → Firestore → **Rules** tab, paste the contents of `firestore.rules`.

Or via CLI:
```bash
npm install -g firebase-tools
firebase login
firebase init firestore
firebase deploy --only firestore:rules
```

### 5. Initial Firestore Data Setup

In Firebase Console → Firestore → Create these collections:

#### `settings/shop` document:
```json
{
  "isOpen": false,
  "shopName": "Zaib Gaming Zone",
  "address": "1st Floor, Samwood Shopping Mall, Clifton Block 2, Karachi",
  "phone": "+92-XXX-XXXXXXX",
  "email": "info@zaibgamingzone.com",
  "whatsappNumber": "923001234567",
  "whatsappMessage": "Hi! I want to book a gaming session at Zaib Gaming Zone.",
  "facebook": "https://facebook.com/zaibgamingzone",
  "instagram": "https://instagram.com/zaibgamingzone",
  "tiktok": "https://tiktok.com/@zaibgamingzone",
  "youtube": "https://youtube.com/@zaibgamingzone",
  "openHours": "Mon–Sun: 12:00 PM – 12:00 AM"
}
```

#### `consoles` collection — add 3 documents:
Each with fields: `name`, `type` (PS5/PS4), `order` (1/2/3), `status` (available), `games` (array), `pricePerHour`, `pricePerHalfHour`, `timerActive` (false)

### 6. Add Your Admin Account

1. Go to the website and sign up with `dilzaib5848@gmail.com`
2. In Firestore → `users` → find your user document
3. Change `role` field to `"admin"`

OR — sign up first time and the website auto-detects the admin email from `.env.local`.

### 7. Run Locally
```bash
npm run dev
```
Visit: http://localhost:3000

### 8. Deploy to Production

**Vercel (Recommended):**
```bash
npm install -g vercel
vercel
```
Then add all environment variables in Vercel dashboard.

---

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx              # Homepage
│   ├── about/                # About page with gallery
│   ├── events/               # Tournaments page
│   ├── contact/              # Contact form
│   ├── profile/              # User profile & history
│   ├── auth/login/           # Login page
│   ├── auth/signup/          # Signup page
│   └── admin/
│       ├── page.tsx          # Dashboard
│       ├── timers/           # Session timers
│       ├── bookings/         # Booking management
│       ├── consoles/         # Console & game management
│       ├── events/           # Tournament management
│       ├── users/            # User management
│       ├── gallery/          # Photo upload
│       ├── messages/         # Contact messages
│       └── settings/         # All site settings
├── components/
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── WhatsAppFloat.tsx
│   ├── ConsoleCard.tsx
│   ├── BookingModal.tsx
│   └── home/                 # Homepage sections
├── contexts/
│   ├── AuthContext.tsx
│   └── ShopContext.tsx
├── lib/
│   ├── firebase.ts
│   ├── auth.ts
│   └── firestore.ts
└── types/index.ts
```

---

## 🎮 Admin Panel Features

| Feature | Description |
|---------|-------------|
| **Shop Open/Close** | Single toggle to enable/disable all bookings |
| **Session Timers** | Start/stop timers for each console in real-time |
| **Anonymous Booking** | Walk-in guest sessions — auto-creates guest accounts |
| **Booking Approval** | Approve/reject online booking requests |
| **Console Management** | Add/edit/delete consoles, add/remove games |
| **Event Management** | Create tournaments with rules, prizes, entry fees |
| **User Management** | Search users by email/phone/reg no, view guest credentials |
| **Gallery** | Upload HD shop photos (shown on About page) |
| **Settings** | WhatsApp, social links, shop address, map embed |

---

## 🔍 SEO Keywords Targeted

- clifton gaming zone
- gaming zone karachi
- ps5 gaming karachi
- ps4 gaming karachi
- samwood mall gaming
- gaming zone clifton block 2
- zaib gaming zone
- online gaming karachi
- book gaming slot karachi
- gaming tournament karachi

---

## 📞 Support

Admin Email: dilzaib5848@gmail.com
Location: 1st Floor, Samwood Shopping Mall, Clifton Block 2, Karachi
