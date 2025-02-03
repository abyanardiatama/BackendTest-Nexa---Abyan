const jwt = require("jsonwebtoken");
const { encryptAES, decryptAES } = require("../utils/aesUtils");
const db = require("../config/db");
require("dotenv").config();

// Fungsi untuk login dan mendapatkan token JWT
const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required" });
  }

  try {
    // Ambil password terenkripsi dalam format HEX
    const [rows] = await db.query(
      "SELECT HEX(password) AS password, id, username FROM admin WHERE username = ?", 
      [username]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Konversi password ke string untuk didekripsi
    const encryptedPassword = rows[0].password.toString();
    console.log("Encrypted Password from DB:", encryptedPassword, typeof encryptedPassword);

    // Dekripsi password
    const decryptedPassword = decryptAES(encryptedPassword);

    // Bandingkan password yang dimasukkan dengan password yang didekripsi
    if (decryptedPassword !== password) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: rows[0].id, username: rows[0].username }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1h' }
    );

    // Simpan token ke dalam database
    await db.query("INSERT INTO admin_token (admin_id, token) VALUES (?, ?)", [rows[0].id, token]);

    res.json({ message: "Login successful", token });
  } catch (err) {
    console.error("Error logging in:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { login };
