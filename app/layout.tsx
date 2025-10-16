import { ReactNode } from 'react';
import { CssBaseline } from '@mui/material';

export const metadata = {
  title: 'Business Viability AI',
  description: 'AI-powered business location analysis',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <CssBaseline />
        {children}
      </body>
    </html>
  );
}