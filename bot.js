const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');
const axios = require('axios');

// Замените <YOUR_BOT_TOKEN> на токен вашего бота, полученный от BotFather
const token = '6335351112:AAGp6GSdfI7h1Nvb_i0fnhjUEQ8TFKAZfJo';
const bot = new TelegramBot(token, { polling: true });

// Обработка текстовых сообщений
bot.on('message', async (msg) => {
	const chatId = msg.chat.id;
	const messageText = msg.text;
	const username = msg.from.username || msg.from.first_name; // Получаем имя пользователя

	if (messageText === '/start') {
		// Приветственное сообщение
		bot.sendMessage(chatId, `Привет, ${username}!`);
		bot.sendMessage(chatId, 'Какой у вас город?');
	} else {
		try {
			// Запрос погоды с использованием OpenWeatherMap API
			const weatherData = await getWeather(messageText);

			// Отправка погодных данных в чат
			bot.sendMessage(chatId, `Погода в городе ${messageText}:`);
			bot.sendMessage(chatId, `Температура: ${weatherData.main.temp}°C`);
			bot.sendMessage(chatId, `Ощущается как: ${weatherData.main.feels_like}°C`);
			bot.sendMessage(chatId, `Скорость ветра: ${weatherData.wind.speed} м/с`);

			// Сохранение запроса в файл
			saveRequest(username, messageText, weatherData.main.temp);
		} catch (error) {
			if (error.response && error.response.status === 404) {
				// Город не найден
				bot.sendMessage(
					chatId,
					'Город не найден. Пожалуйста, проверьте правильность написания названия.',
				);
			} else if (error.response && error.response.status === 400) {
				// Некорректный запрос
				bot.sendMessage(
					chatId,
					'Некорректный запрос. Пожалуйста, укажите правильное название города.',
				);
			} else {
				bot.sendMessage(chatId, 'Произошла ошибка при получении погоды.');
			}
		}
	}
});

// Функция для получения погоды с использованием OpenWeatherMap API
async function getWeather(city) {
	const apiKey = '0492bac8dc4a32a0ce2d75bfb0cf6499';
	const apiUrl = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

	try {
		const response = await axios.get(apiUrl);
		return response.data;
	} catch (error) {
		throw error;
	}
}

// Функция для сохранения запроса в файл
function saveRequest(username, city, temperature) {
	const requestData = {
		username,
		city,
		temperature,
		timestamp: new Date().toISOString(),
	};

	fs.appendFile('log.json', JSON.stringify(requestData) + '\n', (err) => {
		if (err) {
			console.error('Ошибка при сохранении запроса:', err);
		}
	});
}
