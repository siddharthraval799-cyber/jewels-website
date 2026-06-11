# Aurum Jewels - Web & Android Project

This project contains a premium jewellery e-commerce website and its corresponding Android application.

## Android Application

The Android app is located in the `/android` directory. It is a modern Jetpack Compose wrapper for the website, providing a "same to same" experience with full database connectivity via the web backend.

### Setup Instructions

1.  **Host the Website**: 
    - The Android app needs a live URL to connect to. Host your website (e.g., on Vercel, Netlify, or a VPS).
    - Update the URL in `android/app/src/main/java/com/aurum/jewels/MainActivity.kt`:
      ```kotlin
      WebViewScreen("https://your-hosted-site.com")
      ```

2.  **Open in Android Studio**:
    - Open the `android` folder as a project in Android Studio.
    - Wait for Gradle sync to complete.

3.  **Run the App**:
    - Connect an Android device or start an emulator.
    - Click **Run** in Android Studio.

### Features
- **Real Working Database**: Syncs perfectly with your web backend.
- **Native Experience**: Integrated WebView with JavaScript and DOM storage enabled.
- **Permissions**: Pre-configured for Internet access.

## Web Project

- **Frontend**: React + Tailwind CSS + Vite
- **Backend**: Express.js + SQLite (Better-SQLite3)
- **Features**: WhatsApp OTP Login, Admin Dashboard, Product Management, Cart, and more.

To run the web project locally:
```bash
npm install
npm run dev
```
