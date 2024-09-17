import cron from 'node-cron';

import getPairData from '../../api/dex';
import Contract from '../../types/contract';
import { cache } from '../cache';
import { updateContract } from '../contract';

export const updateTokenPriceJob = async (): Promise<void[]> => {
	console.log('Updating token prices');
	const keys = cache.calledTokensCache.keys();

	const updatePromises = keys.map(async (key) => {
		const token = cache.calledTokensCache.get<Contract>(key);

		if (!token?._id) {
			console.error('Error updating token price: token is undefined or null');
			return;
		}

		try {
			const newData = await getPairData(token.contractId);
			const newMcap = newData.marketCap;
			const isMaxMcap = newMcap > token.maxMcap;

			token.currentMcap = newMcap;
			token.updatedAt = new Date();

			if (isMaxMcap) {
				token.maxMcap = newMcap;
				await updateContract(token._id, {
					maxMcap: newMcap,
					currentMcap: newMcap,
				});
			} else {
				await updateContract(token._id, {
					currentMcap: newMcap,
				});
			}

			cache.calledTokensCache.set(key, token);
		} catch (error) {
			console.error(
				`Error updating token price for ${token.contractId}:`,
				error,
			);
		}
	});

	return Promise.all(updatePromises);
};

// eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
cron.schedule('*/1 * * * *', () => {
	updateTokenPriceJob().catch((error) => {
		console.error('Error in cron job:', error);
	});
});
