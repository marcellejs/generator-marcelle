import { Module } from '<% if (!isMarcelleCore) { %>@marcellejs/core<% } else { %>../../core<% } %>';
import Component from './<%= kebabName %>.svelte';

export class <%= className %> extends Module {
  constructor(options) {
    super();
    this.name = '<%= kebabName %> [custom module 🤖]';
    this.description = 'TODO: <%= className %> description';
    this.options = options;
  }

  mount(targetSelector) {
    const target = document.querySelector(targetSelector || `#${this.id}`);
    if (!target) return;
    this.destroy();
    this.$$.app = new Component({
      target,
      props: {
        title: this.name,
        options: this.options,
      },
    });
  }
}
