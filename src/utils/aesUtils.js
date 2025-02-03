const AES = require('aes-js');
require('dotenv').config();

const encryptAES = (text) => {
  const key = Buffer.from(process.env.AES_KEY, 'utf8').slice(0, 16); // Ambil 16 byte pertama dari key
  let textBytes = AES.utils.utf8.toBytes(text);

  // Padding sesuai AES-128-ECB (PKCS7 padding)
  const paddingLength = 16 - (textBytes.length % 16);
  const paddedTextBytes = [...textBytes, ...Array(paddingLength).fill(paddingLength)];

  const aesEcb = new AES.ModeOfOperation.ecb(key);
  const encryptedBytes = aesEcb.encrypt(paddedTextBytes);
  return AES.utils.hex.fromBytes(encryptedBytes); // Ubah ke hex
};

const decryptAES = (encryptedHex) => {
  if (typeof encryptedHex !== 'string') {
    console.error("decryptAES Error: encryptedHex harus berupa string!", encryptedHex);
    encryptedHex = encryptedHex.toString('hex');
  }
  const key = Buffer.from(process.env.AES_KEY, 'utf8').slice(0, 16);
  const encryptedBytes = AES.utils.hex.toBytes(encryptedHex);

  const aesEcb = new AES.ModeOfOperation.ecb(key);
  const decryptedBytes = aesEcb.decrypt(encryptedBytes);

  // Hapus padding PKCS7
  const paddingLength = decryptedBytes[decryptedBytes.length - 1];
  return AES.utils.utf8.fromBytes(decryptedBytes.slice(0, -paddingLength));
};

module.exports = { encryptAES, decryptAES };
