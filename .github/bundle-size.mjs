export default async function checkBundleSize({ github, context }) {
	const { data: files } = await github.rest.pulls.listFiles({
		...context.repo,
		pull_number: context.payload.pull_request.number,
	});
	console.log({ files });
	return
}
