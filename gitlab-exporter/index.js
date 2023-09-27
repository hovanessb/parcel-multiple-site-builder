'use strict';
const { URL } = require('url');

function pushMetrics(results, subject, metrics) {

  for (var i = 0; i < results.length; i++) {
    if (results[i].subject === subject) {
      results[i].metrics.push(...metrics);
      return;
    }
  }

  results.push({
    'subject': subject,
    'metrics': metrics
  });

}

module.exports = {

  name() {
    return 'gitlab-exporter';
  },

  open(context) {
    this.storageManager = context.storageManager;
    this.results = [];
  },

  processMessage(message) {

    var metrics = [];

    switch (message.type) {
      case 'coach.pageSummary':
        metrics.push({
          'name' : 'Total Score',
          'value' : message.data.advice.performance.score,
          'desiredSize' : 'larger'
        });

        metrics.push({
          'name' : 'Requests',
          'value' : message.data.advice.info.pageRequests,
          'desiredSize' : 'smaller'
        });

        break;

      case 'pagexray.pageSummary':

        metrics.push({
          'name' : 'Transfer Size (KB)',
          'value' : (message.data.transferSize / 1024).toFixed(1),
          'desiredSize' : 'smaller'
        });

        break;

      case 'browsertime.pageSummary':

        metrics.push({
          'name' : 'Speed Index',
          'value' : message.data.statistics.visualMetrics.SpeedIndex.p90,
          'desiredSize' : 'smaller'
        });

        metrics.push({
          'name' : 'First Contentful Paint',
          'value' : message.data.statistics.timings.paintTiming['first-contentful-paint'].p90,
          'desiredSize' : 'smaller'
        });

        metrics.push({
          'name' : 'Largest Contentful Paint',
          'value' : message.data.statistics.timings.largestContentfulPaint.renderTime.p90,
          'desiredSize' : 'smaller'
        });

        if ('cpu' in message.data.statistics) {
          metrics.push({
            'name' : 'Total Blocking Time',
            'value' : message.data.statistics.cpu.longTasks.totalBlockingTime.p90,
            'desiredSize' : 'smaller'
          });
        };

        break;

      case 'sitespeedio.render':
        this.storageManager.writeData(JSON.stringify(this.results), 'performance.json').catch((err) => {
          console.log("Error writing 'performance.json':", err);
        });
        break;

      default:

        return;
    }
    
    if (message.url) {
      const urlPath = new URL(message.url);
      pushMetrics(this.results, urlPath.pathname, metrics);
    }

  }
};
