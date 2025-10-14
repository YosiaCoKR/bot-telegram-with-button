# 🤖 YosBot - Telegram Bot

YosBot adalah bot Telegram yang dibuat dengan penuh kasih sayang untuk memberikan informasi berguna seperti info gempa bumi, berita terkini, dan kata-kata motivasi.

## ✨ Fitur

- 🌍 **Info Gempa Bumi** - Menampilkan informasi gempa bumi terbaru dari BMKG (Badan Meteorologi, Klimatologi, dan Geofisika)
- 📰 **Berita Terkini** - Menampilkan 3 berita terbaru dari kategori Indonesia
- 💬 **Kata-kata Motivasi** - Menampilkan quotes motivasi harian
- 🔔 **Follow** - Fitur untuk follow update (dalam pengembangan)
- ❓ **Help** - Menampilkan panduan penggunaan bot
- 🛑 **Stop** - Menghentikan interaksi dengan bot

## 📋 Prasyarat

Sebelum menjalankan aplikasi ini, pastikan Anda telah menginstal:

- [Node.js](https://nodejs.org/) (versi 14 atau lebih baru)
- [npm](https://www.npmjs.com/) (biasanya sudah termasuk dengan Node.js)
- Akun Telegram
- Token Bot Telegram (dapatkan dari [@BotFather](https://t.me/botfather))

## 🚀 Instalasi

1. **Clone repository ini**
   ```bash
   git clone <repository-url>
   cd yosbot
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Konfigurasi Environment Variables**
   
   Buat file `.env` di root directory dan tambahkan token bot Telegram Anda:
   ```env
   TOKENTELEGRAM=your_telegram_bot_token_here
   ```

   Untuk mendapatkan token:
   - Buka Telegram dan cari [@BotFather](https://t.me/botfather)
   - Kirim command `/newbot`
   - Ikuti instruksi untuk membuat bot baru
   - Copy token yang diberikan dan paste ke file `.env`

## 🎮 Cara Menjalankan

### Mode Production
```bash
node main.js
```

### Mode Development (dengan auto-reload)
```bash
npm run dev
```

Setelah bot berjalan, Anda akan melihat pesan:
```
Starting YosBot...
✅ Bot is running! Send /start to Telegram bot to begin.
```

## 📱 Cara Menggunakan Bot

1. Buka Telegram dan cari bot Anda menggunakan username yang telah dibuat
2. Klik tombol **Start** atau ketik `/start`
3. Bot akan menampilkan menu dengan tombol interaktif:
   - 🌍 **Info Gempa** - Melihat gempa bumi terbaru
   - 📰 **Berita** - Membaca berita terkini
   - 💬 **Kata Kata** - Mendapatkan quotes motivasi
   - 🔔 **Follow** - Follow update bot
   - ❓ **Help** - Melihat panduan
   - 🛑 **Stop** - Menghentikan bot

4. Klik tombol menu yang diinginkan untuk mengakses fitur

## 🏗️ Struktur Proyek

```
yosbot/
├── app/
│   └── YosBot.js          # Class utama bot dengan semua handler
├── lib/
│   ├── commands.js        # Definisi regex commands
│   └── constant.js        # Konstanta dan konfigurasi UI
├── main.js                # Entry point aplikasi
├── package.json           # Dependencies dan scripts
├── .env                   # Environment variables (tidak di-commit)
└── README.md             # Dokumentasi
```

## 🔧 Dependencies

- **node-telegram-bot-api** (^0.66.0) - Library untuk membuat bot Telegram
- **dotenv** (^17.2.3) - Untuk mengelola environment variables

## 📡 API yang Digunakan

Bot ini mengintegrasikan beberapa API publik:

1. **BMKG API** - Info gempa bumi
   - Endpoint: `https://data.bmkg.go.id/DataMKG/TEWS/autogempa.json`
   - Data: Tanggal, waktu, magnitude, wilayah, kedalaman, dan peta shakemap

2. **Kanye Rest API** - Quotes motivasi
   - Endpoint: `https://api.kanye.rest`
   - Data: Quote harian

3. **Jakarta Post API** - Berita Indonesia
   - Endpoint: `https://jakpost.vercel.app/api/category/indonesia`
   - Data: Judul, gambar, headline, dan link berita

## 🛠️ Development

Struktur kode menggunakan:
- **Class-based approach** - YosBot extends TelegramBot
- **Async/Await** - Untuk handling operasi asynchronous
- **Callback Query** - Untuk interactive buttons
- **Error Handling** - Try-catch pada setiap API call

### Menambah Fitur Baru

1. Buka file `app/YosBot.js`
2. Tambahkan callback handler di constructor:
   ```javascript
   else if(callBackName === "cmd_custom") {
       await this.HandleCustom(chatId);
   }
   ```
3. Buat method handler baru:
   ```javascript
   async HandleCustom(chatId) {
       // Logic fitur Anda
   }
   ```
4. Tambahkan button di `lib/constant.js` pada `mainMenuKeyboard`

## ⚠️ Troubleshooting

### Bot tidak merespon
- Pastikan token bot benar di file `.env`
- Cek koneksi internet
- Pastikan bot sudah di-start dengan `/start`

### Error saat install dependencies
```bash
rm -rf node_modules package-lock.json
npm install
```

### Bot error saat fetch API
- Cek koneksi internet
- Pastikan API endpoint masih aktif
- Lihat error message di console

## 📝 Scripts

- `npm run dev` - Menjalankan bot dalam mode development dengan nodemon
- `npm test` - Menjalankan test (belum diimplementasi)

## 👨‍💻 Author

**yosiaaasp**

## 📄 License

ISC

## 🤝 Contributing

Contributions, issues, dan feature requests sangat diterima!

## ⭐ Support

Jika project ini membantu Anda, berikan ⭐️!

---

**Happy Coding! 🚀**

