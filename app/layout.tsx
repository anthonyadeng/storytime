import type { Metadata } from 'next';
import { Inter, Roboto, Crimson_Text } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from './components/ThemeContext';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});
const crimsonText = Crimson_Text({
  weight: ['400', '600'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-crimson-text',
});
const roboto = Roboto({
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto',
});
export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body
        className={`${inter.variable} ${roboto.variable} ${crimsonText.variable} overflow-x-hidden no-scrollbar`}
      >
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
