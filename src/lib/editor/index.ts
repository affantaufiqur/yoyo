import { Compartment, EditorState, type Extension, StateEffect } from '@codemirror/state';
import { EditorView, minimalSetup } from 'codemirror';
import { EditorView as ViewEditor } from '@codemirror/view';
import {
	autocompletion,
	type Completion,
	type CompletionContext,
	type CompletionResult
} from '@codemirror/autocomplete';

const baseTheme = ViewEditor.theme(
	{
		'&': {
			color: 'white',
			backgroundColor: '#1F2937',
			height: '100%',
			border: '1px solid transparent'
		},
		'&.cm-focused .cm-cursor': {
			borderLeftColor: '#FF5964'
		},
		'.cm-content': {
			caretColor: '#FF5964'
		},
		'.cm-scroller': {
			overflow: 'hidden'
		}
	},
	{ dark: true }
);

const focusedTheme = ViewEditor.theme({
	'.cm-content': {
		maxWidth: '100%'
	},
	'.cm-scroller': {
		overflow: 'auto'
	},
	'.cm-line': {
		overflowWrap: 'break-word',
		whiteSpace: 'pre-wrap'
	}
});

const dynamicTheme = new Compartment();

export const vimCompartment = new Compartment();

export const editorView = (parent: HTMLDivElement, ...extensions: Extension[]) =>
	new EditorView({
		extensions: [
			minimalSetup,
			vimCompartment.of([]),
			dynamicTheme.of([baseTheme]),
			EditorState.transactionFilter.of((tr) => (tr.newDoc.lines > 1 ? [] : [tr])),
			autocompletion({ override: [completion] }),
			EditorView.focusChangeEffect.of((_, focus) => {
				return dynamicTheme.reconfigure(focus ? [baseTheme, focusedTheme] : [baseTheme]);
			}),
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
