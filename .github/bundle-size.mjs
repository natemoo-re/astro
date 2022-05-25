import { build } from 'esbuild';

export default async function checkBundleSize({ github, context, exec }) {
	const { data: files } = await github.rest.pulls.listFiles({
		...context.repo,
		pull_number: context.payload.pull_request.number,
	});
	const clientRuntimeFiles = files.filter(({ filename }) => filename.startsWith('packages/astro/src/runtime/client/'));
	if (clientRuntimeFiles.length === 0) return;
	console.log('Checking bundle size!');
	const output = await bundle(clientRuntimeFiles);
	for (const [filename, info] of Object.entries(output)) {
		console.log(filename, info.bytes);
	}
	return
}

async function bundle(files) {
	const { metafile } = await build({
		entryPoints: [files.map(({ filename }) => filename)],
		bundle: true,
		minify: true,
		sourcemap: true,
		target: ['chrome58', 'firefox57', 'safari11', 'edge16'],
		outfile: '<stdout>',
		metafile: true,
	})

	return metafile.outputs;
}
