import { useState } from "react";

export function useLocalStorage(key: string, initialValue: any) {
    const [storageValue, setStorageValue] = useState(() => {
        try {
            var item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (err) {
            return initialValue;
        }
    });

    const setValue = (value: any) => {
        try {
            setStorageValue({ ...value, timestamp: Date.now(), guildsTimestamp: Date.now() });
            window.localStorage.setItem(key, JSON.stringify(value));
        } catch (err) {
            console.error(err);
        }
    };

    const removeValue = () => {
        try {
            window.localStorage.removeItem(key);
            setStorageValue(initialValue);
            return initialValue;
        } catch (err) {
            return initialValue;
        }
    };

    return [storageValue, setValue, removeValue];
}
