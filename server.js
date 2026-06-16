const express = require('express');
const path = require('path');
const app = express();

const port = process.env.PORT || 3000;

// Serve semua file statis di direktori saat ini (termasuk css dan js)
app.use(express.static(path.join(__dirname, '')));

// Jika ada yang mengakses root (/), tampilkan index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Export app untuk Vercel (Serverless Function)
module.exports = app;

// Hanya jalankan server jika file ini dijalankan langsung (bukan diimpor oleh Vercel)
if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server berjalan di port ${port}`);
  });
}
