# generator-marcelle

[![NPM version][npm-image]][npm-url]

> A Yeoman generator for Marcelle applications

## Installation

First, install [Yeoman](http://yeoman.io) and generator-marcelle using [npm](https://www.npmjs.com/) (we assume you have pre-installed [node.js](https://nodejs.org/)).

```bash
npm install -g yo
npm install -g generator-marcelle
```

## Generating a Marcelle Application

To generate a new project:

```bash
yo marcelle
```

Several options are available to customize the project. If you don't know what to chose, just hit enter to select the defaults.

## Generating a Module

It is possible to use the generator to create new custom modules for an application or a marcelle package.

```bash
yo marcelle:module
```

Just enter your module's name (e.g. my-module) and the generator will create a template module that you can your in your script:

```js
import { myModule } from './modules/my-module';

const m = myModule(opts);
```

## Generating a Backend

It is possible to use the generator to add server-side data storage (backend).

```bash
yo marcelle:backend
```

To run the server:

```bash
npm run backend
```

TODO: document configuration

## Getting To Know Yeoman

- Yeoman has a heart of gold.
- Yeoman is a person with feelings and opinions, but is very easy to work with.
- Yeoman can be too opinionated at times but is easily convinced not to be.
- Feel free to [learn more about Yeoman](http://yeoman.io/).

## License

MIT © [Jules Françoise]()

[npm-image]: https://badge.fury.io/js/generator-marcelle.svg
[npm-url]: https://npmjs.org/package/generator-marcelle
[travis-image]: https://travis-ci.com/JulesFrancoise/generator-marcelle.svg?branch=master
[travis-url]: https://travis-ci.com/JulesFrancoise/generator-marcelle
[daviddm-image]: https://david-dm.org/JulesFrancoise/generator-marcelle.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/JulesFrancoise/generator-marcelle
