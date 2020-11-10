const Generator = require('yeoman-generator');
const path = require('path');
const { isEmpty, kebabCase, camelCase, upperFirst } = require('lodash');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);

    this.generatorPkg = this.fs.readJSON(path.join(__dirname, '..', 'package.json'));
    this.pkg = this.fs.readJSON(this.destinationPath('package.json'), {});

    this.props = {
      lang: this.fs.exists(this.destinationPath('tsconfig.json')) ? 'ts' : 'js',
      isApp:
        this.pkg.keywords.includes('marcelle') &&
        !this.pkg.keywords.includes('marcelle-package') &&
        this.pkg.name !== '@marcellejs/core',
    };
  }

  checkPackage() {
    if (isEmpty(this.pkg) || !this.pkg.keywords.includes('marcelle')) {
      this.log.error(
        'Could not find a valid package.json. Did you generate a new application and are running the generator in the project directory? Note that your package\'s keywords should include "marcelle".',
      );
      return process.exit(1);
    }

    return null;
  }

  prompting() {
    this.checkPackage();

    const prompts = [
      {
        name: 'name',
        message: 'What is the name of the module?',
        validate(input) {
          switch (input.trim()) {
            case '':
              return 'Service name can not be empty';
            default:
              return true;
          }
        },
        when: !this.props.name,
      },
    ];

    return this.prompt(prompts).then(props => {
      const name = props.name || this.props.name;
      this.props = Object.assign({}, this.props, props, {
        kebabName: kebabCase(name),
        camelName: camelCase(name),
        className: upperFirst(camelCase(name)),
      });
    });
  }

  writing() {
    const { lang } = this.props;
    this.fs.copyTpl(
      this.templatePath(`${lang}/index.${lang}`),
      this.destinationPath(`src/modules/${this.props.kebabName}/index.${lang}`),
      this.props,
    );
    this.fs.copyTpl(
      this.templatePath(`${lang}/template.module.${lang}`),
      this.destinationPath(
        `src/modules/${this.props.kebabName}/${this.props.kebabName}.module.${lang}`,
      ),
      this.props,
    );
    this.fs.copyTpl(
      this.templatePath(`${lang}/template.svelte`),
      this.destinationPath(`src/modules/${this.props.kebabName}/${this.props.kebabName}.svelte`),
      this.props,
    );
    this.conflicter.force = true;
    this.fs.append(
      this.destinationPath(`src/modules/index.${lang}`),
      `export * from './${this.props.kebabName}';\n`,
    );
  }
};
