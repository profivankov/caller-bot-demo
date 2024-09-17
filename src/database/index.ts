import { Db, MongoClient, ServerApiVersion } from 'mongodb';

const dbName = 'mydatabase';
const dbConnString = process.env.DB_CONN_STRING;
let db: Db;

if (!dbConnString) {
	throw new Error('DB_CONN_STRING is not defined');
}

const client: MongoClient = new MongoClient(dbConnString, {
	serverApi: {
		version: ServerApiVersion.v1,
		strict: true,
		deprecationErrors: true,
	},
});

const connectToDatabase = async (): Promise<void> => {
	try {
		await client.connect();
		console.log('Connected to MongoDB');
		db = client.db(dbName);
	} catch (error) {
		console.error('Error connecting to MongoDB:', error);
		throw error;
	}
};

export const getDB = async (): Promise<Db> => {
	if (!db) {
		console.log('DB is not initialized yet. Waiting for connection...');
		await connectToDatabase();
	}
	return db!;
};
export { connectToDatabase };
