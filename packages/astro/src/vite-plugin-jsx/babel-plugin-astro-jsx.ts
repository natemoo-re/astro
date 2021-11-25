import { declare } from "@babel/helper-plugin-utils";
import babel from "@babel/core";
const { types: t } = babel;
import type { Visitor } from "@babel/traverse";
import { addNamed, addNamespace, isModule } from "@babel/helper-module-imports";
import type {
  ArrowFunctionExpression,
  CallExpression,
  Class,
  Expression,
  FunctionParent,
  Identifier,
  JSXAttribute,
  JSXElement,
  JSXFragment,
  JSXOpeningElement,
  JSXSpreadAttribute,
  MemberExpression,
  ObjectExpression,
  Program,
} from "@babel/types";

export default declare(api => {
  api.assertVersion(7);

  const injectMetaPropertiesVisitor = {
      JSXOpeningElement(path, state) {
        const tagName = path.get('name').get('name');
        console.log(tagName)
      },
    };
  const getJSXOpeningElementTag = (path) => {
    const name = path.get('openingElement').get('name');
    if (name.type === 'JSXIdentifier') {
      return name.get('name').node;
    } else if (name.type === 'JSXMemberExpression') {
      return `${name.get('object').get('name').node}.${name.get('property').get('name').node}`
    }
  }
  const isComponent = (name: string) => {
    return name.indexOf('.') > -1 || name[0].toLowerCase() != name[0];
  }

  return {
    name: '@astrojs/babel-plugin-astro-jsx',
    visitor: {
       Program: {
          enter(path, state) {
            const { file } = state;
            // console.log(file);
          }
       },
       JSXElement: {
          enter(path, file) {
            const name = getJSXOpeningElementTag(path);
            if (!isComponent(name)) return;

            const attributes = [];
            // attributes.push(
            //   t.jsxAttribute(
            //     t.jsxIdentifier("__self"),
            //     t.jsxExpressionContainer(t.thisExpression()),
            //   ),
            // );
            const $$metadata = t.identifier('$$metadata');
            const resolvePath = t.identifier('resolvePath');
            const callee = t.memberExpression($$metadata, resolvePath)
            const calleeArgs: any[] = [];
            if (name.indexOf('.') > -1) {
              const [a, b] = name.split('.');
              // console.log(t.memberExpression(t.identifier(a), t.identifier(b)))
            } else {
              calleeArgs.push(t.identifier(name))
            }
            const callExpression = t.callExpression(callee, calleeArgs);

            attributes.push(
              t.jsxAttribute(
                t.jsxNamespacedName(t.jsxIdentifier('client'), t.jsxIdentifier("component-path")),
                t.jsxExpressionContainer(callExpression),
              ),
            );
            const openingElement = path.get('openingElement');
            openingElement.get('attributes').push(...attributes)
          },
        },
      }
    }
  }
)
