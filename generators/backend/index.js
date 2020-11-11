const Generator = require('yeoman-generator');
const { isEmpty } = require('lodash');
const crypto = require('crypto');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);

    this.pkg = opts.pkg || this.fs.readJSON(this.destinationPath('package.json'), {});

    const lang =
      opts.language || (this.fs.exists(this.destinationPath('tsconfig.json')) ? 'ts' : 'js');
    const isApp =
      opts.isSub ||
      (this.pkg.keywords.includes('marcelle') &&
        !this.pkg.keywords.includes('marcelle-package') &&
        this.pkg.name !== '@marcellejs/core');
    const useYarn = opts.useYarn || this.fs.exists(this.destinationPath('yarn.lock'));

    this.props = {
      lang,
      isApp,
      isSub: !!opts.isSub,
      useYarn,
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

  initializing() {
    this.checkPackage();
  }

  prompting() {
    const prompts = [
      {
        type: 'list',
        name: 'db',
        message: 'What kind of database do you want to use?',
        default: 'nedb',
        choices: [
          { name: 'NeDB', value: 'nedb' },
          { name: 'MongoDB', value: 'mongodb' },
        ],
      },
      {
        type: 'confirm',
        name: 'auth',
        message: 'Do you want to use authentication?',
        default: false,
      },
    ];

    return this.prompt(prompts).then(props => {
      // To access props later use this.props.someAnswer;
      this.props = Object.assign({}, this.props, props);
    });
  }

  writing() {
    const pkg = {
      ...this.pkg,
      scripts: {
        ...this.pkg.scripts,
        backend: 'marcelle-backend',
      },
      dependencies: { ...this.pkg.dependencies, '@marcellejs/backend': '^0.0.1-alpha.1' },
    };
    this.fs.copy(this.templatePath('config'), this.destinationPath('backend/config'));
    this.fs.copyTpl(
      this.templatePath('config/default.json'),
      this.destinationPath('backend/config/default.json'),
      {
        secret: crypto.randomBytes(20).toString('base64'),
        db: this.props.db,
        auth: this.props.auth.toString(),
      },
    );
    this.conflicter.force = true;
    this.fs.writeJSON(this.destinationPath('package.json'), pkg);
  }

  install() {
    if (this.props.isSub) return;
    this.installDependencies({
      yarn: this.props.useYarn,
      npm: !this.props.useYarn,
      bower: false,
    });
  }

  end() {
    this.log
      .writeln()
      .info('You will need to update the backends in your scripts:\n')
      .writeln(
        `const backend = createBackend({ location: 'http://localhost:3030/', auth: ${this.props.auth} });`,
      )
      .writeln();
  }
};
