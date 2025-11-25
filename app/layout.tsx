import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import JsonLd from '@/components/JsonLd';
import { generateOrganizationSchema, defaultOrganization } from '@/lib/schema';
import { generateMetadata as generateMeta, defaultSEO } from '@/lib/metadata';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = generateMeta(defaultSEO);

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const organizationSchema = generateOrganizationSchema(defaultOrganization);

  return (
    <html lang="en">
      <head>
        <JsonLd data={organizationSchema} />
      </head>
      <body className={inter.className}>
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
