import React from 'react';
import Link from 'next/link';

const Footer: React.FC = () => {
  return (
    <footer className="border-t border-white/10 bg-gradient-to-b from-transparent to-black/20">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">S</span>
              </div>
              <h2 className="text-2xl font-bold gradient-text">SomniaVault</h2>
            </div>
            <p className="text-gray-300 text-lg leading-relaxed max-w-md">
              Next-generation DeFi platform offering quantum-secured vaults, hyper yields, and exclusive NFT rewards on the Somnia network.
            </p>
            <div className="mt-8 flex space-x-4">
              <div className="cyber-card px-4 py-2 text-sm">
                <span className="text-gray-400">TVL:</span>
                <span className="text-green-400 font-bold ml-2">$47.2M</span>
              </div>
              <div className="cyber-card px-4 py-2 text-sm">
                <span className="text-gray-400">Users:</span>
                <span className="text-blue-400 font-bold ml-2">15,847</span>
              </div>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-lg font-bold text-white mb-6 uppercase tracking-wider">
              Platform
            </h3>
            <ul className="space-y-4">
              <li>
                <Link href="/dashboard" className="text-gray-300 hover:text-white text-lg transition-colors hover:translate-x-1 transform duration-200 block">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/vaults" className="text-gray-300 hover:text-white text-lg transition-colors hover:translate-x-1 transform duration-200 block">
                  Vaults
                </Link>
              </li>
              <li>
                <Link href="/nfts" className="text-gray-300 hover:text-white text-lg transition-colors hover:translate-x-1 transform duration-200 block">
                  NFT Rewards
                </Link>
              </li>
              <li>
                <Link href="/analytics" className="text-gray-300 hover:text-white text-lg transition-colors hover:translate-x-1 transform duration-200 block">
                  Analytics
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-bold text-white mb-6 uppercase tracking-wider">
              Resources
            </h3>
            <ul className="space-y-4">
              <li>
                <a href="#" className="text-gray-300 hover:text-white text-lg transition-colors hover:translate-x-1 transform duration-200 block">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white text-lg transition-colors hover:translate-x-1 transform duration-200 block">
                  Whitepaper
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white text-lg transition-colors hover:translate-x-1 transform duration-200 block">
                  Security Audit
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white text-lg transition-colors hover:translate-x-1 transform duration-200 block">
                  Bug Bounty
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
              <p className="text-gray-400 text-lg">
                &copy; 2024 SomniaVault. Built on Somnia Network.
              </p>
              <div className="flex items-center space-x-2 text-sm">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-400">Network Online</span>
              </div>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-white transition-colors group">
                <span className="sr-only">Twitter</span>
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </div>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors group">
                <span className="sr-only">Discord</span>
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418Z"/>
                  </svg>
                </div>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors group">
                <span className="sr-only">GitHub</span>
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gray-500/20 to-gray-600/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;