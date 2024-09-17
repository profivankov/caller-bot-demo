import process from 'process';

import { connectToDatabase } from './database';
import { updateTokenPriceJob } from './services/async';
import { loadCalledTokensToCache } from './services/cache/calledTokens';
import { bot, init, sendInitializationMessage } from './services/telegram';

const logger = console;

const startApp = async (): Promise<void> => {
	try {
		await connectToDatabase();
		await sendInitializationMessage('Connected to database.');
	} catch (error) {
		if (error instanceof Error) {
			await sendInitializationMessage(`${error.name}: ${error.message}`);
		} else {
			const errorMessage = String(error);
			await sendInitializationMessage(`Unknown Error: ${errorMessage}`);
		}
		logger.error('Failed to connect to database, exiting.');
		process.exit(1);
	}

	try {
		await loadCalledTokensToCache();
		await updateTokenPriceJob();
	} catch (error) {
		logger.error('Error during loading cache:', error);
	}

	try {
		await init();
		await sendInitializationMessage('Caller bot initialized.');
	} catch (error) {
		logger.error(error);
		process.exit(1);
	}
};

void (async (): Promise<void> => {
	try {
		await startApp();
	} catch (error) {
		logger.error('Unexpected error during startup:', error);
		process.exit(1);
	}
})();

const gracefulShutdown = (): void => {
	try {
		logger.log('Shutting down gracefully...');
		bot.stop();
		process.exit(0);
	} catch (err) {
		logger.error('Error during shutdown:', err);
		process.exit(1);
	}
};

process.on('SIGINT', () => void gracefulShutdown());
process.on('SIGTERM', () => void gracefulShutdown());
