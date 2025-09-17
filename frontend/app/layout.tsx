import React from 'react';
import './globals.css';
import './quantum-animations.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>SomniaVault - Next-Gen DeFi Platform</title>
        <meta name="description" content="Experience the future of DeFi with quantum-secured vaults, hyper yields, and exclusive NFT rewards on the Somnia network." />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
