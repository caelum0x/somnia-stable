'use client';

import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import StandardNavbar from '../../src/components/StandardNavbar';
import StandardFooter from '../../src/components/StandardFooter';

const AnalyticsPage: React.FC = () => {
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    if (typeof window !== 'undefined' && window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum as any);
        const accounts = await provider.listAccounts();
        if (accounts.length > 0) {
          setUserAddress(accounts[0].address);
        }
      } catch (error) {
        console.error('Error checking connection:', error);
      }
    }
  };

  const connectWallet = async () => {
    if (typeof window !== 'undefined' && window.ethereum) {
      setIsLoading(true);
      try {
        const provider = new ethers.BrowserProvider(window.ethereum as any);
        await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        setUserAddress(address);
      } catch (error) {
        console.error('Error connecting wallet:', error);
      } finally {
        setIsLoading(false);
      }
    } else {
      alert('Please install MetaMask!');
    }
  };

  const protocolMetrics = [
    {
      title: "Total Value Locked",
      value: "$47.2M",
      change: "+12.3%",
      icon: "💰",
      color: "blue"
    },
    {
      title: "Active Users",
      value: "15,847",
      change: "+8.7%",
      icon: "👥",
      color: "green"
    },
    {
      title: "Average APY",
      value: "12.4%",
      change: "+0.8%",
      icon: "📈",
      color: "purple"
    },
    {
      title: "Elite NFTs",
      value: "3,291",
      change: "+15.2%",
      icon: "💎",
      color: "pink"
    }
  ];

  const vaultPerformance = [
    {
      name: "Quantum Vault Alpha",
      apy: "15.2%",
      tvl: "$2.4M",
      volume24h: "$156K",
      users: 834
    },
    {
      name: "Stellar Vault Beta",
      apy: "12.8%",
      tvl: "$1.8M",
      volume24h: "$89K",
      users: 612
    },
    {
      name: "Nebula Vault Gamma",
      apy: "18.5%",
      tvl: "$956K",
      volume24h: "$234K",
      users: 298
    }
  ];

  return (
    <div className="min-h-screen">
      <StandardNavbar 
        userAddress={userAddress}
        onConnect={connectWallet}
        isLoading={isLoading}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            <span className="gradient-text">Analytics Hub</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl">
            Real-time metrics, performance insights, and AI-powered analytics for the SomniaVault protocol
          </p>
        </div>

        {/* Protocol Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {protocolMetrics.map((metric, index) => (
            <div key={index} className={`stats-card ${metric.color} group hover:scale-105 transition-transform duration-300`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-300 uppercase tracking-wide">{metric.title}</h3>
                <div className={`w-8 h-8 bg-gradient-to-br from-${metric.color}-500/20 to-${metric.color}-600/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <span>{metric.icon}</span>
                </div>
              </div>
              <div className="stats-value text-3xl font-bold mb-2">{metric.value}</div>
              <div className="text-sm text-green-400 flex items-center">
                <span className="mr-1">↗</span>
                {metric.change} from last month
              </div>
            </div>
          ))}
        </div>

        {/* Vault Performance Table */}
        <div className="cyber-card p-8 mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Vault Performance</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-4 px-2 text-gray-300 font-medium">Vault</th>
                  <th className="text-left py-4 px-2 text-gray-300 font-medium">APY</th>
                  <th className="text-left py-4 px-2 text-gray-300 font-medium">TVL</th>
                  <th className="text-left py-4 px-2 text-gray-300 font-medium">24h Volume</th>
                  <th className="text-left py-4 px-2 text-gray-300 font-medium">Users</th>
                </tr>
              </thead>
              <tbody>
                {vaultPerformance.map((vault, index) => (
                  <tr key={index} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-4 px-2">
                      <div className="text-white font-medium">{vault.name}</div>
                    </td>
                    <td className="py-4 px-2">
                      <div className="text-green-400 font-semibold">{vault.apy}</div>
                    </td>
                    <td className="py-4 px-2">
                      <div className="text-blue-400 font-semibold">{vault.tvl}</div>
                    </td>
                    <td className="py-4 px-2">
                      <div className="text-gray-300">{vault.volume24h}</div>
                    </td>
                    <td className="py-4 px-2">
                      <div className="text-gray-300">{vault.users.toLocaleString()}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          <div className="cyber-card p-8">
            <h3 className="text-xl font-bold text-white mb-6">TVL Growth</h3>
            <div className="h-64 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl mb-4">📊</div>
                <div className="text-gray-300">Interactive chart coming soon</div>
                <div className="text-sm text-gray-400 mt-2">Real-time TVL tracking</div>
              </div>
            </div>
          </div>

          <div className="cyber-card p-8">
            <h3 className="text-xl font-bold text-white mb-6">Yield Distribution</h3>
            <div className="h-64 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl mb-4">🎯</div>
                <div className="text-gray-300">Yield analytics dashboard</div>
                <div className="text-sm text-gray-400 mt-2">Performance breakdown</div>
              </div>
            </div>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="cyber-card p-8">
          <h2 className="text-2xl font-bold text-white mb-6">Recent Protocol Activity</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                  <span className="text-green-400">💰</span>
                </div>
                <div>
                  <div className="text-white font-medium">Large Deposit</div>
                  <div className="text-gray-400 text-sm">Quantum Vault Alpha</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-white font-medium">+50 ETH</div>
                <div className="text-gray-400 text-sm">5 minutes ago</div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center">
                  <span className="text-purple-400">💎</span>
                </div>
                <div>
                  <div className="text-white font-medium">NFT Minted</div>
                  <div className="text-gray-400 text-sm">Elite Booster Genesis</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-white font-medium">#248</div>
                <div className="text-gray-400 text-sm">12 minutes ago</div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                  <span className="text-blue-400">⚡</span>
                </div>
                <div>
                  <div className="text-white font-medium">Yield Distribution</div>
                  <div className="text-gray-400 text-sm">Automated compound</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-white font-medium">+2.4 ETH</div>
                <div className="text-gray-400 text-sm">18 minutes ago</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <StandardFooter />
    </div>
  );
};

export default AnalyticsPage;