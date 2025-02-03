const db = require("./db");

const createTables = async () => {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS admin (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password VARBINARY(100) NOT NULL
      );
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS admin_token (
        id INT AUTO_INCREMENT PRIMARY KEY,
        admin_id INT NOT NULL,
        token TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (admin_id) REFERENCES admin(id) ON DELETE CASCADE
      );
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS karyawan (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nip VARCHAR(10) UNIQUE NOT NULL,
        nama VARCHAR(100) NOT NULL,
        alamat TEXT NOT NULL,
        gender ENUM('L', 'P') NOT NULL,
        tanggal_lahir DATE NOT NULL,
        photo TEXT NOT NULL,
        status INT DEFAULT 1
      );
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS log_trx_api (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nip VARCHAR(10) NOT NULL,
        action VARCHAR(50) NOT NULL,
        result VARCHAR(10) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("Tables created successfully.");
  } catch (err) {
    console.error("Error creating tables:", err);
  }
};

//add user admin username: testdata, password: databaru (AES encrypted)
const addAdmin = async () => {
  try {
    const [rows] = await db.query("SELECT * FROM admin WHERE username = 'testdata'");
    if (rows.length === 0) {
      const encryptedPassword = "U2FsdGVkX1+VjZ2zr8Yd7KZr5Z8w3q6Q";
      await db.query("INSERT INTO admin (username, password) VALUES ('testdata', ?)", [encryptedPassword]);
      console.log("Admin user added successfully.");
    } else {
      console.log("Admin user already exists.");
    }
  } catch (err) {
    console.error("Error adding admin user:", err);
  }
};

createTables();
addAdmin();
