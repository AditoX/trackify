import './globals.css'

export const metadata = {
  title: 'Trackify — Build Yourself',
  description: 'Free self-improvement app for India. Track habits, workouts & daily challenges. Made by a teen dev with AI.',
  keywords: 'habit tracker, self improvement, fitness tracker, India, free app, trackify',
  openGraph: {
    title: 'Trackify — Build Yourself',
    description: 'Free self-improvement app. Track habits, workouts & daily challenges.',
    type: 'website',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
