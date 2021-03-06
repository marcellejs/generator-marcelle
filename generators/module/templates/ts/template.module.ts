import { Module } from '<% if (!isMarcelleCore) { %>@marcellejs/core<% } else { %>../../core<% } %>';
import Component from './<%= kebabName %>.svelte';

export interface <%= className %>Options {
  name?: string;
}

export class <%= className %> extends Module {
  title = '<%= kebabName %> [custom module 🤖]';

  options: <%= className %>Options;

  constructor(options: <%= className %>Options = {}) {
    super();
    this.options = options;
  }

  mount(target?: HTMLElement): void {
    const t = target || document.querySelector(`#${this.id}`);
    if (!t) return;
    this.destroy();
    this.$$.app = new Component({
      target: t,
      props: {
        title: this.title,
        options: this.options,
      },
    });
  }
}
