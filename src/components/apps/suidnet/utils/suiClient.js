import { createNetworkConfig, SuiClientProvider } from "@mysten/dapp-kit";
import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";
import { MIST_PER_SUI } from '@mysten/sui/utils';

// Khởi tạo các networks
const networks = {
  testnet: { url: getFullnodeUrl("testnet") },
  mainnet: { url: getFullnodeUrl("mainnet") },
  devnet: { url: getFullnodeUrl("devnet") }
};

// Tạo singleton instance
let clientInstance = null;
let networkConfigInstance = null;

export const getSuiClient = (network = 'testnet') => {
  if (!clientInstance) {
    if (!networks[network]) {
      throw new Error(`Network ${network} không hợp lệ`);
    }
    clientInstance = new SuiClient(networks[network]);
  }
  return clientInstance;
};

export const getNetworkConfig = (network = 'testnet') => {
  if (!networkConfigInstance) {
    const config = {
      [network]: networks[network]
    };
    networkConfigInstance = createNetworkConfig(config);
  }
  return networkConfigInstance;
};

// Hàm chuyển đổi từ MIST sang SUI
const convertMistToSui = (balance) => {
  return Number(balance) / Number(MIST_PER_SUI);
};

// Hàm lấy balance
export const getBalance = async (address) => {
  try {
    // Lấy tất cả balance của address
    const balance = await getSuiClient().getBalance({
      owner: address,
    });

    return convertMistToSui(BigInt(balance.totalBalance));
  } catch (e) {
    console.error('Error getting balance:', e);
    throw e;
  }
}