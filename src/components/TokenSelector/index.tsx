import { useEffect, useState, useCallback, useRef } from 'react';
import { ENV } from '@solana/spl-token-registry';

/** local helper functions & vars */
import { ENVS } from '../../utils/constant';
import { getFormattedAddress } from '../../utils/address';
import { TokenAccount, AugmentedTokenInfo, augmentTokenAccounts } from '../../utils/account';
import { InvalidChainIdError } from '../../errors';

/** local asset import */
import '../../assets/styles/common.css';
import './TokenSelector.css';

export interface TokenSelectorProps {
    isVisible: boolean;
    env: ENV;
    tokens: TokenAccount[];
    onTokenSelected: (token: any) => void;
    onClose: () => void;
}

export const TokenSelector = (props: TokenSelectorProps) => {
    const { isVisible, env, onTokenSelected, onClose } = props;

    const modalRef = useRef<HTMLDivElement>(null);

    const [searchInput, setSearchInput] = useState<string>('');
    const [tokens, setTokens] = useState<AugmentedTokenInfo[]>([]);

    useEffect(() => {
        if (!ENVS.includes(env)) {
            throw new InvalidChainIdError(`Invalid env: ${env}`);
        }

        const augmentedTokens = augmentTokenAccounts(props.tokens, env);

        setTokens(augmentedTokens);
    }, [env, props.tokens]);

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
