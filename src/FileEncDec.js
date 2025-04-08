// Helper: Derive AES-GCM key from user's email
const deriveKeyFromEmail = async (email, salt) => {
    const encoder = new TextEncoder();

    // 1. Create base key from email
    const keyMaterial = await crypto.subtle.importKey(
        "raw",
        encoder.encode(email),
        { name: "PBKDF2" },
        false,
        ["deriveBits"]
    );

    // 2. Derive 256-bit raw key
    const derivedBits = await crypto.subtle.deriveBits(
        {
        name: "PBKDF2",
        salt: encoder.encode(salt),
        iterations: 100000,
        hash: "SHA-256",
        },
        keyMaterial,
        256 // bits
    );

    // Log the key for debug (hex)
    // const rawKey = await crypto.subtle.exportKey("raw", derivedBits);
    // const keyArray = new Uint8Array(rawKey);
    // const keyHex = [...keyArray].map(b => b.toString(16).padStart(2, "0")).join("");

    // 3. Import as AES-GCM usable key
    return await crypto.subtle.importKey(
        "raw",
        derivedBits,
        { name: "AES-GCM" },
        false, // ← this is not allowed if you want to export key then change to true
        ["encrypt", "decrypt"]
    );
};

function arrayBufferToBase64(buffer) {
    let binary = "";
    const bytes = new Uint8Array(buffer);
    const chunkSize = 0x8000; // 32K chunks to prevent stack overflow
    for (let i = 0; i < bytes.length; i += chunkSize) {
        binary += String.fromCharCode.apply(null, bytes.subarray(i, i + chunkSize));
    }
    return btoa(binary);
}

function base64ToArrayBuffer(base64) {
    const binary = atob(base64);
    const len = binary.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
}

// Helper: Encrypt the given file
const encryptFile = async (file, user) => {
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const saltString = JSON.parse(
        localStorage.getItem(`userProfile-${user.uid}`)
    ).salt;
    const salt = Uint8Array.from(atob(saltString), (c) => c.charCodeAt(0));
    const key = await deriveKeyFromEmail(user.email, salt);
    const fileBuffer = await file.arrayBuffer();

    const encrypted = await crypto.subtle.encrypt(
        { name: "AES-GCM", iv },
        key,
        fileBuffer
    );

    const encryptedBase64 = arrayBufferToBase64(encrypted);
    const encryptedBlob = new Blob([encryptedBase64], { type: "text/plain" });

    return { encryptedBlob, iv };
};

// Helper: Decrypt the encrypted file
const decryptFile = async (user, file, doneCallback) => {
  try {
    const response = await fetch(
      `https://maroon-written-snake-594.mypinata.cloud/ipfs/${file.cid}`
    );
    const encryptedText = await response.text();

    const encryptedBuffer = base64ToArrayBuffer(encryptedText);
    const iv = Uint8Array.from(atob(file.iv), (c) => c.charCodeAt(0));
    const saltString = JSON.parse(
      localStorage.getItem(`userProfile-${user.uid}`)
    ).salt;
    const salt = Uint8Array.from(atob(saltString), (c) => c.charCodeAt(0));

    const key = await deriveKeyFromEmail(user.email, salt); // derives key from email

    const decrypted = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: iv },
      key,
      encryptedBuffer
    );

    const blob = new Blob([decrypted], {
      type: "application/octet-stream",
    });

    downloadBlob(blob, file.filename);
  } catch (err) {
    console.error("Inside decrypt file function: ", err);
  } finally {
    doneCallback(); // turn off the loading indicator
  }
};

// Helper: Trigger file download
const downloadBlob = (blob, filename) => {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  window.URL.revokeObjectURL(url);
};

export { encryptFile, decryptFile };