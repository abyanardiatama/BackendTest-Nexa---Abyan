```markdown
# BackendTest Nexa - Abyan

## Deskripsi Proyek
Proyek ini adalah API backend untuk manajemen karyawan yang dibangun menggunakan **Express.js**. API ini dilengkapi dengan fitur otentikasi menggunakan JWT, serta pengelolaan data karyawan yang meliputi registrasi, update, pencarian, dan penonaktifan karyawan. Proyek ini juga mengimplementasikan store procedure dan view di database MySQL untuk mendukung operasional API.

### Fitur
1. **Otentikasi Token**: Mendapatkan token JWT untuk autentikasi pengguna.
2. **Registrasi Karyawan**: Menambahkan karyawan baru dengan format NIP unik.
3. **Daftar Karyawan**: Mengambil data karyawan dengan fitur pencarian dan pagination.
4. **Update Karyawan**: Memperbarui data karyawan berdasarkan NIP.
5. **Nonaktifkan Karyawan**: Menonaktifkan karyawan dengan merubah statusnya.
6. **Store Procedure**: Menambah data karyawan dan mencatat transaksi ke dalam tabel log.
7. **View Karyawan**: Menampilkan data karyawan dalam format yang mudah dibaca.

## Teknologi yang Digunakan
- **Backend**: Express.js
- **Database**: MySQL
- **Autentikasi**: JWT (JSON Web Token)
- **Gambar**: Base64 encoding untuk foto karyawan
- **Docker**: Untuk memudahkan pengembangan dan distribusi aplikasi

## Instalasi

### 1. Clone Repository
```bash
git clone https://github.com/username/BackendTest-Nexa-{NamaAnda}.git
cd BackendTest-Nexa-{NamaAnda}
```

### 2. Instalasi Dependensi
Install dependensi menggunakan npm:
```bash
npm install
```

### 3. Menjalankan Proyek dengan Docker

Jika Anda menggunakan Docker, jalankan perintah berikut untuk membangun dan menjalankan aplikasi:
```bash
docker-compose up --build
```

Jika Anda tidak menggunakan Docker, pastikan untuk mengatur database MySQL dan konfigurasi koneksi di file `.env`.

### 4. Konfigurasi Database
Pastikan Anda memiliki akses ke database MySQL dengan kredensial berikut:
- **Hostname**: `gmedia.bz`
- **Username**: `gmedia_democase2`
- **Password**: `Janglidalam29J`
- **Database**: `gmedia_democase`
- **Port**: `3306`

### 5. Menjalankan Aplikasi
Jika Anda tidak menggunakan Docker, jalankan aplikasi menggunakan Node.js:
```bash
npm start
```
API akan tersedia di `http://localhost:3000`.

## Penggunaan API

### 1. Mendapatkan Token
**Endpoint:** `/auth/login`  
**Method:** `POST`  
**Body:**
```json
{
  "username": "testdata",
  "password": "databaru"
}
```
**Response:**
```json
{
  "token": "JWT_TOKEN"
}
```

### 2. Mendaftarkan Karyawan Baru
**Endpoint:** `/employees`  
**Method:** `POST`  
**Headers:**  
```json
{
  "Authorization": "Bearer JWT_TOKEN"
}
```
**Body:**
```json
{
  "nip": "YYYY1234",
  "nama": "John Doe",
  "alamat": "123 Street",
  "gender": "L",
  "tanggal_lahir": "1990-05-10",
  "photo": "data:image/png;base64,..."
}
```

### 3. Mendapatkan Daftar Karyawan
**Endpoint:** `/employees`  
**Method:** `GET`  
**Query Params:**
- `keyword`: "John"
- `start`: 0
- `count`: 10

**Headers:**  
```json
{
  "Authorization": "Bearer JWT_TOKEN"
}
```

### 4. Update Karyawan
**Endpoint:** `/employees/{nip}`  
**Method:** `PUT`  
**Headers:**  
```json
{
  "Authorization": "Bearer JWT_TOKEN"
}
```
**Body:**
```json
{
  "nama": "John Smith",
  "alamat": "456 Avenue",
  "gender": "L",
  "tanggal_lahir": "1990-05-10",
  "photo": "data:image/png;base64,..."
}
```

### 5. Nonaktifkan Karyawan
**Endpoint:** `/employees/{nip}/deactivate`  
**Method:** `PATCH`  
**Headers:**  
```json
{
  "Authorization": "Bearer JWT_TOKEN"
}
```

## Struktur Proyek

```
├── Dockerfile
├── docker-compose.yml
├── server.js
├── controllers/
│   ├── authController.js
│   ├── employeeController.js
├── models/
│   ├── employee.js
│   ├── log.js
│   ├── token.js
├── routes/
│   ├── authRoutes.js
│   ├── employeeRoutes.js
├── utils/
│   ├── authUtils.js
├── .env
├── package.json
└── README.md
```

## Catatan Penggunaan Docker
- Proyek ini menggunakan **Docker** untuk mempermudah pengaturan lingkungan dan menjalankan aplikasi.
- Pastikan untuk mengatur file `.env` dengan variabel yang sesuai untuk database MySQL.
- Anda dapat membangun dan menjalankan proyek dengan perintah `docker-compose up --build`.

## Lisensi
Proyek ini bersifat open-source dan tersedia di bawah **MIT License**.

---

**Happy Coding!**
```

---

Ini adalah struktur dasar untuk file **`README.md`** Anda. Pastikan untuk mengganti bagian `username` dan `NamaAnda` dengan yang sesuai. Setelah selesai, Anda dapat mem-push file ini ke repositori GitHub atau GitLab Anda.
