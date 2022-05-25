export default async function checkBundleSize({ github, context }) {
	console.log(context.repo);
	const files = await github.rest.pulls.listFiles({
		owner: context.repo.owner,
		owner: context.repo.repo,
		pull_number: context.payload.pull_request.number,
	});
	console.log({ files });
	return
}
