CREATE VIEW karyawan_nexa AS
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
