export default async function checkFirstContribution({ github, context }) {
	// Get a list of all issues created by the PR opener
	// See: https://octokit.github.io/rest.js/#pagination
	const creator = context.payload.sender.login
	const opts = github.rest.issues.listForRepo.endpoint.merge({
		...context.issue,
		creator,
		state: 'all'
	})
	const issues = await github.paginate(opts)

	for (const issue of issues) {
		if (issue.number === context.issue.number) {
			continue
		}

		if (issue.pull_request) {
			return // Creator is already a contributor.
		}
	}

	await github.rest.issues.createComment({
		issue_number: context.issue.number,
		owner: context.repo.owner,
		repo: context.repo.repo,
		body: `**Welcome** to Astro!

Please make sure you're read our [contributing guide](CONTRIBUTING.md) and we look forward to reviewing your Pull request shortly ✨`
	})
}
