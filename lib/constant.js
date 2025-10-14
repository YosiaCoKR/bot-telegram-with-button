

function helpText(bot) {
	return `Selamat datang di ${bot}, berikut adalah perintah yang tersedia :

Perintah yang tersedia :
!halo - Menampilkan pesan selamat datang
!follow - Menampilkan pesan selamat datang
!quotes - Menampilkan kata kata hari ini bang bot
!news - Menampilkan berita terbaru
!quake - Menampilkan info gempa bumi terbaru
!help - Menampilkan pesan bantuan`;
}

const InValidCommand = "Maaf, perintah tidak valid. Silahkan gunakan perintah yang tersedia.";


const GlobalErrorMessage = "Maaf, Terjadi kesalahan, silahkan coba lagi nanti.🙏";
const ErrorPollingMessage = "Terjadi Kesalahan dengan sistem. Silahkan coba lagi nanti.🙏";


const mainMenuKeyboard ={
	reply_markup: {
		inline_keyboard: [
			[
				{text: "🌍 Info Gempa", callback_data: "cmd_gempa"},
				{text: "📰 Berita", callback_data: "cmd_berita"},
			],
			[
				{text: "💬 Kata Kata", callback_data: "cmd_kata"},
				{text: "🔔 Follow", callback_data: "cmd_follow"},
			],
			[
				{text: "❓ Help", callback_data: "cmd_help"},
				{text: "🛑 Stop", callback_data: "cmd_stop"},
			]
		]
	}
}


module.exports = { helpText, InValidCommand, GlobalErrorMessage, ErrorPollingMessage, mainMenuKeyboard };