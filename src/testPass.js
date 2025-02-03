const { encryptAES, decryptAES } = require('./utils/aesUtils');

const password = "databaru";

// Enkripsi password
const encryptedPassword = encryptAES(password);
console.log("Encrypted Password:", encryptedPassword);

// Dekripsi password
const decryptedPassword = decryptAES(encryptedPassword);
console.log("Decrypted Password:", decryptedPassword);