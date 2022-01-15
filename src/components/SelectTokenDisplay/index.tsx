import { useState } from 'react';
import { PublicKey, Connection } from '@solana/web3.js';
import { ENV } from '@solana/spl-token-registry';

import { TokenSelector } from '../TokenSelector/index';
import { AugmentedTokenInfo } from '../../utils/account';
import { DEFAULT_TOKEN_INFO } from '../../utils/token';

import '../../assets/styles/common.css';
import './SelectTokenDisplay.css';

interface SelectTokenDisplayProps {
    publicKey: PublicKey;
    env: ENV;
    connection: Connection;
    disabled: boolean;
    onError: (error: Error) => void; // remove
    onSelectToken?: (token: AugmentedTokenInfo) => void;
}

export const SelectTokenDisplay = (props: SelectTokenDisplayProps) => {
    const { publicKey, env, connection, disabled, onSelectToken } = props;

    const [selectorIsVisible, setSelectorIsVisible] = useState<boolean>(false);
    const [selectedToken, setSelectedToken] = useState<AugmentedTokenInfo>({
        tokenInfo: DEFAULT_TOKEN_INFO,
    });

    const _onTokenSelectorOpened = () => setSelectorIsVisible(true);

    const _onTokenSelectorClosed = () => setSelectorIsVisible(false);

    const _onTokenSelected = (_token: any) => {
        _onTokenSelectorClosed();
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
                publicKey={publicKey}
                connection={connection}
                isVisible={selectorIsVisible}
                env={env}
                onTokenSelected={_onTokenSelected}
                onClose={_onTokenSelectorClosed}
            />
        </>
    );
};
