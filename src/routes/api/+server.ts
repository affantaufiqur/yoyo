import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';

export type PostBodyType = {
	url: string;
	options: RequestInit;
	body: any;
};

export const POST: RequestHandler = async ({ request }) => {
	const body: PostBodyType = await request.json();

	if (!body.url) {
		return json(
			{ error: 'url is required' },
			{
				status: 400
			}
		);
	}

	const req = await fetch(body.url, body.options);
	const headers = Object.fromEntries(req.headers.entries());
	const parsed = await req.json();

	return json({
		data: parsed,
		status: req.status,
		headers
	});
};
