var CronJob = require('cron').CronJob;
import { counter, trainCounter } from 'counters';

new CronJob('00 00 01 * * 1', function() {
  counter.gatherAllDuration(1, 7);
  trainCounter.gatherAllDuration(1, 7);
}, null, true, 'Europe/London');

new CronJob('00 00 01 * * *', function() {
  counter.gatherAll();
  trainCounter.gatherAll();
}, null, true, 'Europe/London');