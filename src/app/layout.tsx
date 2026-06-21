import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import ClientLayout from './ClientLayout';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'SmartChart Pro — EMR System for Assisted Living Facilities',
  description:
    'SmartChart Pro is a modern electronic medical records platform built for assisted living facilities, enabling care staff to document resident ADLs, vitals, and care activities quickly and accurately.',
  openGraph: {
    title: 'SmartChart Pro — EMR System for Assisted Living Facilities',
    description:
      'SmartChart Pro is a modern electronic medical records platform built for assisted living facilities, enabling care staff to document resident ADLs, vitals, and care activities quickly and accurately.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full antialiased`}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
