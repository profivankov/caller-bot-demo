import { cache } from '.';

interface ActionData {
	contractAddress: string;
	userId: string | undefined;
}

export const saveActionData = (actionId: string, data: ActionData): void => {
	cache.actionCache.set(actionId, data);
};

export const getActionData = (actionId: string): ActionData | undefined => {
	return cache.actionCache.get<ActionData>(actionId);
};
