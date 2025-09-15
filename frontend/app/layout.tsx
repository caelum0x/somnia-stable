import React from 'react';
import '../styles/globals.css';
import Header from './components/Header';
import Footer from './components/Footer';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>Stablecoin DeFi App</title>
        <meta name="description" content="A decentralized finance application for stablecoins." />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="bg-gray-100">
        <Header />
        <main className="container mx-auto p-4">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
