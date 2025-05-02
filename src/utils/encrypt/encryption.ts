import * as CryptoJS from "crypto-js";

const SECRET_KEY = import.meta.env.VITE_ENCRYPTION_SECRET_KEY;

// Encrypt data
export function encryptData(data: any): string {
    const stringifiedData = JSON.stringify(data[0]);
    return CryptoJS.AES.encrypt(stringifiedData, SECRET_KEY).toString();
}

// Decrypt data
export function decryptData(encryptedData: string): unknown {
    try {
        const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
        const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
        return JSON.parse(decryptedData); 
    } catch (error) {
        console.error("Decryption failed:", error);
        return null;
    }
}