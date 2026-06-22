# Dashboard penjualan toko online

Upload file Excel faktur penjualan, dapat dashboard yang sama seperti yang dibuat di chat: ringkasan omset/order, tren harian, komposisi platform & brand, peringkat pelanggan, dan tabel pivot harian per pelanggan penagihan. Semua proses berjalan di browser — file tidak pernah dikirim ke server mana pun.

## Menjalankan di komputer sendiri

Butuh [Node.js](https://nodejs.org) versi 18 atau lebih baru.

```bash
npm install
npm run dev
```

Buka `http://localhost:5173` di browser.

## Deploy ke Vercel

### Cara tercepat — lewat web

1. Push folder ini ke repo GitHub (atau GitLab/Bitbucket).
2. Buka vercel.com/new, pilih repo tersebut.
3. Vercel otomatis mendeteksi framework Vite — biarkan default (`npm run build`, output `dist`). Klik Deploy.

### Cara lewat command line

```bash
npm install -g vercel
vercel
```

Ikuti prompt-nya. Setelah selesai, Vercel akan memberi URL live.

## Format file yang didukung

File `.xlsx` dengan kolom (nama kolom boleh sedikit beda kapitalisasi/spasi):
- `Tanggal` — tanggal transaksi
- `Pelanggan Penagihan` — format `PLATFORM / NAMA TOKO`, contoh `SHOPEE / SCELTA`
- `Total Faktur` — nilai transaksi dalam Rupiah

Baris ringkasan/total di akhir file (baris tanpa tanggal) otomatis diabaikan.

## Struktur kode

- `src/parseData.js` — baca file Excel, bersihkan data, hitung semua agregat (pivot, ranking, breakdown platform/brand)
- `src/App.jsx` — komponen utama yang merangkai semua bagian
- `src/UploadZone.jsx`, `SummaryCards.jsx`, `DailyTrendChart.jsx`, `BreakdownCharts.jsx`, `RankingTable.jsx`, `PivotTable.jsx` — komponen tampilan
- `src/exportExcel.js` — tombol Unduh sebagai Excel untuk dapat file `.xlsx` yang sama strukturnya dengan laporan awal
