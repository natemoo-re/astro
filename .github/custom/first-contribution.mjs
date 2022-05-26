export default async function checkFirstContribution({ github, context }) {
	// Get a list of all issues created by the PR opener
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

	const { data: comments } = await github.rest.issues.listComments({
		...context.repo,
		issue_number: context.payload.pull_request.number
	})
	const comment = comments.find(comment => comment.user.login === 'github-actions[bot]' && comment.body.includes('Welcome to Astro!'));
	if (comment) return // We've already commented on this PR.

	await github.rest.issues.createComment({
		issue_number: context.issue.number,
		owner: context.repo.owner,
		repo: context.repo.repo,
		body: `**Welcome to Astro!** Congratulations on opening your first Pull Request.`
	})
}
