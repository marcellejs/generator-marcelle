const webpackDevDependencies = ts =>
  Object.assign(
    {},
    {
      'cross-env': '^7.0.2',
      'css-loader': '^5.0.1',
      'mini-css-extract-plugin': '^1.2.1',
      serve: '^11.3.2',
      'style-loader': '^2.0.0',
      svelte: '^3.29.4',
      'svelte-loader': '^2.13.6',
      webpack: '^4.44.2',
      'webpack-cli': '^4.2.0',
      'webpack-dev-server': '^3.11.0',
    },
    ts ? { typescript: '^4.0.5', 'ts-loader': '^8.0.9' } : {},
  );

const viteDependencies = { svelte: '^3.29.4' };
const viteDevDependencies = { vite: '^1.0.0-rc.9', 'vite-plugin-svelte': '^3.0.1' };

const eslintDevDependencies = (ts, prettier) =>
  Object.assign(
    {},
    {
      eslint: '^7.12.1',
      'eslint-plugin-import': '^2.22.1',
      'eslint-plugin-svelte3': '^2.7.3',
    },
    ts
      ? {
          '@typescript-eslint/eslint-plugin': '^4.6.0',
          'eslint-config-airbnb-typescript': '^12.0.0',
        }
      : { 'eslint-config-airbnb-base': '^14.2.0', 'eslint-config-prettier': '^6.15.0' },
    prettier
      ? {
          'eslint-config-prettier': '^6.15.0',
        }
      : {},
  );

module.exports = function makePkgConfig(generator) {
  const { props } = generator;
  const ts = props.language === 'ts';

  const dependencies = { '@marcellejs/core': '^0.1.0-alpha.1' };
  const devDependencies = {};
  let scripts = {};
  if (props.linting.includes('eslint')) {
    Object.assign(devDependencies, eslintDevDependencies(ts));
  }
  if (props.buildTool === 'vite') {
    scripts = {
      dev: 'vite',
      build: 'vite build',
    };
    Object.assign(dependencies, viteDependencies);
    Object.assign(devDependencies, viteDevDependencies);
  } else if (props.buildTool === 'webpack') {
    scripts = {
      dev: 'cross-env NODE_ENV=development webpack serve --content-base public',
      build: 'cross-env NODE_ENV=production webpack',
    };
    Object.assign(devDependencies, webpackDevDependencies(ts));
  }

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
    scripts,
    dependencies,
    devDependencies,
  };

  return pkg;
};
