import { TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID } from '@solana/spl-token';

import { SignerWalletAdapterProps } from '@solana/wallet-adapter-base';
import { Connection, PublicKey, Commitment, Transaction } from '@solana/web3.js';

/** local helper functions & vars */
import { createAssociatedTokenAccountInstruction } from './createAssociatedTokenAccountInstruction';
import { getAccountInfo } from './getAccountInfo';
import { getAssociatedTokenAddress } from './getAssociatedTokenAddress';
import { TokenInvalidMintError, TokenInvalidOwnerError } from '../../errors';

export const getOrCreateAssociatedTokenAccount = async (
    connection: Connection,
    payer: PublicKey,
    mint: PublicKey,
    owner: PublicKey,
    signTransaction: SignerWalletAdapterProps['signTransaction'],
    allowOwnerOffCurve = false,
    commitment?: Commitment,
    programId = TOKEN_PROGRAM_ID,
    associatedTokenProgramId = ASSOCIATED_TOKEN_PROGRAM_ID
) => {
    const associatedToken = await getAssociatedTokenAddress(
        mint,
        owner,
        allowOwnerOffCurve,
        programId,
        associatedTokenProgramId
    );

    // This is the optimal logic, considering TX fee, client-side computation, RPC roundtrips and guaranteed idempotent.
    // Sadly we can't do this atomically.
    let account;

    try {
        account = await getAccountInfo(connection, associatedToken, commitment, programId);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        const errorStr = error.message && error.message.length > 0 ? error.message : error.toString();

        // TokenAccountNotFoundError can be possible if the associated address has already received some lamports,
        // becoming a system account. Assuming program derived addressing is safe, this is the only case for the
        // TokenInvalidAccountOwnerError in this code path.
        if (errorStr === 'TokenAccountNotFoundError' || errorStr === 'TokenInvalidAccountOwnerError') {
            // As this isn't atomic, it's possible others can create associated accounts meanwhile.
            try {
                const transaction = new Transaction().add(
                    createAssociatedTokenAccountInstruction(
                        payer,
                        associatedToken,
                        owner,
                        mint,
                        programId,
                        associatedTokenProgramId
                    )
                );

                const blockHash = await connection.getRecentBlockhash();
                transaction.feePayer = await payer;
                transaction.recentBlockhash = await blockHash.blockhash;
                const signed = await signTransaction(transaction);

                const signature = await connection.sendRawTransaction(signed.serialize());

                await connection.confirmTransaction(signature);
            } catch (error: unknown) {
                // Ignore all errors; for now there is no API-compatible way to selectively ignore the expected
                // instruction error if the associated account exists already.
            }

            // Now this should always succeed
            account = await getAccountInfo(connection, associatedToken, commitment, programId);
        } else {
            throw error;
        }
    }

    if (!account.mint.equals(mint.toBuffer())) throw new TokenInvalidMintError();
    if (!account.owner.equals(owner.toBuffer())) throw new TokenInvalidOwnerError();

    return account;
};
