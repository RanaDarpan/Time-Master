import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Time Master - Stopwatch & Clock',
  description: 'A modern stopwatch and clock application with themes and animations',
  icons: {
    icon: { url: "favicon.jpg", type: "image/jpg" }, 
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}