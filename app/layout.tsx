import type { Metadata } from 'next';
import './globals.css';
import { AppProvider } from '@/lib/store';

export const metadata: Metadata = {
  title: 'Hanzei | All-in-One Software House Management OS',
  description: 'Enterprise ERP for software houses: Attendance, Hazari, Projects, Financials, Tasks, Payroll & Client Portal.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#f6f8fc] text-slate-800 antialiased font-sans">
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}

