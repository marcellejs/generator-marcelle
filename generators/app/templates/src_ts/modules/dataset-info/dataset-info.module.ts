import { Dataset, Module } from '@marcellejs/core';
import Component from './dataset-info.svelte';

export class DatasetInfo extends Module {
  name = 'dataset info [custom module 🤖]';
  description = 'Nothing here...';

  dataset: Dataset;

  constructor(dataset: Dataset) {
    super();
    this.dataset = dataset;
  }

  mount(targetSelector?: string): void {
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
