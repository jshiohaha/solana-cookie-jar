import { useEffect, useRef, useState } from 'react';
import { ENV } from '@solana/spl-token-registry';

import './NetworkSelector.css';

const NETWORK_TO_READABLE_STR = new Map<ENV, string>([
    [ENV.Testnet, 'Testnet'],
    [ENV.Devnet, 'Devnet'],
    [ENV.MainnetBeta, 'Mainnet'],
]);

const ALL_NETWORKS = Array.from(NETWORK_TO_READABLE_STR.keys()).sort().reverse();

export interface NetworkSelectorProps {
    network: ENV;
    onChange: (env: ENV) => void;
}

// TODO: might be useful to extract to a shared package in order to reuse.
export const NetworkSelector = (props: NetworkSelectorProps) => {
    const selectorRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState<boolean>(false);

    const onLaunchSelector = (_e: any) => {
        setIsVisible(true);
    };

    const onSelectNetwork = (e: any) => {
        setIsVisible(false);
        props.onChange(e.target.value);
    };

    useEffect(() => {
        const _handleClickOutside = (e: any) => {
            if (isVisible && selectorRef.current && !selectorRef.current!.contains(e.target)) {
                setIsVisible(false);
            }
        };

        // bind the event listener
        document.addEventListener('mousedown', _handleClickOutside);

        return () => {
            // unbind the event listener on clean up
            document.removeEventListener('mousedown', _handleClickOutside);
        };
    }, [isVisible]);

    return (
        <div className="network--selector--wrapper" ref={selectorRef}>
            <div
                className={`network--selector--button ${isVisible && 'network--selector--visible'}`}
                onClick={onLaunchSelector}
            >
                {NETWORK_TO_READABLE_STR.get(props.network)}
            </div>

            <ul className={`network--selector--dropdown ${isVisible && 'network--selector--dropdown--visible'}`}>
                {ALL_NETWORKS.filter((network) => {
                    return network !== props.network;
                }).map((network, index) => {
                    return (
                        <li key={index} value={network} onClick={onSelectNetwork} className="network--selector--option">
                            {NETWORK_TO_READABLE_STR.get(network)}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};
