const db = require("../config/db");
const { validateEmployeeData, generateNIP } = require("../utils/employeeUtils");

// Fungsi untuk menambah karyawan baru
const addEmployee = async (req, res) => {
  const { name, address, gender, birthDate, photo } = req.body;

  // Validasi data karyawan
  if (!name || !address || !gender || !birthDate || !photo) {
    return res.status(400).json({ error: "All fields are required" });
  }

  // Validasi format photo base64
  if (!/^data:image\/(png|jpg|jpeg);base64,/.test(photo)) {
    return res.status(400).json({ error: "Invalid photo format" });
  }

  try {
    // Generate NIP (YYYYxxxx)
    const nip = await generateNIP();

    // Simpan data karyawan ke dalam database
    await db.query(
      "INSERT INTO karyawan (nip, nama, alamat, gender, tanggal_lahir, photo, status) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [nip, name, address, gender, birthDate, photo, 1] // Status 1 = Aktif
    );

    res.status(201).json({ message: "Employee added successfully", nip });
  } catch (err) {
    console.error("Error adding employee:", err);
    res.status(500).json({ error: "Failed to add employee" });
  }
};

// Fungsi untuk mendapatkan daftar karyawan
const getEmployees = async (req, res) => {
    const { keyword, start, count } = req.query;
  
    try {
      const query = `SELECT * FROM karyawan WHERE nama LIKE ? LIMIT ?, ?`;
      const [rows] = await db.query(query, [`%${keyword}%`, parseInt(start) || 0, parseInt(count) || 10]);
  
      if (rows.length === 0) {
        return res.status(404).json({ error: "No employees found" });
      }
  
      res.json({ employees: rows });
    } catch (err) {
      console.error("Error fetching employees:", err);
      res.status(500).json({ error: "Failed to fetch employees" });
    }
  };

// Fungsi untuk update data karyawan
const updateEmployee = async (req, res) => {
    const { nip } = req.params;
    const { name, address, gender, birthDate, photo } = req.body;
  
    // Validasi data karyawan
    if (!name || !address || !gender || !birthDate || !photo) {
      return res.status(400).json({ error: "All fields are required" });
    }
  
    // Validasi format photo base64
    if (!/^data:image\/(png|jpg|jpeg);base64,/.test(photo)) {
      return res.status(400).json({ error: "Invalid photo format" });
    }
  
    try {
      // Perbarui data karyawan berdasarkan NIP
      const [result] = await db.query(
        "UPDATE karyawan SET nama = ?, alamat = ?, gender = ?, tanggal_lahir = ?, photo = ? WHERE nip = ?",
        [name, address, gender, birthDate, photo, nip]
      );
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Employee not found" });
      }
  
      res.status(200).json({ message: "Employee updated successfully" });
    } catch (err) {
      console.error("Error updating employee:", err);
      res.status(500).json({ error: "Failed to update employee" });
    }
  };
  
// Fungsi untuk menonaktifkan karyawan
const deactivateEmployee = async (req, res) => {
    const { nip } = req.params;
  
    try {
      // Ubah status karyawan menjadi 9 (nonaktif)
      const [result] = await db.query(
        "UPDATE karyawan SET status = ? WHERE nip = ?",
        [9, nip]
      );
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Employee not found" });
      }
  
      res.status(200).json({ message: "Employee deactivated successfully" });
    } catch (err) {
      console.error("Error deactivating employee:", err);
      res.status(500).json({ error: "Failed to deactivate employee" });
    }
  };

module.exports = { addEmployee, getEmployees, updateEmployee, deactivateEmployee };
