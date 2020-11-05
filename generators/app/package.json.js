module.exports = function(generator) {
  const { props } = generator;

  const pkg = {
    name: props.name,
    description: props.description,
    version: '0.0.0',
    main: 'public/bundle.js',
    keywords: ['marcelle'],
    license: 'MIT',
    author: {
      name: generator.user.git.name(),
      email: generator.user.git.email(),
    },
    scripts: {
      dev: 'cross-env NODE_ENV=development webpack serve --content-base public',
      build: 'cross-env NODE_ENV=production webpack',
    },
  };

  return pkg;
};
