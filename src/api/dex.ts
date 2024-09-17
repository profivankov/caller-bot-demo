import { z } from 'zod';

import fetchJson from './helpers/fetchJson';

const TokenInfoSchema = z.object({
	address: z.string(),
	name: z.string(),
	symbol: z.string(),
});

const PairDataSchema = z
	.object({
		chainId: z.string(),
		dexId: z.string(),
		url: z.string(),
		pairAddress: z.string(),
		baseToken: TokenInfoSchema,
		quoteToken: TokenInfoSchema,
		priceNative: z.string(),
		priceUsd: z.string(),
		liquidity: z.object({
			usd: z.number(),
			base: z.number(),
			quote: z.number(),
		}),
		marketCap: z.number(),
		fdv: z.number(),
		pairCreatedAt: z.number(),
		info: z
			.object({
				imageUrl: z.string().optional(),
				websites: z.array(
					z.object({
						label: z.string(),
						url: z.string(),
					}),
				),
				socials: z.array(
					z.object({
						type: z.string(),
						url: z.string(),
					}),
				),
			})
			.optional(),
	})
	.passthrough();

const ApiResponseSchema = z.object({
	schemaVersion: z.string(),
	pairs: z.array(PairDataSchema),
});

export type PairData = z.infer<typeof PairDataSchema>;

/**
 * Function to get pair data from the API.
 * @param {string} contractId - ID of the pair
 * @returns {Promise<PairData>} - a promise that resolves to the pair data object
 */
const getPairData = async (contractId: string): Promise<PairData> => {
	const url = `https://api.dexscreener.com/latest/dex/search?q=${contractId}`;

	try {
		const data = await fetchJson(url, ApiResponseSchema);

		if (!data.pairs || data.pairs.length === 0) {
			throw new Error('No pair data found');
		}

		return data.pairs[0];
	} catch (error) {
		console.error('Error fetching pair data:', error);
		throw error;
	}
};

export default getPairData;
