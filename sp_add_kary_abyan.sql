DELIMITER $$

CREATE PROCEDURE sp_add_kary_abyan(
    IN p_nip VARCHAR(10),
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
