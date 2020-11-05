import { Module } from '@marcellejs/core';
import Component from './dataset-info.svelte';

export class DatasetInfo extends Module {
  constructor(dataset) {
    super();
    this.name = 'dataset info [custom module 🤖]';
    this.description = 'Nothing here...';
    this.dataset = dataset;
  }

  mount(targetSelector) {
    const target = document.querySelector(targetSelector || `#${this.id}`);
    if (!target) return;
    this.destroy();
    this.$$.app = new Component({
      target,
      props: {
        title: this.name,
        count: this.dataset.$count,
      },
    });
  }
}
