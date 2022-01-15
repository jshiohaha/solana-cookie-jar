import { useEffect, useState, useCallback, useRef } from 'react';
import { ENV } from '@solana/spl-token-registry';
import { PublicKey, Connection } from '@solana/web3.js';

/** local helper functions & vars */
import { useTokens } from '../../hooks/useTokens';
import { getFormattedAddress } from '../../utils/address';

/** local asset import */
import '../../assets/styles/common.css';
import './TokenSelector.css';

export interface TokenSelectorProps {
    publicKey: PublicKey;
    connection: Connection;
    isVisible: boolean;
    env: ENV;
    onTokenSelected: (token: any) => void;
    onClose: () => void;
}

export const TokenSelector = (props: TokenSelectorProps) => {
    const { publicKey, connection, isVisible, env, onTokenSelected, onClose } = props;
    const modalRef = useRef<HTMLDivElement>(null);
    const tokens = useTokens(connection, env, publicKey);
    const [searchInput, setSearchInput] = useState<string>('');

    useEffect(() => {
        const _handleClickOutside = (e: any) => {
            if (isVisible && modalRef.current && !modalRef.current!.contains(e.target)) {
                e.preventDefault();
                onClose();
            }
        };

        // bind the event listener
        document.addEventListener('mousedown', _handleClickOutside);

        return () => {
            // unbind the event listener on clean up
            document.removeEventListener('mousedown', _handleClickOutside);
        };
    }, [isVisible]);

    const _handleInputChange = (e: any) => setSearchInput(e.target.value);

    const _getFilteredTokens = useCallback(() => {
        const sanitizedInput = searchInput.trim().toLowerCase();
        if (!sanitizedInput || sanitizedInput.length === 0) {
            return tokens;
        }

        const resultToken = tokens.filter((token) => {
            const tokenName = (token.tokenInfo.name ? token.tokenInfo.name : '').toLowerCase();
            const tokenSymbol = (token.tokenInfo.symbol ? token.tokenInfo.symbol : '').toLowerCase();

            return tokenName.includes(sanitizedInput) || tokenSymbol.includes(sanitizedInput);
        });

        return resultToken;
    }, [tokens, searchInput]);

    // when tokens are loaded, we want to tell the calling component by "selecting" the first
    // one as default to auto populate
    useEffect(() => {
        if (tokens.length > 0) {
            onTokenSelected(tokens[0]);
        }
    }, [tokens]);

    return (
        <div className={`token--selector--background ${isVisible ? 'is--visible' : ''}`}>
            <div ref={modalRef} className="token--selector--wrapper">
                <section className="token--selector--search--container">
                    <input
                        type="search"
                        placeholder="Filter by token name, symbol"
                        className="token--selector--search--input"
                        value={searchInput}
                        onChange={_handleInputChange}
                    />
                </section>

                <section className="token--selector--results--container">
                    {_getFilteredTokens().map((token, idx) => {
                        return (
                            <span
                                key={idx}
                                className="token--item"
                                onClick={() => {
                                    onTokenSelected(token);
                                }}
                            >
                                <img src={token.tokenInfo.logoURI} alt="" className="token--item--img" />{' '}
                                <div>
                                    <div className="name--symbol--container">
                                        <span className="token--item--name">{token.tokenInfo.name}&nbsp;</span>
                                        <span className="token--item--symbol"> — {token.tokenInfo.symbol}</span>
                                    </div>
                                    <span className="token--address--formatted">
                                        {/* TODO: is this length ok on all devices? */}
                                        {getFormattedAddress(
                                            token.tokenAccountData?.data.tokenAccountInfo.mint.toString()!,
                                            10
                                        )}
                                    </span>
                                </div>
                                <span className="token--selector--amount">
                                    {token.tokenAccountData?.data.tokenAccountInfo.tokenAmount.uiAmount}
                                </span>
                            </span>
                        );
                    })}
                </section>
            </div>
        </div>
    );
};
