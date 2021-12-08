// I was running into issues using canvas because react-konva doesn't support SSR - I fixed it by coustomizing webpack to exclude canvas from SSR https://github.com/gatsbyjs/gatsby/issues/17661

exports.onCreateWebpackConfig = ({
  stage,
  rules,
  loaders,
  plugins,
  actions
}) => {

  actions.setWebpackConfig({
    resolve: {
      alias: {
      },
    }
  });

  if (stage === "develop-html") {
    actions.setWebpackConfig({
      module: {
        rules: [
          {
            test: /canvas/,
            use: loaders.null(),
          },
        ],
      },
    })
  }
};
