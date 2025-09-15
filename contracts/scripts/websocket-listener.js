// Import ethers library
import { ethers } from "ethers";

// Configuration
const wsUrl = "wss://dream-rpc.somnia.network/ws"; // Change to mainnet URL if needed
const contractAddress = "0xADA7b2953E7d670092644d37b6a39BAE3237beD7"; // Replace with your contract address

// Contract ABI
const abi = [
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "string", name: "oldGreeting", type: "string" },
      { indexed: true, internalType: "string", name: "newGreeting", type: "string" },
    ],
    name: "GreetingSet",
    type: "event",
  },
  {
    inputs: [],
    name: "getGreeting",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
];

async function listen() {
  // Create WebSocket provider and contract
  const provider = new ethers.WebSocketProvider(wsUrl);
  await provider._waitUntilReady();
  const contract = new ethers.Contract(contractAddress, abi, provider);

  console.log("Listening for events...\n");

  // Event filter
  const filter = {
    address: contractAddress,
    topics: [ethers.id("GreetingSet(string,string)")],
  };

  // Listen for events
  provider.on(filter, async (log) => {
    try {
      const greeting = await contract.getGreeting();
      console.log(`New greeting: "${greeting}"`);
    } catch (error) {
      console.error("Error:", error.message);
    }
  });

  // Keep connection alive
  setInterval(async () => {
    try {
      await provider.getBlockNumber();
    } catch (error) {
      console.error("Connection error");
    }
  }, 30000);

  // Handle shutdown
  process.on("SIGINT", () => {
    provider.destroy();
    process.exit(0);
  });
}

// Start listening
listen().catch(console.error);