const TelegramBot = require("node-telegram-bot-api");
const { helpText, InValidCommand, mainMenuKeyboard, GlobalErrorMessage } = require("../lib/constant");

class Yosbot extends TelegramBot {
	constructor(token, options) {
		super(token, options);
		
		// Handler untuk /start
		this.onText(/^\/start$/, async (data) => {
			console.log("Get Start Executed By " + data.from.id);
			const botprofile = await this.getMe();
			this.sendMessage(data.from.id, helpText(botprofile.username), mainMenuKeyboard);
		});
		
		// Handler untuk callback query (tombol diklik)
		this.on("callback_query", async(callback) => {
			const callBackName = callback.data;
			const chatId = callback.from.id; 
			
			// Hapus loading
			this.answerCallbackQuery(callback.id);
			
			if(callBackName === "cmd_help") {
				const botprofile = await this.getMe(); // FIX: define botprofile
				this.sendMessage(chatId, helpText(botprofile.username), mainMenuKeyboard);
			}
			else if(callBackName === "cmd_gempa") {
				await this.HandleGempa(chatId); // FIX: tambah await
			} 
			else if(callBackName === "cmd_kata") {
				await this.HandleKataKata(chatId); // FIX: tambah await
			} 
			else if(callBackName === "cmd_berita") {
				await this.HandleBerita(chatId); // FIX: tambah await
			}
		else if(callBackName === "cmd_salam") {
			this.sendMessage(chatId, "Halo juga Sayangku💕!", mainMenuKeyboard);
		}
		else if(callBackName === "cmd_follow") {
			this.sendMessage(chatId, "Silahkan ketik pesan yang ingin kamu follow!", mainMenuKeyboard);
		}
		else if(callBackName === "cmd_stop") {
			await this.HandleStop(chatId);
		}
		else {
			this.sendMessage(chatId, GlobalErrorMessage, mainMenuKeyboard);
		}
		});
		
		// Handler untuk pesan selain command
		this.on("message", (data) => {
			if(data.text && data.text.startsWith('/start')) return; // skip /start
			
			// Tampilkan menu untuk pesan apapun
			this.sendMessage(data.from.id, "Silahkan pilih menu:", mainMenuKeyboard);
		});
	}
	
	// FIX: Langsung execute logic, JANGAN pakai this.onText()
	async HandleKataKata(chatId) {
		console.log("Get Quote Executed By " + chatId);
		const quotesEndpoint = "https://api.kanye.rest";
		
		try {
			const apiCall = await fetch(quotesEndpoint);
			const response = await apiCall.json();
			
			this.sendMessage(chatId, `💬 Kata kata hari ini:\n\n${response.quote}`, mainMenuKeyboard);
		} catch (error) {
			console.error(error);
			this.sendMessage(chatId, GlobalErrorMessage, mainMenuKeyboard);
		}
	}

	async HandleBerita(chatId) {
		console.log("Get News Executed By " + chatId);
		const newsEndpoint = "https://jakpost.vercel.app/api/category/indonesia";
		this.sendMessage(chatId, "⏳ Mohon tunggu...");
		
		try {
			const apiCall = await fetch(newsEndpoint);
			const response = await apiCall.json();
			const maxNews = 3;
			
			for (let i = 0; i < maxNews; i++) {
				const news = response.posts[i];
				const {title, image, headline, link} = news;
				await this.sendPhoto(chatId, image, {
					caption: `📰 ${title}\n\n${headline}\n\n🔗 ${link}`
				});
			}
			
			this.sendMessage(chatId, "Pilih menu lainnya:", mainMenuKeyboard);
		} catch (error) {
			console.error(error);
			this.sendMessage(chatId, GlobalErrorMessage, mainMenuKeyboard);
		}
	}

	async HandleGempa(chatId) {
		console.log("Get Quake Executed By " + chatId);
		const quakeEndpoint = "https://data.bmkg.go.id/DataMKG/TEWS/autogempa.json";
		this.sendMessage(chatId, "⏳ Mohon tunggu sedang mengambil data gempa bumi...");
		
		try {
			const apiCall = await fetch(quakeEndpoint);
			const response = await apiCall.json();
			const {gempa} = response.Infogempa;
			const { Tanggal, Jam, Magnitude, Wilayah, Shakemap, Kedalaman} = gempa;
			const imgShakemap = "https://data.bmkg.go.id/DataMKG/TEWS/" + Shakemap;
			
			await this.sendPhoto(chatId, imgShakemap, {
				caption: `🌍 Info Gempa bumi terbaru ${Tanggal} ${Jam}\n\n📊 Magnitude: ${Magnitude} SR\n📍 Wilayah: ${Wilayah}\n📏 Kedalaman: ${Kedalaman}`
			});
			
			this.sendMessage(chatId, "Pilih menu lainnya:", mainMenuKeyboard);
		} catch (error) {
			console.error(error);
			this.sendMessage(chatId, GlobalErrorMessage, mainMenuKeyboard);
		}
	}


	async HandleStop(chatId) {
		console.log("Get Stop Executed By " + chatId);
		this.sendMessage(chatId, "🛑 Bot berhenti bekerja!\n\nSilahkan ketik /start untuk memulai kembali.");
	}
}






module.exports = Yosbot;