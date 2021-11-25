import { Fragment, spreadAttributes, _render, renderComponent } from '../server/index.js'

let result: any;
export function bindResult(renderers: any[]) {
  if (result) return;
  result = { _metadata: { renderers: [...renderers] } };
}

async function createVNode(type: any, { children, ...props }: any) {
  if (typeof type === 'string') {
    return `<${type}${spreadAttributes(props)}>${await _render(children)}</${type}>`;
  }
  if (typeof type === 'function') {
    let Component = type;
    try {
      Component = await type(props);
      if (typeof Component === 'string') {
        return Component;
      }
      return '';
    } catch (e) {}

    const html = await renderComponent(result, Component.displayName || Component.name, Component, props);
    return html;
  }
}

export {
  createVNode as h,
	createVNode as jsx,
	createVNode as jsxs,
	createVNode as jsxDEV,
	Fragment
};
