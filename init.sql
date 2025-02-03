-- Pembuatan Database jika belum ada
CREATE DATABASE IF NOT EXISTS gmedia_democase;

-- Menggunakan database yang baru saja dibuat atau sudah ada
-- USE gmedia_democase;

-- Pembuatan Tabel-tabel yang diperlukan

CREATE TABLE IF NOT EXISTS admin (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARBINARY(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS admin_token (
    id INT AUTO_INCREMENT PRIMARY KEY,
    admin_id INT NOT NULL,
    token TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (admin_id) REFERENCES admin(id) ON DELETE CASCADE
);

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

CREATE TABLE IF NOT EXISTS log_trx_api (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nip VARCHAR(10) NOT NULL,
    action VARCHAR(50) NOT NULL,
    result VARCHAR(10) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Pembuatan Store Procedure untuk menambah karyawan baru
DELIMITER $$

CREATE PROCEDURE sp_add_kary_abyan(
    IN p_nama VARCHAR(100),
    IN p_alamat TEXT,
    IN p_gender ENUM('L', 'P'),
    IN p_tanggal_lahir DATE,
    IN p_photo TEXT
)
BEGIN
    DECLARE v_nip VARCHAR(10);
    DECLARE v_count INT;
    DECLARE v_year CHAR(4);

    -- Tangani error jika terjadi kegagalan transaksi
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        -- Rollback transaksi jika ada kesalahan
        ROLLBACK;
        INSERT INTO log_trx_api (nip, action, result, created_at) 
        VALUES (v_nip, 'Insert', 'Failed: Transaction Error', NOW());
    END;

    -- Mulai transaksi
    START TRANSACTION;

    -- Ambil tahun saat ini
    SET v_year = YEAR(NOW());

    -- Cari jumlah karyawan yang sudah ada tahun ini
    SELECT COUNT(*) + 1 INTO v_count FROM karyawan WHERE LEFT(nip, 4) = v_year;

    -- Buat NIP dengan format YYYYxxxx
    SET v_nip = CONCAT(v_year, LPAD(v_count, 4, '0'));

    -- Cek apakah NIP sudah ada
    IF EXISTS (SELECT 1 FROM karyawan WHERE nip = v_nip) THEN
        -- Jika sudah ada, simpan log gagal dan rollback
        INSERT INTO log_trx_api (nip, action, result, created_at) 
        VALUES (v_nip, 'Insert', 'Failed: Duplicate NIP', NOW());
        ROLLBACK;
    ELSE
        -- Simpan data karyawan baru
        INSERT INTO karyawan (nip, nama, alamat, gender, tanggal_lahir, photo)
        VALUES (v_nip, p_nama, p_alamat, p_gender, p_tanggal_lahir, p_photo);

        -- Simpan log transaksi
        INSERT INTO log_trx_api (nip, action, result, created_at) 
        VALUES (v_nip, 'Insert', 'Success', NOW());

        -- Jika semua berhasil, commit transaksi
        COMMIT;
    END IF;
END $$

DELIMITER ;

-- Pembuatan View untuk menampilkan data karyawan
CREATE VIEW karyawan_abyan AS
SELECT 
    ROW_NUMBER() OVER (ORDER BY nip) AS No,
    nip,
    nama,
    alamat,
    CASE 
        WHEN gender = 'L' THEN 'Laki - Laki' 
        WHEN gender = 'P' THEN 'Perempuan' 
    END AS Gend,
    DATE_FORMAT(tanggal_lahir, '%d %M %Y') AS Tanggal_Lahir
FROM 
    karyawan;

-- add admin data 'testdata' with password aes encrypt 'databaru'
INSERT INTO admin (username, password) VALUES ('testdata', AES_ENCRYPT('databaru', 'nexatest12345678'));