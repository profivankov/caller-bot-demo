import Contract from '../../types/contract';
import { getAllActiveContracts } from '../contract';
import { cache } from '.';

const saveCalledTokenToCache = (token: Contract): void => {
	const cacheKey = `${token.contractId}_${token.chatId}`;
	cache.calledTokensCache.set(cacheKey, token);
};

const loadCalledTokensToCache = async (): Promise<void> => {
	const calledTokens: Contract[] = await getAllActiveContracts();
	calledTokens.forEach((token) => {
		const cacheKey = `${token.contractId}_${token.chatId}`;
		cache.calledTokensCache.set(cacheKey, token);
	});
	console.log('Called tokens loaded into cache.');
};

const tryGetCachedTokenInfo = (
	contractId: string,
	chatId: string,
): Contract | undefined => {
	const cacheKey = `${contractId}_${chatId}`;
	return cache.calledTokensCache.get<Contract>(cacheKey);
};

const tryGetCachedTokensByName = (userName: string): Contract[] => {
	const matchingTokens: Contract[] = [];

	const cacheKeys = cache.calledTokensCache.keys();

	cacheKeys.forEach((key) => {
		const token = cache.calledTokensCache.get<Contract>(key);
		if (token && token.createdBy === userName) {
			matchingTokens.push(token);
		}
	});

	return matchingTokens;
};

const tryGetLastTenCachedTokens = (): Contract[] => {
	const allTokens: Contract[] = [];

	const cacheKeys = cache.calledTokensCache.keys();

	cacheKeys.forEach((key) => {
		const token = cache.calledTokensCache.get<Contract>(key);
		if (token) {
			allTokens.push(token);
		}
	});

	allTokens.sort((a, b) => (a.updatedAt > b.updatedAt ? -1 : 1));

	return allTokens.slice(0, 10);
};

export {
	loadCalledTokensToCache,
	saveCalledTokenToCache,
	tryGetCachedTokenInfo,
	tryGetCachedTokensByName,
	tryGetLastTenCachedTokens,
};
