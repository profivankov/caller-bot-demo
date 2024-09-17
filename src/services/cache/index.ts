import NodeCache from 'node-cache';

import config from '../../config';

export const cache = {
	// All called tokens with their partial info cached for a set amount of days
	calledTokensCache: new NodeCache({
		stdTTL: config.daysToMonitor * 24 * 60 * 60,
		checkperiod: 60 * 60,
	}),

	// DexScreener API response filled objects stored for 100 seconds to reduce redundant API calls
	pairDataCache: new NodeCache({
		stdTTL: 100,
		checkperiod: 120,
	}),

	// Cache for passing data between Telegram commands and callbacks as the native callback data is limited at 64 characters
	actionCache: new NodeCache({ stdTTL: 600, checkperiod: 120 }),
};
