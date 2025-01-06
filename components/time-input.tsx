import React, {useState, useEffect, useCallback} from 'react';

const TimeInput = ({ onTimeChange, id = 0 }: {onTimeChange: any, id?: number}) => {
    const [hours, setHours] = useState('00');
    const [minutes, setMinutes] = useState('00');
    const [seconds, setSeconds] = useState('00');
    const [milliseconds, setMilliseconds] = useState('000');

    const formatTime = useCallback(() => { // ✅ useCallback для formatTime
        return `${hours}:${minutes}:${seconds}.${milliseconds}`;
    }, [hours, minutes, seconds, milliseconds]);

    useEffect(() => {
        onTimeChange(formatTime(), id || 0);
    }, [onTimeChange, id, formatTime]);

    return (
        <div>
            <input
                type="number"
                value={hours}
                onChange={(e) => {
                    let value = e.target.value;
                    if (value.length > 2) {
                        value = value.slice(-2);
                    }
                    const numericValue = parseInt(value, 10);
                    if (isNaN(numericValue) || numericValue < 0 || numericValue > 23) {
                        value = '00';
                    }
                    setHours(value.padStart(2, '0'));
                }}
                min="0"
                max="23"
            />
            :
            <input
                type="number"
                value={minutes}
                onChange={(e) => {
                    let value = e.target.value;
                    if (value.length > 2) {
                        value = value.slice(-2);
                    }
                    const numericValue = parseInt(value, 10);
                    if (isNaN(numericValue) || numericValue < 0 || numericValue > 59) {
                        value = '00';
                    }
                    setMinutes(value.padStart(2, '0'));
                }}
                min="0"
                max="59"
            />
            :
            <input
                type="number"
                value={seconds}
                onChange={(e) => {
                    let value = e.target.value;
                    if (value.length > 2) {
                        value = value.slice(-2);
                    }
                    const numericValue = parseInt(value, 10);
                    if (isNaN(numericValue) || numericValue < 0 || numericValue > 59) {
                        value = '00';
                    }
                    setSeconds(value.padStart(2, '0'));
                }}
                min="0"
                max="59"
            />
            .
            <input
                type="number"
                value={milliseconds}
                onChange={(e) => {
                    let value = e.target.value;
                    if (value.length > 3) {
                        value = value.slice(-3);
                    }
                    const numericValue = parseInt(value, 10);
                    if (isNaN(numericValue) || numericValue < 0 || numericValue > 999) {
                        value = '000';
                    }
                    setMilliseconds(value.padStart(3, '0'));
                }}
                min="0"
                max="999"
            />
        </div>
    );
};

export default TimeInput;