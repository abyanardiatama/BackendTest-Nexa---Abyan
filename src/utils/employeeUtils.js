const db = require("../config/db");

const generateNIP = async () => {
  // Ambil tahun sekarang
  const year = new Date().getFullYear();

  // Ambil counter terakhir NIP yang digunakan
  const [rows] = await db.query("SELECT nip FROM karyawan WHERE nip LIKE ?", [`${year}%`]);

  const lastNIP = rows[rows.length - 1]?.nip || `${year}0000`;
  const counter = parseInt(lastNIP.slice(4)) + 1;
  const newNIP = `${year}${String(counter).padStart(4, "0")}`;

  return newNIP;
};

module.exports = { generateNIP };
