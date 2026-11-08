import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { AppProvider } from '@/lib/store';

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jakarta',
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
    <html lang="en" className={plusJakarta.variable}>
      <body className={`min-h-screen bg-[#f4f6f9] text-[#0f172a] antialiased ${plusJakarta.className}`}>
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
