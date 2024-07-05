export type PostBodyType = {
	url: string;
	options: RequestInit;
	body: any;
};

export type FetchResult = {
	headers: Record<string, string>;
	status: number;
	data: any;
};

export type Params = {
	id: string;
	key: string;
	value: string;
};
