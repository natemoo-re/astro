export default async function checkBundleSize({ github, context }) {
	console.log({ github, context });
  return context.payload.client_payload.value
}
