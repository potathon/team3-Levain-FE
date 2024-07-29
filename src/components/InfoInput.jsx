import "../styles/components/InfoInput.css";
import { useState } from "react";

function InfoInput({ type, value, placeholder, helper, marginRight, onChange, onFocus, onBlur }) {
    const [isFocused, setIsFocused] = useState(false);

    const handleFocus = (e) => {
        setIsFocused(true);
        if (onFocus) onFocus(e);
    };

    const handleBlur = (e) => {
        setIsFocused(false);
        if (onBlur) onBlur(e);
    };

    return (
        <div className="InfoInputBox">
            <input
                className={`InputBoxContent ${isFocused || value ? "focused" : ""}`}
                type={type}
                value={value}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onChange={onChange}
            />
            <label className={`InputLabel ${isFocused || value ? "focused" : ""}`}>
                {placeholder}
            </label>
            <div className="helper-section">
                <div className="helper" style={{ marginRight: marginRight }}>
                    {helper}
                </div>
            </div>
        </div>
    );
}

export default InfoInput;
