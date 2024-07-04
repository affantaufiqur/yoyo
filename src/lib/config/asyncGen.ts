export default async function* sendRequest(url: string, options: RequestInit = {}) {
	yield { status: 'fetching', data: null };
	const req = await fetch(url, options);
	yield { status: 'received', data: req };
	const parsed = await req.json();
	yield { status: 'parsed', data: parsed };
}

for await (const req of sendRequest('https://jsonplaceholder.typicode.com/todos/1')) {
	switch (req.status) {
		case 'fetching':
			console.log('fetching...');
			break;
		case 'received':
			console.log('received');
			break;
		case 'parsed':
			console.log('parsed', req.data);
			break;
	}
}
