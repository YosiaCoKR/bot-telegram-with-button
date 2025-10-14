require("dotenv").config();
const YosBot = require("./app/YosBot");
const token = process.env.TOKENTELEGRAM;

const options = { polling: true };

console.log("Starting YosBot...");
const yosbot = new YosBot(token, options);

console.log("✅ Bot is running! Send /start to Telegram bot to begin.");