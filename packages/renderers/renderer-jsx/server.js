import { h } from 'astro/jsx-runtime';

const VALID_TYPES = new Set(['function', 'string']);

async function check(Component, props, children) {
  if (!VALID_TYPES.has(typeof Component)) return false;
  return true;
}

async function renderToStaticMarkup(Component, props, children, metadata, result) {
  const html = await h(Component, { children, ...props, $$result: result });
  return { html };
}

export default {
  check,
  renderToStaticMarkup,
};
