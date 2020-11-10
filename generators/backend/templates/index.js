const path = require('path');
process.env['NODE_CONFIG_DIR'] = path.join(__dirname, 'config/');
const { app, logger } = require('@marcellejs/backend');

const port = app.get('port');
const server = app.listen(port);

process.on('unhandledRejection', (reason, p) =>
  logger.error('Unhandled Rejection at: Promise ', p, reason),
);

server.on('listening', () => {
  logger.info('------------------------------------------------------------------');
  logger.info('Marcelle Backend application started on http://%s:%d', app.get('host'), port);
  logger.info('Available services:');
  app.get('services').forEach(name => {
    logger.info('\t/%s', name);
  });
  logger.info('------------------------------------------------------------------');
});
