import { Module } from '<% if (!isMarcelleCore) { %>@marcellejs/core<% } else { %>../../core<% } %>';
import Component from './<%= kebabName %>.svelte';

export class <%= className %> extends Module {
  constructor(options) {
    super();
    this.title = '<%= kebabName %> [custom module 🤖]';
    this.options = options;
  }

  mount(target) {
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
