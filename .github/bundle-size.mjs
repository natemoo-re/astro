import fs from 'node:fs/promises';
import { build } from 'esbuild';

export default async function checkBundleSize({ github, context, exec }) {
	const PR_NUM = context.payload.pull_request.number;
	const SHA = context.payload.pull_request.head.sha;
	const CLIENT_RUNTIME_PATH = 'packages/astro/src/runtime/client/';

	const { data: files } = await github.rest.pulls.listFiles({
		...context.repo,
		pull_number: PR_NUM,
	});
	const clientRuntimeFiles = files.filter(({ filename }) => filename.startsWith(CLIENT_RUNTIME_PATH));
	if (clientRuntimeFiles.length === 0) return;
	
	const table = [
		'| File | Old Size | New Size | Change |',
		'| ---- | -------- | -------- | ------ |',
	];
	const output = await bundle(clientRuntimeFiles);
	
	for (const [filename, { oldSize, newSize, sourceFile }] of Object.entries(output)) {
		const change = newSize - oldSize;
		table.push(`| [\`${filename}\`](https://github.com/${context.repo.owner}/${context.repo.repo}/tree/${context.payload.pull_request.head.ref}/${sourceFile}) | ${oldSize} | ${newSize} | ${change} |`);
	}

	const { data: comments } = await github.rest.issues.listComments({
		...context.repo,
		issue_number: PR_NUM
	})
	const comment = comments.find(comment => comment.user.login === 'github-actions[bot]' && comment.body.includes('Bundle Size Check'));
	const method = comment ? 'updateComment' : 'createComment';
	const payload = comment ? { comment_id: comment.id } : { issue_number: PR_NUM };
	await github.rest.issues[method]({
		...context.repo,
		...payload,
		body: `###  ⚖️  Bundle Size Check

Latest commit: ${SHA}

${table.join('\n')}`,
	});
}

async function bundle(files) {
	const { metafile } = await build({
		entryPoints: [files.map(({ filename }) => filename), files.map(({ filename }) => `main/${filename}`)],
		bundle: true,
		minify: true,
		sourcemap: false,
		target: ['chrome58', 'firefox57', 'safari11', 'edge16'],
		outdir: 'out',
		metafile: true,
	})

	return Object.entries(metafile.outputs).reduce((acc, [filename, info]) => {
		filename = filename.slice('out/'.length);
		if (filename.startsWith('main/')) {
			filename = filename.slice('main/'.length).replace(CLIENT_RUNTIME_PATH, '');
			const oldSize = info.bytes;
			return Object.assign(acc, { [filename]: Object.assign(acc[filename] ?? {}, { oldSize }) });
		}
		filename = filename.replace(CLIENT_RUNTIME_PATH, '');
		const newSize = info.bytes;
		return Object.assign(acc, { [filename]: Object.assign(acc[filename] ?? {}, { newSize, sourceFile: Object.keys(info.inputs)[0] }) });
	}, {});
}
