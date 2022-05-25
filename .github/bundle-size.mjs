export default async function checkBundleSize({ github, context }) {
	const files = await github.rest.pulls.listFiles({
		owner: context.repo.owner,
		owner: context.repo.repo,
		pull_number: context.pull_request.number,
	});
	console.log({ files });
	return
}
