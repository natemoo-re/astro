export default async function checkBundleSize({ github, context }) {
	const { data: files } = await github.rest.pulls.listFiles({
		...context.repo,
		pull_number: context.payload.pull_request.number,
	});
	const modifiesClientRuntime = !!files.find(({ filename }) => filename.startsWith('packages/astro/src/runtime/client/'));
	if (!modifiesClientRuntime) return;
	console.log('Checking bundle size!');
	return
}
