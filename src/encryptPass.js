const { encryptAES } = require('./utils/aesUtils');

// Password yang ingin dienkripsi
const password = 'databaru';
const encryptedPassword = encryptAES(password);
console.log('Encrypted Password:', encryptedPassword);
