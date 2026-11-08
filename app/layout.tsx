import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AppProvider } from '@/lib/store';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  weight: ['400', '500', '600', '700', '800'],
});

export const metadata: Metadata = {
  title: 'Hanzei | Software House Management ERP',
  description: 'Enterprise ERP for software houses: Attendance, Hazari, Projects, Financials, Tasks, Payroll & Client Portal.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-[#edf2f7] text-[#1e293b] antialiased font-sans">
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
