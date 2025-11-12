const TelegramBot = require("node-telegram-bot-api");
const { helpText, InValidCommand, mainMenuKeyboard, GlobalErrorMessage } = require("../lib/constant");
const { marked } = require("marked");

marked.setOptions({
	mangle: false,
	headerIds: false
});

const telegramRenderer = new marked.Renderer();

telegramRenderer.paragraph = (text) => `${text}\n\n`;
telegramRenderer.heading = (text) => `<b>${text}</b>\n\n`;
telegramRenderer.link = (href, _title, text) => `<a href="${href}">${text}</a>`;
telegramRenderer.strong = (text) => `<b>${text}</b>`;
telegramRenderer.em = (text) => `<i>${text}</i>`;
telegramRenderer.codespan = (text) => `<code>${text}</code>`;
telegramRenderer.blockquote = (text) => `<blockquote>${text}</blockquote>\n\n`;
telegramRenderer.list = (body) => `${body}\n`;
telegramRenderer.listitem = (text) => `• ${text}\n`;
telegramRenderer.hr = () => `────────\n`;
telegramRenderer.image = (href, _title, text) => `${text ? `${text} ` : ""}${href}`;
telegramRenderer.code = (code) => `<pre><code>${code}</code></pre>\n`;

const renderMarkdownForTelegram = (markdown = "") =>
	marked.parse(markdown, { renderer: telegramRenderer }).trim();

const TELEGRAM_CAPTION_LIMIT = 1024;

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
			const posts = Array.isArray(response.posts) ? response.posts.slice(0, maxNews) : [];
			
			for (const news of posts) {
				const { title, image, headline, link, premium_badge } = news;
				const detailUrl = link;
				const articleUrl = detailUrl.replace("https://jakpost.vercel.app/api/detailpost", "https://www.thejakartapost.com");
				let postContent = "";

				try {
					const detailResponse = await fetch(detailUrl);
					if (detailResponse.ok) {
						const detail = await detailResponse.json();
						postContent = detail?.detail_post?.post_content?.trim() || "";
					}
				} catch (detailError) {
					console.error("Failed to get detail post:", detailError);
				}

				const captionParts = [`📰 ${title}`];
				if (headline) {
					captionParts.push("", headline);
				}
				captionParts.push("", `🔗 ${articleUrl}`);

				let caption = captionParts.join("\n");
				if (caption.length > TELEGRAM_CAPTION_LIMIT) {
					caption = `${caption.slice(0, TELEGRAM_CAPTION_LIMIT - 3)}...`;
				}

				await this.sendPhoto(chatId, image, {
					caption
				});

				if (postContent) {
					const htmlContent = renderMarkdownForTelegram(postContent);
					await this.sendMessage(chatId, htmlContent, {
						parse_mode: "HTML",
						disable_web_page_preview: true
					});
				} else if (premium_badge === "premium") {
				}
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
			const {Tanggal, Jam, Magnitude, Wilayah, Shakemap, Kedalaman} = gempa;
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