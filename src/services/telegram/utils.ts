export const formatMarketCap = (marketCap: number): string => {
	if (marketCap >= 1e6) {
		return `$${(marketCap / 1e6).toFixed(2)}M`;
	}
	if (marketCap >= 1e3) {
		return `$${(marketCap / 1e3).toFixed(2)}K`;
	}
	return `$${marketCap.toFixed(2)}`;
};

export const escapeMarkdown = (input: string | number): string => {
	if (input === undefined || input === null) {
		return 'undefined';
	}

	let text: string;
	if (typeof input === 'number') {
		text = input.toLocaleString('en-US', {
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
		});
	} else {
		text = input.toString();
	}

	return text.replace(/[_*[\]()~`>#+\-=|{}.!]/g, '\\$&');
};
