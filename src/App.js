import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { 
    PhantomWalletAdapter,
    SolflareWalletAdapter,
    BackpackWalletAdapter,
    GlowWalletAdapter,
    ExodusWalletAdapter,
    BraveWalletAdapter
} from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';
import PlayerTable from './components/PlayerTable';

// Import wallet adapter CSS
require('@solana/wallet-adapter-react-ui/styles.css');

function App() {
    // Set up Solana network (devnet for testing)
    const network = clusterApiUrl('devnet');
    
    // Configure all available wallets
    const wallets = [
        new PhantomWalletAdapter(),
        new SolflareWalletAdapter(),
        new BackpackWalletAdapter(),
        new GlowWalletAdapter(),
        new ExodusWalletAdapter(),
        new BraveWalletAdapter()
    ];

    return (
        <ConnectionProvider endpoint={network}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>
                    <Router>
                        <Routes>
                            <Route path="/" element={<PlayerTable />} />
                        </Routes>
                    </Router>
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
}

export default App;