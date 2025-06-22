"use client";

import InputField from "@/components/ui/InputField";
import { usePersistedState } from '@/components/ui/usePersistedState';
import { useState, useMemo } from "react";
import { chainsToTSender, tsenderAbi, erc20Abi } from "@/constants";
import { useChainId, useConfig, useAccount, useWriteContract, useReadContracts } from "wagmi";
import { readContract, waitForTransactionReceipt } from "@wagmi/core";
import { calculateTotal, formatTokenAmount } from "@/utils";

export default function AirdropForm() {
    const [tokenAddress, setTokenAddress] = usePersistedState('form-token-address', '');
    const [recipients, setRecipients] = usePersistedState('form-recipients', '');
    const [amounts, setAmounts] = usePersistedState('form-amounts', '');
    const chainId = useChainId();
    const config = useConfig();
    const account = useAccount();
    const { data: tokenData } = useReadContracts({
        contracts: [
            {
                abi: erc20Abi,
                address: tokenAddress as `0x${string}`,
                functionName: "decimals",
            },
            {
                abi: erc20Abi,
                address: tokenAddress as `0x${string}`,
                functionName: "name",
            },
            {
                abi: erc20Abi,
                address: tokenAddress as `0x${string}`,
                functionName: "balanceOf",
                args: [account.address],
            },
        ],
    })
    const [isSubmitting, setIsSubmitting] = useState(false);
    const total: number = useMemo(() => calculateTotal(amounts), [amounts]);
    const {data: hash, isPending, error, writeContractAsync} = useWriteContract();

    async function getApprovedAmount(tSenderAddress: string | null): Promise<number> {
        if (!tSenderAddress) {
            alert("TSender address not found for this chain.");
            return 0;
        }
        const response = await readContract(config,{
            address: tokenAddress as `0x${string}`,
            abi: erc20Abi,
            functionName: "allowance",
            args: [account.address, tSenderAddress as `0x${string}`],
        });
        return response as number;
    }

    async function handleSubmit() {

        setIsSubmitting(true);

        try {
        const tSenderAddress = chainsToTSender[chainId]["tsender"];
        const approvedAmount = await getApprovedAmount(tSenderAddress);

        if (approvedAmount < total) {
            const approvalHash = await writeContractAsync({
            abi: erc20Abi,
            address: tokenAddress as `0x${string}`,
            functionName: "approve",
            args: [tSenderAddress as `0x${string}`, BigInt(total)],
            });
            const approvalReceipt = await waitForTransactionReceipt(config, { 
            hash: approvalHash 
            });
            console.log("Approval transaction receipt:", approvalReceipt);

            await writeContractAsync({
            address: tSenderAddress as `0x${string}`,
            abi: tsenderAbi,
            functionName: "airdropERC20",
            args: [
                tokenAddress,
                // Comma or new line separated
                recipients.split(/[,\n]+/).map(addr => addr.trim()).filter(addr => addr !== ''),
                amounts.split(/[,\n]+/).map(amt => amt.trim()).filter(amt => amt !== ''),
                BigInt(total),
            ],
            });
            alert("Airdrop successful!");
        } else {
            await writeContractAsync({
            address: tSenderAddress as `0x${string}`,
            abi: tsenderAbi,
            functionName: "airdropERC20",
            args: [
                tokenAddress,
                // Comma or new line separated
                recipients.split(/[,\n]+/).map(addr => addr.trim()).filter(addr => addr !== ''),
                amounts.split(/[,\n]+/).map(amt => amt.trim()).filter(amt => amt !== ''),
                BigInt(total),
            ],
            });
            alert("Airdrop successful!");
        }
        } catch (error) {
        console.error('Transaction failed:', error);
        // You might want to show an error message to the user here
        alert("Transaction failed. Please try again.");
        } finally {
        setIsSubmitting(false);
        }
    }

    const handleClear = () => {
        setTokenAddress('');
        setRecipients('');
        setAmounts('');
    };

    return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
        <div className="max-w-2xl w-full mx-4">
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Token Airdrop</h2>
                    <p className="text-gray-600 leading-relaxed">
                        Send tokens to multiple recipients in a single transaction.
                    </p>
                </div>

                {/* Form Fields */}
                <div className="space-y-6">
                    {/* Token Address Field */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                            Token Address
                        </label>
                        <p className="text-xs text-gray-500 mb-3">
                            Enter the contract address of the token you want to send
                        </p>
                        <InputField
                            placeholder="0x..."
                            value={tokenAddress}
                            onChange={setTokenAddress}
                        />
                    </div>

                    {/* Recipients Field */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                            Recipients
                        </label>
                        <p className="text-xs text-gray-500 mb-3">
                            Enter wallet addresses separated by commas (e.g., 0x123..., 0x456...) or in separated lines.
                        </p>
                        <InputField
                            placeholder="0x123, 0x456, ..."
                            value={recipients}
                            onChange={setRecipients}
                            large={true}
                        />
                    </div>

                    {/* Amounts Field */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                            Amounts
                        </label>
                        <p className="text-xs text-gray-500 mb-3">
                            Enter token amounts separated by commas (e.g., 100, 200, 300...) or in separated lines.
                        </p>
                        <InputField
                            placeholder="100, 200, 300, ..."
                            value={amounts}
                            onChange={setAmounts}
                            large={true}
                        />
                    </div>

                    {/* Transaction Details */}
                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl p-6">
                        <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center">
                            <svg className="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Transaction Summary
                        </h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                                <span className="text-sm text-gray-600 font-medium">Token Name:</span>
                                <span className="font-mono text-sm text-gray-900 bg-white px-2 py-1 rounded border">
                                    {tokenData?.[1]?.result as string || 'N/A'}
                                </span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                                <span className="text-sm text-gray-600 font-medium">Amount (wei):</span>
                                <span className="font-mono text-sm text-gray-900 bg-white px-2 py-1 rounded border">
                                    {total || '0'}
                                </span>
                            </div>
                            <div className="flex justify-between items-center py-2">
                                <span className="text-sm text-gray-600 font-medium">Amount (tokens):</span>
                                <span className="font-mono text-sm text-gray-900 bg-white px-2 py-1 rounded border">
                                    {formatTokenAmount(total, tokenData?.[0]?.result as number) || '0'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <button 
                            onClick={handleClear} 
                            className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200 font-medium border border-gray-200 hover:border-gray-300"
                        >
                            Clear Form
                        </button>
                        <button 
                            onClick={handleSubmit} 
                            disabled={isSubmitting} 
                            className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <span>Processing...</span>
                                </>
                            ) : (
                                <>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                    </svg>
                                    <span>Send Tokens</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
);
}