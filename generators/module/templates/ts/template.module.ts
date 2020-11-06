import { Module } from '@marcellejs/core';
import Component from './<%= kebabName %>.svelte';

export interface <%= className %>Options {
  name?: string;
}

export class <%= className %> extends Module {
  name = '<%= kebabName %> [custom module 🤖]';
  description = 'TODO: <%= className %> description';

  options: <%= className %>Options;

  constructor(options: <%= className %>Options = {}) {
    super();
    this.options = options;
  }

  mount(targetSelector?: string): void {
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
