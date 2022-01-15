import { useState, useEffect } from 'react';

/** local asset import */
import '../../assets/styles/common.css';
import './TokenAmountInput.css';

interface InputFieldProps {
    disabled: boolean;
    toggleReset: boolean;
    onChange: (amount: number) => void;
    min?: number;
    // max amount isn't used to validate input but rather set the max
    // token amoount with the click of a button.
    max?: number;
}

export const TokenAmountInput = (props: InputFieldProps) => {
    const { disabled, min, max, toggleReset, onChange } = props;

    const [amount, setAmount] = useState<number>(0);
    const [isInputValid, setIsInputValid] = useState<boolean>(true);

    // force managed component state value to zero
    useEffect(() => {
        setAmount(0);
    }, [toggleReset]);

    const _handleInputChange = (e: any) => {
        const value = +e.target.value;

        // is value valid from min POV, if supplied
        const isCurrentInputValid = !Number.isNaN(value) && (!min ? true : value >= min);

        setIsInputValid(isCurrentInputValid);
        setAmount(e.target.value);

        // optionally update calling component
        if (isCurrentInputValid) {
            onChange(e.target.value);
        }
    };

    const _setMaxInputAmount = () => {
        const maxAmount = max ? max : 0;

        setAmount(maxAmount);
        onChange(maxAmount);
    };

    return (
        <div
            className={`input--field--container ${!isInputValid && 'invalid--input'} ${disabled && 'input--disabled'}`}
        >
            <input className="input--amount--field" value={amount} onChange={_handleInputChange} />
            {max && (
                <div className="max--token--button" onClick={_setMaxInputAmount}>
                    Max
                </div>
            )}
        </div>
    );
};
