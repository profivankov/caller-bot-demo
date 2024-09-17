import { MongoError, ObjectId, UpdateResult } from 'mongodb';

import config from '../../config';
import { getDB } from '../../database';
import Contract from '../../types/contract';

const db = await getDB();

export const createContract = async (contract: Contract): Promise<ObjectId> => {
	await db
		.collection('contracts')
		.createIndex({ contractId: 1, chatId: 1 }, { unique: true });

	try {
		const result = await db.collection('contracts').insertOne(contract);
		return result.insertedId;
	} catch (error) {
		if (error instanceof MongoError && error.code === 11000) {
			throw new Error(
				`Contract with ID ${contract.contractId} already exists.`,
			);
		}

		throw error;
	}
};

export const updateContract = async (
	_id: ObjectId,
	updates: Partial<Contract>,
): Promise<UpdateResult> =>
	db.collection('contracts').updateOne({ _id }, { $set: updates });

export const getAllActiveContracts = async (): Promise<Contract[]> => {
	const daysToFilter = config.daysToMonitor || 1;
	const dateThreshold = new Date();
	dateThreshold.setDate(dateThreshold.getDate() - daysToFilter);

	const contracts = await db
		.collection<Contract>('contracts')
		.find({
			updatedAt: { $gte: dateThreshold },
		})
		.toArray();

	return contracts;
};
