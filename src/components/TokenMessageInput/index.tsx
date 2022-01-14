import { useState, useEffect } from 'react';

import '../../assets/styles/common.css';
import './TokenMessageInput.css';

export interface TokenMessageInputProps {
    disabled: boolean;
    toggleReset: boolean;
    placeholderContent: string;
    maxContentChars?: number;
    onChange: (msg: string) => void;
}

export const TokenMessageInput = (props: TokenMessageInputProps) => {
    const { disabled, toggleReset, placeholderContent, maxContentChars, onChange } = props;

    const [message, setMessage] = useState<string>('');

    // force managed component state value to zero
    useEffect(() => {
        setMessage('');
    }, [toggleReset]);

    const _handleInputChange = (e: any) => {
        const inputMessage = e.target.value;
        const isInputValid = !maxContentChars ? true : inputMessage.length <= maxContentChars;

        if (isInputValid) {
            setMessage(inputMessage);
            onChange(inputMessage);
        }
    };

    const _isValidInput = () => {
        // if prop wasn't passed in, any number of chars is acceptable
        return !maxContentChars ? true : message.length <= maxContentChars;
    };

    return (
        <div
            className={`message--input--container ${!_isValidInput() && 'invalid--input'} ${
                disabled && 'input--disabled'
            }`}
        >
            <textarea
                className="message--input--field"
                placeholder={placeholderContent}
                value={message}
                onChange={_handleInputChange}
            />

            <span className="message--char--count">
                {message.length}
                {maxContentChars && <>&nbsp;/&nbsp;{maxContentChars}</>}
            </span>
        </div>
    );
};
