import { WalletNotConnectedError } from '@solana/wallet-adapter-base';
import { WalletContextState } from '@solana/wallet-adapter-react';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { SystemProgram, PublicKey, Transaction, TransactionInstruction, Connection } from '@solana/web3.js';

/** local helper functions & vars */
import { DEFAULT_SOL_TOKEN, UTF_8, MAX_MESSAGE_LENGTH_IN_CHARS, MEMO_PROGRAM_PUBLIC_KEY } from '../utils/constant';
import { getOrCreateAssociatedTokenAccount } from '../utils/transfer/getOrCreateAssociatedTokenAccount';
import { createTransferInstruction } from '../utils/transfer/createTransferInstructions';
import { MessageTooLarge } from '../errors';

const addTransactionMemo = async (tx: Transaction, publicKey: PublicKey, message?: string) => {
    if (!message) return;
    if (message && message.length > MAX_MESSAGE_LENGTH_IN_CHARS) {
        throw new MessageTooLarge(`Message cannot exceed ${MAX_MESSAGE_LENGTH_IN_CHARS} characters.`);
    }

    await tx.add(
        new TransactionInstruction({
            keys: [{ pubkey: publicKey, isSigner: true, isWritable: true }],
            data: Buffer.from(message, UTF_8),
            programId: MEMO_PROGRAM_PUBLIC_KEY,
        })
    );
};

/**
 * I believe top level wallet errors (e.g. WalletSignTransactionError) will also be thrown
 * and uncatchable due to the way browser extensions work, i.e. separate instance of a browser.
 * I don't know too much about the details here, but this is my best guess based on development
 * and basic browser extension expierence.
 *
 * Why not use normal functions? Hooks can utilize React hooks like useState, useEffect, etc. I suspect
 * this will come in handy in the future, so using a hook for now. If not, we can easily revert to normal
 * functions.
 */
export const useTransfer = (connection: Connection, walletContextState: WalletContextState) => {
    const { publicKey, signTransaction, sendTransaction } = walletContextState;

    const _getFilteredTokens = async (toPublicKey: PublicKey, amount: number, msg?: string) => {
        if (!publicKey) throw new WalletNotConnectedError();

        const transaction = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey: publicKey,
                toPubkey: toPublicKey,
                lamports: amount,
            })
        );

        await addTransactionMemo(transaction, publicKey, msg);

        const signature = await sendTransaction(transaction, connection);

        await connection.confirmTransaction(signature, 'processed');

        return signature;
    };

    const _transferSplTokens = async (mint: PublicKey, toPublicKey: PublicKey, amount: number, msg?: string) => {
        if (!toPublicKey || !amount) return;
        if (!publicKey || !signTransaction) throw new WalletNotConnectedError();

        const fromTokenAccount = await getOrCreateAssociatedTokenAccount(
            connection,
            publicKey,
            mint,
            publicKey,
            signTransaction
        );

        const toTokenAccount = await getOrCreateAssociatedTokenAccount(
            connection,
            publicKey,
            mint,
            toPublicKey,
            signTransaction
        );

        const transaction = new Transaction().add(
            createTransferInstruction(
                fromTokenAccount.address, // source
                toTokenAccount.address, // dest
                publicKey,
                amount,
                [],
                TOKEN_PROGRAM_ID
            )
        );

        await addTransactionMemo(transaction, publicKey, msg);

        const blockHash = await connection.getRecentBlockhash();
        transaction.feePayer = await publicKey;
        transaction.recentBlockhash = await blockHash.blockhash;

        const signed = await signTransaction(transaction);
        const signature = await connection.sendRawTransaction(signed.serialize());
        await connection.confirmTransaction(signature, 'processed');

        return signature;
    };

    const transferTokens = async (
        tokenAddress: PublicKey,
        toPublicKey: PublicKey,
        amount: number,
        msg?: string
    ): Promise<string | undefined> => {
        if (tokenAddress.toString() === DEFAULT_SOL_TOKEN.address) {
            return await _getFilteredTokens(toPublicKey, amount, msg);
        } else {
            return await _transferSplTokens(tokenAddress, toPublicKey, amount, msg);
        }
    };

    return transferTokens;
};
