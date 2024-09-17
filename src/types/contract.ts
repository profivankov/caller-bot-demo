import { ObjectId } from 'mongodb';

export default interface Contract {
	contractId: string;
	symbol: string;
	chain: string;
	initialLiquity: number;
	initialMcap: number;
	currentMcap: number;
	maxMcap: number;
	maxMcapDate: Date;
	createdAt?: Date;
	updatedAt: Date;
	createdBy: string;
	chatId: string;
	_id?: ObjectId;
}
