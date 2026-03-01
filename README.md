# TaskFlow - Real-Time Collaborative Task Manager

A premium, real-time collaborative task management web application built with Next.js, Firebase, and Tailwind CSS.

##  Features

*   **Google Authentication:** Secure, seamless login using Firebase Authentication.

*   **Real-time Synchronization:** Changes to tasks instantly appear for all users without refreshing the page, powered by Firebase Firestore listeners.

*   **Task Assignment:** Easily assign tasks to other registered users by their email address.

*   **Profile Management:** Users can upload and update their profile pictures using Firebase Storage.

*   **Premium UI/UX:** 
    *   Sleek, modern design with a subtle animated "glassmorphism" background.
    *   Dynamic, time-based dashboard greetings.
    *   Smooth entry and hover animations powered by Framer Motion.
    *   Custom, minimal scrollbars and dark mode support.

*   **Responsive Design:** Fully usable on both desktop and mobile devices.

##  Tech Stack & Architecture

*   **Frontend Framework:** Next.js 16 (App Router)
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS, Lucide React (Icons)
*   **Animations:** Framer Motion
*   **Backend & Real-time Database:** Firebase (Firestore)
*   **Authentication:** Firebase Auth (Google Provider)
*   **File Storage:** Firebase Storage (for profile avatars)
*   **State Management:** React Context API (`AuthContext`), Custom Hooks (`useTasks`)

### Architectural Decisions

*   **Firebase as Backend-as-a-Service (BaaS):** Chosen over a custom Node.js server to rapidly implement secure authentication, file storage, and crucially, real-time data synchronization using Firestore's `onSnapshot` listeners.

*   **Context API for Global State:** The `AuthContext` provides user data globally, preventing prop-drilling. Task state is managed closely to where it's needed using the `useTasks` hook for better performance and encapsulation.

*   **Client-Side Rendering (CSR):** Since this is an interactive web app behind an authentication wall, most functionality relies on `use client` directives to handle real-time database connections and Framer Motion animations.

##  Local Development Setup

Follow these steps to run the application locally.

### Prerequisites
*   Node.js (v18 or higher)
*   npm or yarn
*   A Firebase Project (with Auth, Firestore, and Storage enabled)

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
cd task-manager
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Create a `.env.local` file in the root of the project and add your Firebase configuration:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 4. Firebase Configuration
*   **Firestore Rules:** Ensure your Firestore rules allow read/write access for authenticated users.
*   **Storage Rules:** Ensure your Storage rules allow authenticated users to upload their own avatars.

### 5. Run the development server
```bash
npm run dev
```
Open (http://localhost:3000) in your browser.

## 🚀 Deployment

The easiest way to deploy this Next.js app is using [Vercel].

1.  Push your code to a GitHub repository.
2.  Log in to Vercel and click **Add New Project**.
3.  Import the repository containing this code.
4.  In the Vercel deployment settings, expand the **Environment Variables** section.
5.  Add all the `NEXT_PUBLIC_FIREBASE_*` variables from your `.env.local` file.
6.  Click **Deploy**.

Vercel will automatically build the application and provide you with a live URL.
