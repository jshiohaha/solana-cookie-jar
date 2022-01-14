import { useState, useEffect } from 'react';
import { PublicKey, Connection } from '@solana/web3.js';
import { ENV } from '@solana/spl-token-registry';

import { TokenSelector } from '../TokenSelector/index';
import { AugmentedTokenInfo, TokenAccount, augmentTokenAccount } from '../../utils/account';
import { DEFAULT_TOKEN_INFO, getTokensInWallet } from '../../utils/token';
import { UnableToLoadTokensError } from '../../errors';

import '../../assets/styles/common.css';
import './SelectTokenDisplay.css';

interface SelectTokenDisplayProps {
    publicKey: PublicKey;
    env: ENV;
    connection: Connection;
    disabled: boolean;
    onError: (error: Error) => void;
    onSelectToken?: (token: AugmentedTokenInfo) => void;
}

export const SelectTokenDisplay = (props: SelectTokenDisplayProps) => {
    const { publicKey, env, connection, disabled, onError, onSelectToken } = props;

    const [selectorIsVisible, setSelectorIsVisible] = useState<boolean>(false);
    const [tokens, setTokens] = useState<TokenAccount[]>([]);
    const [selectedToken, setSelectedToken] = useState<AugmentedTokenInfo>({
        tokenInfo: DEFAULT_TOKEN_INFO,
    });

    useEffect(() => {
        const _loadTokensInWallet = async () => {
            return await getTokensInWallet(publicKey, connection);
        };

        // skip loading tokens from wallet when not connected
        if (publicKey) {
            _loadTokensInWallet()
                .then((tokensInWallet) => {
                    if (tokensInWallet) {
                        setTokens(tokensInWallet);

                        // edge case: load wallet and first token is an SPL token
                        if (tokensInWallet.length > 0) {
                            const augmentedTokenInfo = augmentTokenAccount(tokensInWallet[0], env);

                            setSelectedToken(augmentedTokenInfo);

                            if (onSelectToken) {
                                onSelectToken(augmentedTokenInfo);
                            }
                        }
                    }
                })
                .catch((err) => onError(new UnableToLoadTokensError('Unable to load tokens from wallet', err)));
        }
    }, [env, publicKey]);

    const _toggleTokenSelector = () => setSelectorIsVisible(!selectorIsVisible);

    const _onTokenSelectorOpened = () => setSelectorIsVisible(true);

    const _onTokenSelectorClosed = () => setSelectorIsVisible(false);

    const _onTokenSelected = (_token: any) => {
        _toggleTokenSelector();
        setSelectedToken(_token);

        // optionally tell parent component a new token has been selected
        if (onSelectToken) {
            onSelectToken(_token);
        }
    };

    return (
        <>
            <div
                className={`token--selector--container ${disabled && 'input--disabled'}`}
                onClick={_onTokenSelectorOpened}
            >
                <span className="token--display">
                    <img
                        className="token--img"
                        src={selectedToken.tokenInfo.logoURI!}
                        alt={`${selectedToken.tokenInfo.symbol} image`}
                    />
                    {selectedToken.tokenInfo.symbol}
                </span>
            </div>

            <TokenSelector
                isVisible={selectorIsVisible}
                env={env}
                tokens={tokens}
                onTokenSelected={_onTokenSelected}
                onClose={_onTokenSelectorClosed}
            />
        </>
    );
};
