import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";

import { NETWORK } from "./constants";

const aptos = new Aptos(
  new AptosConfig({
    network: Network.CUSTOM,
    indexer: "https://indexer.testnet.suzuka.movementlabs.xyz/v1/graphql",
    fullnode: "https://testnet.suzuka.movementnetwork.xyz/v1",
    faucet: "https://faucet.testnet.suzuka.movementlabs.xyz/",
  })
);

// Reuse same Aptos instance to utilize cookie based sticky routing
export function aptosClient() {
  return aptos;
}
