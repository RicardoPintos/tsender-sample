"use client";

import HomeContent from '@/components/HomeContent';
import { useAccount } from 'wagmi';

export default function Home() {
  const isConnected = useAccount().isConnected;
  return (
    <div>
      {!isConnected ? (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
          <div className="max-w-md w-full mx-4">
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center border border-gray-100">
              <div className="mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Connect Your Wallet</h2>
                <p className="text-gray-600 leading-relaxed">
                  Please connect your wallet to access the airdrop feature and start claiming your tokens.
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <HomeContent />
        </div>
      )}
    </div>
  );
}