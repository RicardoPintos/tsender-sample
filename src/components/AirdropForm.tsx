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
    const {data: hash, isPending, writeContractAsync} = useWriteContract();

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

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setIsSubmitting(true);
    
        try {
        const tSenderAddress = chainsToTSender[chainId]["tsender"];
        const approvedAmount = await getApprovedAmount(tSenderAddress);
        
        if (approvedAmount < total) {
            const approvalHash = await writeContractAsync({
            address: tokenAddress as `0x${string}`,
            abi: erc20Abi,
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
        <div>
            <InputField
                label="Token Address"
                placeholder="0x"
                value={tokenAddress}
                onChange={setTokenAddress}
            />
            <InputField
                label="Recipients"
                placeholder="0x123, 0x456, ..."
                value={recipients}
                onChange={setRecipients}
                large={true}
            />
            <InputField
                label="Amounts"
                placeholder="100, 200, 300, ..."
                value={amounts}
                onChange={setAmounts}
                large={true}
            />

            <div className="bg-gray-200 border border-zinc-300 rounded-lg p-4">
                <h3 className="text-sm font-medium text-zinc-900 mb-3">Transaction Details</h3>
                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-zinc-600">Token Name:</span>
                        <span className="font-mono text-zinc-900">
                            {tokenData?.[1]?.result as string}
                        </span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-zinc-600">Amount (wei):</span>
                        <span className="font-mono text-zinc-900">{total}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-zinc-600">Amount (tokens):</span>
                        <span className="font-mono text-zinc-900">
                            {formatTokenAmount(total, tokenData?.[0]?.result as number)}
                        </span>
                    </div>
                </div>
            </div>
            <div className="flex justify-between">
                <button onClick={handleClear} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                    Clear Form
                </button>
                <button onClick={handleSubmit} disabled={isSubmitting} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                {isSubmitting ? (
                    <>
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Signing...</span>
                    </>
                ) : (
                    <span>Send Tokens</span>
                )}
                </button>
            </div>
        </div>
    );
}