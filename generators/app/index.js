const Generator = require('yeoman-generator');
const path = require('path');
const { kebabCase } = require('lodash');
const makePkgConfig = require('./package.json');

const webpackDevDependencies = ts =>
  [
    'cross-env@^7.0.2',
    'css-loader@^5.0.1',
    'mini-css-extract-plugin@^1.2.1',
    'serve@^11.3.2',
    'style-loader@^2.0.0',
    'svelte@^3.29.4',
    'svelte-loader@^2.13.6',
    'webpack@^4.44.2',
    'webpack-cli@^4.2.0',
    'webpack-dev-server@^3.11.0',
  ].concat(ts ? ['typescript@^4.0.5', 'ts-loader@^8.0.9'] : []);

const eslintDevDependencies = ts =>
  [
    'eslint@^7.12.1',
    'eslint-config-prettier@^6.15.0',
    'eslint-plugin-import@^2.22.1',
    'eslint-plugin-svelte3@^2.7.3',
  ].concat(
    ts
      ? ['@typescript-eslint/eslint-plugin@^4.6.0', 'eslint-config-airbnb-typescript@^12.0.0']
      : ['eslint-config-airbnb-base@^14.2.0'],
  );

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);

    this.generatorPkg = this.fs.readJSON(path.join(__dirname, '..', 'package.json'));
    this.pkg = this.fs.readJSON(this.destinationPath('package.json'), {});

    this.dependencies = ['@marcellejs/core@next'];
    this.devDependencies = [];

    this.props = {
      name:
        this.pkg.name ||
        process
          .cwd()
          .split(path.sep)
          .pop(),
      description: this.pkg.description || 'A Marcelle Application',
    };
  }

  prompting() {
    const dependencies = this.dependencies.concat(this.devDependencies);
    const prompts = [
      {
        name: 'name',
        message: 'Project name',
        when: !this.pkg.name,
        default: this.props.name,
        filter: kebabCase,
        validate(input) {
          // The project name can not be the same as any of the dependencies
          // we are going to install
          const isSelfReferential = dependencies.some(dependency => {
            const separatorIndex = dependency.indexOf('@');
            const end = separatorIndex !== -1 ? separatorIndex : dependency.length;
            const dependencyName = dependency.substring(0, end);

            return dependencyName === input;
          });

          if (isSelfReferential) {
            return `Your project can not be named '${input}' because the '${input}' package will be installed as a project dependency.`;
          }

          return true;
        },
      },
      {
        type: 'list',
        name: 'language',
        message: 'Do you want to use JavaScript or TypeScript?',
        default: 'js',
        choices: [
          { name: 'JavaScript', value: 'js' },
          { name: 'TypeScript', value: 'ts' },
        ],
      },
      {
        name: 'packager',
        type: 'list',
        message: 'Which package manager are you using (has to be installed globally)?',
        default: 'npm',
        choices: [
          { name: 'npm', value: 'npm' },
          { name: 'Yarn', value: 'yarn' },
        ],
      },

      {
        name: 'linting',
        type: 'checkbox',
        message: 'Linting and Formatting',
        default: 'js',
        choices: [
          { name: 'ESLint (airbnb)', value: 'eslint', checked: true },
          { name: 'Prettier', value: 'prettier', checked: true },
          { name: 'None', value: 'none' },
        ],
      },
    ];

    return this.prompt(prompts).then(props => {
      // To access props later use this.props.someAnswer;
      this.props = Object.assign({}, this.props, props);
    });
  }

  writing() {
    this.pkg = makePkgConfig(this);
    const lang = this.props.language;
    const isTypeScript = lang === 'ts';
    const context = Object.assign({}, this.props, { isTypeScript });

    this.fs.copy(this.templatePath(`src_${lang}`), this.destinationPath('src'));
    this.fs.writeJSON(this.destinationPath('package.json'), this.pkg);

    if (isTypeScript) {
      this.fs.copy(this.templatePath('tsconfig.json'), this.destinationPath('tsconfig.json'));
    }
    if (this.props.linting.includes('eslint')) {
      this.fs.copy(
        this.templatePath(`_eslintrc-${lang}.js`),
        this.destinationPath('', '.eslintrc.js'),
      );
      this.fs.copy(
        this.templatePath('_vscode-settings.json'),
        this.destinationPath('', '.vscode/settings.json'),
      );
      this.devDependencies = this.devDependencies.concat(eslintDevDependencies(isTypeScript));
    }
    if (this.props.linting.includes('prettier')) {
      this.fs.copy(this.templatePath('_prettierrc.js'), this.destinationPath('', '.prettierrc.js'));
    }

    this.devDependencies = this.devDependencies.concat(webpackDevDependencies(isTypeScript));

    this.fs.copy(this.templatePath('webpack/_gitignore'), this.destinationPath('', '.gitignore'));
    this.fs.copy(this.templatePath('webpack/public'), this.destinationPath('public'));
    this.fs.copyTpl(
      this.templatePath('webpack/webpack.config.js'),
      this.destinationPath('webpack.config.js'),
      context,
    );
    this.fs.copyTpl(
      this.templatePath('webpack/README.md'),
      this.destinationPath('README.md'),
      context,
    );
  }

  install() {
    if (this.props.linting.includes('eslint')) {
      this.devDependencies = this.devDependencies.concat(
        eslintDevDependencies(this.props.language === 'ts'),
      );
    }
    this.devDependencies = this.devDependencies.concat(
      webpackDevDependencies(this.props.language === 'ts'),
    );

    this._packagerInstall(this.dependencies, {
      save: true,
    });
    this._packagerInstall(this.devDependencies, {
      saveDev: true,
    });
  }

  _packagerInstall(deps, options) {
    const { packager } = this.props;
    const method = `${packager}Install`;
    const isDev = options.saveDev;
    const existingDependencies = this.pkg[isDev ? 'devDependencies' : 'dependencies'] || {};
    const dependencies = deps.filter(current => !existingDependencies[current]);

    if (packager === 'yarn' && isDev) {
      options.dev = true;
      delete options.saveDev;
    }

    return this[method](dependencies, options);
  }
};
