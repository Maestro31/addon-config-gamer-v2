const autoprefixer = require('autoprefixer');

module.exports = {
  containerQuerySelector: '#root',
  publicPath: 'public',
  // Optional: Add this when you start using proxies
  //proxiesPath: 'src/cosmos.proxies'
  webpack: (config, { env }) => {
    // Return customized config
    config.module.rules.push({
      test: /\.(ts|tsx)$/,
      loader: require.resolve('ts-loader')
    });
    config.module.rules.push({
      loader: require.resolve('file-loader'),
      // Exclude `js` files to keep "css" loader working as it injects
      // it's runtime that would otherwise processed through "file" loader.
      // Also exclude `html` and `json` extensions so they get processed
      // by webpacks internal loaders.
      exclude: [/\.(js|jsx|mjs|ts|tsx|css)$/, /\.html$/, /\.json$/],
      options: {
        name: 'static/media/[name].[ext]'
      }
    });
    config.resolve.extensions.push('.ts', '.tsx');
    return config;
  }
};
