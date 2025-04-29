// app/layout.js
import './globals.css';

export const metadata = {
  title: 'Mert | Web Developer',
  description: 'Mert - Web Developer Portfolyo Sitesi',
  icons: null, // Explicitly disable default icons
}

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <body className="bg-bg-dark text-white">
        {children}
      </body>
    </html>
  )
}