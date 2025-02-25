// components/ContractInteractions.jsx
import { useState } from 'react';
import { useAccount, useReadContract, useWriteContract } from 'wagmi';
import { formatEther, parseEther } from 'viem';
import { contractAbi } from '../utils/contractAbi';



// Contract address - using your actual contract address
const CONTRACT_ADDRESS = '0x9bD27c3A181c3B27B0574279FD3e5e20b29B2cBb';

function ContractInteractions() {
    const { address, isConnected } = useAccount();
    const [nomineeAddress, setNomineeAddress] = useState('');
    const [signInterval, setSignInterval] = useState('');
    const [stakeAmount, setStakeAmount] = useState('');
    const [unstakeAmount, setUnstakeAmount] = useState('');

    const { writeContractAsync } = useWriteContract();

    // Read contract data
    const { data: stakeData } = useReadContract({
        address: CONTRACT_ADDRESS,
        abi: contractAbi,
        functionName: 'stakes',
        args: [address],
        //@ts-ignore
        enabled: isConnected,
    });

    const { data: totalStake } = useReadContract({
        address: CONTRACT_ADDRESS,
        abi: contractAbi,
        functionName: 'totalStake',
        //@ts-ignore
        enabled: isConnected,
    });

    // Stake function
    const handleStake = async () => {
        if (!stakeAmount || !nomineeAddress || !signInterval) return;

        try {
            await writeContractAsync({
                address: CONTRACT_ADDRESS,
                abi: contractAbi,
                functionName: 'stake',
                args: [nomineeAddress, BigInt(signInterval)],
                value: parseEther(stakeAmount),
            });

            setStakeAmount('');
            setNomineeAddress('');
            setSignInterval('');
        } catch (error) {
            console.error('Error staking:', error);
        }
    };

    // Unstake function
    const handleUnstake = async () => {
        if (!unstakeAmount) return;

        try {
            await writeContractAsync({
                address: CONTRACT_ADDRESS,
                abi: contractAbi,
                functionName: 'unstake',
                args: [parseEther(unstakeAmount)],
            });

            setUnstakeAmount('');
        } catch (error) {
            console.error('Error unstaking:', error);
        }
    };

    // Sign in function
    const handleSignIn = async () => {
        try {
            await writeContractAsync({
                address: CONTRACT_ADDRESS,
                abi: contractAbi,
                functionName: 'signIn',
            });
        } catch (error) {
            console.error('Error signing in:', error);
        }
    };

    // Update nominee function
    const handleUpdateNominee = async () => {
        if (!nomineeAddress) return;

        try {
            await writeContractAsync({
                address: CONTRACT_ADDRESS,
                abi: contractAbi,
                functionName: 'updateNominee',
                args: [nomineeAddress],
            });

            setNomineeAddress('');
        } catch (error) {
            console.error('Error updating nominee:', error);
        }
    };

    // Update sign interval function
    const handleUpdateSignInterval = async () => {
        if (!signInterval) return;

        try {
            await writeContractAsync({
                address: CONTRACT_ADDRESS,
                abi: contractAbi,
                functionName: 'updateSignInterval',
                args: [BigInt(signInterval)],
            });

            setSignInterval('');
        } catch (error) {
            console.error('Error updating sign interval:', error);
        }
    };

    if (!isConnected) {
        return (
            <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700 text-gray-200">
                <p className="text-center text-gray-400">Please connect your wallet to interact with the contract</p>
            </div>
        );
    }

    // Format time from seconds to a more readable format
    const formatTimeInterval = (seconds: number) => {
        if (!seconds) return 'Not set';

        const totalSeconds = parseInt(seconds.toString());
        const days = Math.floor(totalSeconds / 86400);
        const hours = Math.floor((totalSeconds % 86400) / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);

        const parts = [];
        if (days > 0) parts.push(`${days} day${days !== 1 ? 's' : ''}`);
        if (hours > 0) parts.push(`${hours} hour${hours !== 1 ? 's' : ''}`);
        if (minutes > 0 && days === 0) parts.push(`${minutes} minute${minutes !== 1 ? 's' : ''}`);

        return parts.join(', ') || `${totalSeconds} seconds`;
    };

    return (
        <div className="space-y-6 -mt-8">
            {/* Current Stake Information */}
            <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700 text-gray-200">
                <h2 className="text-xl font-semibold mb-4 text-blue-400 border-b border-gray-700 pb-2">Your Stake Information</h2>
                {stakeData ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                            <p className="text-gray-400 text-sm">Your Balance</p>
                            <p className="font-medium text-2xl text-green-400">{
                                //@ts-ignore
                                stakeData.balance ? formatEther(stakeData.balance) : '0'} ETH</p>
                        </div>
                        <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                            <p className="text-gray-400 text-sm">Last Sign In</p>
                            <p className="font-medium text-xl text-yellow-400">
                                {
                                    //@ts-ignore
                                    stakeData.lastSignIn && stakeData.lastSignIn > 0
                                        //@ts-ignore
                                        ? new Date(Number(stakeData.lastSignIn) * 1000).toLocaleString()
                                        : 'Never signed in'}
                            </p>
                        </div>
                        <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                            <p className="text-gray-400 text-sm">Nominee</p>
                            <p className="font-medium text-purple-400 truncate">
                                {
                                    //@ts-ignore
                                    stakeData.nominee && stakeData.nominee !== '0x0000000000000000000000000000000000000000'
                                        //@ts-ignore
                                        ? stakeData.nominee
                                        : 'Not set'}
                            </p>
                        </div>
                        <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                            <p className="text-gray-400 text-sm">Sign Interval</p>
                            <p className="font-medium text-cyan-400">
                                {
                                    //@ts-ignore
                                    stakeData.signInterval ? formatTimeInterval(stakeData.signInterval) : 'Not set'}
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="bg-gray-900 p-6 rounded-lg border border-gray-700 text-center">
                        <p className="text-gray-400">Loading stake information...</p>
                    </div>
                )}

                <div className="mt-6 pt-4 border-t border-gray-700">
                    <p className="text-gray-400 text-sm">Total Contract Stake</p>
                    <p className="font-medium text-xl text-green-400">{
                        //@ts-ignore
                        totalStake ? formatEther(totalStake) : '0'} ETH</p>
                </div>
            </div>

            {/* Stake & Unstake */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Stake Form */}
                <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700 text-gray-200">
                    <h2 className="text-xl font-semibold mb-4 text-green-400 border-b border-gray-700 pb-2">Stake ETH</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Amount (ETH)</label>
                            <input
                                type="text"
                                value={stakeAmount}
                                onChange={(e) => setStakeAmount(e.target.value)}
                                placeholder="0.1"
                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Nominee Address</label>
                            <input
                                type="text"
                                value={nomineeAddress}
                                onChange={(e) => setNomineeAddress(e.target.value)}
                                placeholder="0x..."
                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Sign Interval (seconds)</label>
                            <input
                                type="number"
                                value={signInterval}
                                onChange={(e) => setSignInterval(e.target.value)}
                                placeholder="2592000 (30 days)"
                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                            <div className="mt-1 text-xs text-gray-400">
                                Common intervals: 86400 (1 day), 604800 (1 week), 2592000 (30 days)
                            </div>
                        </div>
                        <button
                            onClick={handleStake}
                            className="w-full px-4 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                        >
                            Stake ETH
                        </button>
                    </div>
                </div>

                {/* Unstake Form */}
                <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700 text-gray-200">
                    <h2 className="text-xl font-semibold mb-4 text-red-400 border-b border-gray-700 pb-2">Unstake ETH</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Amount (ETH)</label>
                            <input
                                type="text"
                                value={unstakeAmount}
                                onChange={(e) => setUnstakeAmount(e.target.value)}
                                placeholder="0.1"
                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            />
                        </div>
                        <button
                            onClick={handleUnstake}
                            className="w-full px-4 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                        >
                            Unstake ETH
                        </button>
                    </div>
                </div>
            </div>

            {/* Sign In & Update Settings */}
            <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700 text-gray-200">
                <h2 className="text-xl font-semibold mb-4 text-blue-400 border-b border-gray-700 pb-2">Actions & Settings</h2>
                <div className="space-y-6">
                    {/* Sign In */}
                    <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                        <h3 className="font-medium mb-2 text-blue-400">Sign In</h3>
                        <p className="text-sm text-gray-400 mb-3">
                            Sign in to reset your timer and prevent funds from being transferred to your nominee.
                        </p>
                        <button
                            onClick={handleSignIn}
                            className="w-full px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                        >
                            Sign In
                        </button>
                    </div>

                    {/* Update Settings */}
                    <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                        <h3 className="font-medium mb-3 text-purple-400">Update Settings</h3>

                        {/* Update Nominee */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-300 mb-1">New Nominee Address</label>
                            <div className="flex space-x-2">
                                <input
                                    type="text"
                                    value={nomineeAddress}
                                    onChange={(e) => setNomineeAddress(e.target.value)}
                                    placeholder="0x..."
                                    className="flex-grow px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                />
                                <button
                                    onClick={handleUpdateNominee}
                                    className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                                >
                                    Update
                                </button>
                            </div>
                        </div>

                        {/* Update Sign Interval */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">New Sign Interval (seconds)</label>
                            <div className="flex space-x-2">
                                <input
                                    type="number"
                                    value={signInterval}
                                    onChange={(e) => setSignInterval(e.target.value)}
                                    placeholder="2592000 (30 days)"
                                    className="flex-grow px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                />
                                <button
                                    onClick={handleUpdateSignInterval}
                                    className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                                >
                                    Update
                                </button>
                            </div>
                            <div className="mt-1 text-xs text-gray-400">
                                Common intervals: 86400 (1 day), 604800 (1 week), 2592000 (30 days)
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ContractInteractions;