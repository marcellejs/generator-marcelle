import '@marcellejs/core/dist/marcelle.css';
import { dashboard, text } from '@marcellejs/core';

const x = text({ text: 'Welcome to Marcelle!' });

const dash = dashboard({
  title: 'My Marcelle App!',
  author: 'Marcelle Doe',
});

dash.page('Welcome').use(x);

dash.start();
