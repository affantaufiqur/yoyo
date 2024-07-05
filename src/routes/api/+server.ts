import type { RequestHandler } from "@sveltejs/kit";
import { json } from "@sveltejs/kit";

export type PostBodyType = {
	url: string;
	options: RequestInit;
	body: any;
};

export const POST: RequestHandler = async ({ request }) => {
	try {
		const body: PostBodyType = await request.json();

		if (!body.url) {
			return json(
				{ error: "url is required" },
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
	} catch (e) {
		return json({ error: e.message, message: "Internal Server Error" }, { status: 500 });
	}
};
