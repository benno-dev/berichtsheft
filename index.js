var fs = require('fs');
var path = require('path');
var express = require('express');
var sassMiddleware = require('node-sass-middleware');

var reportsDir = path.join(__dirname, 'reports');
var reportFileRegex = /(\d{4})-(\d{1,2})\.json/;
var monthNames = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli',
                  'August', 'September', 'Oktober', 'November', 'Dezember'];


var app = express();
app.set('view engine', 'jade');

app.use(sassMiddleware({
  src: path.join(__dirname, 'sass'),
  dest: path.join(__dirname, 'public'),
  debug: true
}));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res) {
  var context = { years: {} };

  var files = fs.readdirSync(reportsDir).map(function(file) {
    var matches = reportFileRegex.exec(file);
    return {
      url: '/reports/' + matches[1] + '/' + matches[2],
      year: matches[1],
      month: matches[2],
      monthName: monthNames[matches[2]]
    };

  }).forEach(function(report) {

    if (!context.years[report.year]) {
      context.years[report.year] = [];
    }
    context.years[report.year].push(report);

  });

  res.render('index', context);

});

app.get('/reports/:year/:month', function(req, res) {
  var fileName = req.params.year + '-' + req.params.month + '.json';

  try {
    var rawJson = fs.readFileSync(path.join(reportsDir, fileName));
    var report = JSON.parse(rawJson);

    report.monthName = monthNames[req.params.month];
    res.render('report', report);
  } catch (e) {
    res.send(e);
  }
});

app.listen(3000, function() {
  console.log('Listening on 0.0.0.0:3000');
});

