// craco.config.js
const CracoSwcPlugin = require('craco-swc');

module.exports = {
  plugins: [{ plugin: CracoSwcPlugin }],
  style: {
    postcss: {
      mode: 'extends',
      plugins: {
        tailwindcss: {},
        autoprefixer: {},
      },
    },
  },
};
