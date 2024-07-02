import { EditorState, type Extension } from '@codemirror/state';
import { EditorView, minimalSetup } from 'codemirror';
import { EditorView as ViewEditor } from '@codemirror/view';
import {
	autocompletion,
	type Completion,
	type CompletionContext,
	type CompletionResult
} from '@codemirror/autocomplete';

export const editorTheme = ViewEditor.theme(
	{
		'&': {
			color: 'white',
			backgroundColor: 'rgb(31 41 55)',
			'border-radius': '2px',
			border: '1px solid #6b7280'
		},
		'.cm-content': {
			caretColor: '#0e9'
		}
	},
	{ dark: true }
);

export const editorView = (parent: HTMLDivElement, ...extensions: Extension[]) =>
	new EditorView({
		extensions: [
			minimalSetup,
			editorTheme,
			EditorState.transactionFilter.of((tr) => (tr.newDoc.lines > 1 ? [] : [tr])),
			autocompletion({ override: [completion] }),
			...extensions
		],
		parent
	});

function completion(ctx: CompletionContext): CompletionResult | null {
	let before = ctx.matchBefore(/(\w+)$/);
	if (!ctx.explicit && !before) return null;
	return {
		from: before ? before.from : ctx.pos,
		options: completionsMap,
		validFor: /^\w+$/
	};
}

const completionsMap: Completion[] = [
	{
		label: 'https://',
		type: 'keyword'
	}
];
