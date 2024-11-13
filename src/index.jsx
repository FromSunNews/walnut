if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
  document.documentElement.classList.add('dark')
} else {
  document.documentElement.classList.remove('dark')
}

import React, { Suspense } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";

import App from "./App";
import store from "./reducers";
import { Toaster } from "./components/shared/toaster";

// Sui Wallet
import {
  SuiClientProvider,
  WalletProvider,
} from "@mysten/dapp-kit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { getNetworkConfig } from "./components/apps/suidnet/utils/suiClient";

const { networkConfig } = getNetworkConfig();
const queryClient = new QueryClient();

const root = createRoot(document.getElementById("root"));

root.render(
  <Suspense
    fallback={
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-black">
        {/* Logo Animation */}
        <div className="relative w-24 h-24 mb-8">
          <div className="absolute inset-0">
            <img
              src="img/asset/sui.png"
              className="w-full h-full object-contain animate-pulse"
              alt="Sui Logo"
              style={{ filter: 'brightness(0) invert(1)' }}
            />
          </div>
          {/* Spinning Ring */}
          <div className="absolute inset-0 animate-spin">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="url(#gradient)"
                strokeWidth="2.5"
                strokeDasharray="70 180"
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#60A5FA" />
                  <stop offset="100%" stopColor="#3B82F6" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        {/* Loading Text */}
        <div className="flex flex-row items-center space-x-3">
          <h1 className="text-2xl font-bold text-white animate-pulse">
            Loading
          </h1>
          <div className="flex space-x-1 pt-1">
            {[0, 1, 2].map((index) => (
              <div
                key={index}
                className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                style={{
                  animationDelay: `${index * 0.2}s`,
                  animationDuration: '1s'
                }}
              />
            ))}
          </div>
        </div>
      </div>
    }
  >
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider networks={networkConfig}>
        <WalletProvider autoConnect>
          <Provider store={store}>
            <App />
          </Provider>
          <Toaster />
        </WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  </Suspense>
);
