module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ['babel-preset-expo', { unstable_transformImportMeta: true }]
    ],
    plugins: [
      // any other plugins you might have
    ]
  };
};
