export default {
  name: '@astrojs/renderer-jsx',
  client: './client.js',
  server: './server.js',
  jsxImportSource: 'astro',
  jsxTransformOptions: async () => {
    const {
      default: { default: jsx },
    } = await import('@babel/plugin-transform-react-jsx');
    return {
      plugins: [jsx({}, { runtime: 'automatic', importSource: 'astro', throwIfNamespace: false })],
    };
  },
  viteConfig() {
    return {
      optimizeDeps: {
        include: ['@astrojs/renderer-jsx/client.js', 'astro/jsx-runtime'],
        exclude: ['@astrojs/renderer-jsx/server.js'],
      },
    };
  },
};
