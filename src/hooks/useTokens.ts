import { useEffect, useState } from 'react';
import { PublicKey, Connection } from '@solana/web3.js';
import { ENV } from "@solana/spl-token-registry";
import { TokenListProvider, TokenInfo } from '@solana/spl-token-registry';

import { getTokensInWallet, getUnkownTokenInfo } from '../utils/token';
import { AugmentedTokenInfo } from '../utils/account';
import { UnableToLoadTokensError } from '../errors';

export const useTokens = (connection: Connection, env: ENV, publicKey: PublicKey) => {
    const [tokens, setTokens] = useState<AugmentedTokenInfo[]>();
    const [tokenMap, setTokenMap] = useState<Map<string, TokenInfo>>(new Map());

    useEffect(() => {
        console.log('load tokens from provider...');

        new TokenListProvider().resolve().then(tokens => {
            const tokenList = tokens
                .filterByChainId(env)
                .excludeByTag('nft')
                .getList();
    
          setTokenMap(tokenList.reduce((map, item) => {
            map.set(item.address.toString(), item);
            return map;
          }, new Map()));
        });
      }, [env]);

    useEffect(() => {
        getTokensInWallet(publicKey, connection)
            .then(tokensInWallet => {
                const augmentedTokens = tokensInWallet.map(token => {
                    const tokenMintAddress = token.data.tokenAccountInfo.mint.toString();

                    console.log('tokenMintAddress: ', tokenMintAddress);
                    console.log('map has token?: ', tokenMap.has(tokenMintAddress));

                    let tokenInfo: TokenInfo;
                    if (tokenMap.has(tokenMintAddress)) {
                        /** @ts-ignore: we check if map has token address right before this */
                        tokenInfo = tokenMap.get(tokenMintAddress);
                    } else {
                        tokenInfo = getUnkownTokenInfo(token, env);
                    }

                    return {
                        tokenAccountData: token,
                        tokenInfo,
                    };
                })

                setTokens(augmentedTokens);
            })
            .catch((err) => new UnableToLoadTokensError('Unable to load tokensInWallet from wallet', err));
    }, [tokenMap, publicKey]);

    return tokens ? tokens : [];
};
