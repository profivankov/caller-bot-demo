import { promises as fs } from 'fs';
import { Telegraf } from 'telegraf';

let activeChatIds = new Set<string | number>();

export const loadChatIds = async (): Promise<void> => {
	try {
		const data = await fs.readFile('activeChats.json', 'utf-8');
		const parsedData = JSON.parse(data) as (string | number)[] | undefined;

		if (Array.isArray(parsedData)) {
			activeChatIds = new Set(parsedData);
			console.log('Active chat ids loaded.');
			return;
		} else {
			console.error('Failed to load chat IDs: Invalid data format');
			activeChatIds = new Set();
			return;
		}
	} catch (error) {
		console.error('Failed to load chat IDs:', error);
	}

	return;
};

const saveChatIds = async (): Promise<void> => {
	try {
		await fs.writeFile('activeChats.json', JSON.stringify([...activeChatIds]));
		console.log('Chat IDs saved.');
	} catch (error) {
		console.error('Failed to save chat IDs:', error);
	}
};

export const addChatId = async (chatId: string | number): Promise<void> => {
	activeChatIds.add(chatId);
	console.log(`Chat ID added: ${chatId}`);
	await saveChatIds();
};

export const setupActiveChatListener = (bot: Telegraf): void => {
	bot.on('new_chat_members', async (ctx) => {
		const chatId = ctx.chat.id;
		await addChatId(chatId);
		console.log(`Bot added to a new chat: ${chatId}`);
	});
};

export const getActiveChatIds = (): Set<string | number> => {
	return activeChatIds;
};
