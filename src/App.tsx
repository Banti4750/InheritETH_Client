// App.jsx
import { createConfig, WagmiConfig, http } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ContractInteractions from './components/ContractInteractions';
import ConnectWallet from './components/ConnectWallet';
import { metaMask } from 'wagmi/connectors';

// Create wagmi config with Sepolia testnet
const config = createConfig({
  chains: [sepolia],
  connectors: [
    metaMask(),
  ],
  transports: {
    [sepolia.id]: http(),
  }
});

// Create a query client
const queryClient = new QueryClient();

function App() {
  return (
    <WagmiConfig config={config}>
      <QueryClientProvider client={queryClient}>
        <div className="min-h-screen bg-gray-900 text-white">
          <div className="max-w-5xl mx-auto p-6">
            <header className="py-8 mb-6 text-center">
              {/* <h1 className="text-4xl font-bold text-blue-400 mb">Dead Man's Switch</h1> */}
              <p className="text-gray-400 max-w-2xl mx-auto mt-12">
                Secure your digital assets by setting up a nominee who will receive your funds if you don't sign in within your specified interval.
              </p>
            </header>
            <ConnectWallet />
            <ContractInteractions />
            <footer className="mt-12 pt-6 border-t border-gray-800 text-center text-gray-500 text-sm">
              <p>Dead Man's Switch DApp • Running on Sepolia Testnet • 2025</p>
            </footer>
          </div>
        </div>
      </QueryClientProvider>
    </WagmiConfig>
  );
}

export default App;