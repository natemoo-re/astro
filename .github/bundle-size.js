module.exports = async ({ github, context }) => {
	console.log({ github, context });
  return context.payload.client_payload.value
}
