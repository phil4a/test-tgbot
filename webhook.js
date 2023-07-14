const axios = require('axios');

const botToken = '6335351112:AAGp6GSdfI7h1Nvb_i0fnhjUEQ8TFKAZfJo';
const webhookUrl = `http://185.18.55.156:443/webhook`;

// Установка URL Webhook
axios
	.post(`https://api.telegram.org/bot${botToken}/setWebhook?url=${webhookUrl}`)
	.then((response) => {
		console.log('Webhook установлен:', response.data);
	})
	.catch((error) => {
		console.error('Ошибка установки Webhook:', error);
	});
