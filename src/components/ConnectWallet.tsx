import { useAccount, useConnect, useDisconnect } from "wagmi";
import { useState } from "react";


const Navbar = () => {
    const { isConnected } = useAccount();

    //@ts-ignore
    const [error, setError] = useState("");

    return (
        <div className="fixed top-0 left-0 right-0 z-10 py-4">
            <div className="container mx-auto px-4 md:px-32">
                <div className="bg-white/10 backdrop-blur-3xl sticky top-0 border border-white/20 shadow-xl rounded-2xl p-4 flex items-center justify-between">
                    <h1 className="bg-gradient-to-r from-purple-600 to-blue-600 text-transparent bg-clip-text text-2xl font-bold">
                        Dead Man's Switch
                    </h1>

                    <div className="flex items-center gap-6">


                        {/* Wallet Connection */}
                        {!isConnected ? <Connect /> : <Disconnect />}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Navbar;

function Connect() {
    const { connectors, connect } = useConnect();

    return (
        <div className="flex gap-2">
            {connectors.map((connector) => (
                <button
                    key={connector.id}
                    onClick={() => connect({ connector })}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 px-5 py-2 rounded-lg text-white font-medium shadow-lg hover:shadow-purple-500/20 transition"
                >
                    {connector.name}
                </button>
            ))}
        </div>
    );
}

function Disconnect() {
    const { disconnect } = useDisconnect();

    return (
        <button
            className="bg-gradient-to-r from-purple-600 to-blue-600 px-5 py-2 rounded-lg text-white font-medium shadow-lg hover:shadow-purple-500/20 transition"
            onClick={() => disconnect()}
        >
            Disconnect Wallet
        </button>
    );
}