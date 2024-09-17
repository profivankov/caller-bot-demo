import getPairData, { PairData } from '../../api/dex';
import { cache } from '.';

export const tryGetPairData = async (
	contractAddress: string,
): Promise<PairData> => {
	const cachedData = cache.pairDataCache.get(contractAddress);

	if (cachedData && typeof cachedData === 'object') {
		return cachedData as PairData;
	}

	const contractData = await getPairData(contractAddress);

	cache.pairDataCache.set(contractAddress, contractData);

	return contractData;
};
