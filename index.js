var fs = require('fs');
var path = require('path');
var express = require('express');
var sassMiddleware = require('node-sass-middleware');

var reportsDir = path.join(__dirname, 'data', 'berichte');
var reportFileRegex = /(\d{4})-0?(\d{1,2})\.json/;
var monthNames = [
  null, 'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August',
  'September', 'Oktober', 'November', 'Dezember'
];

var loadJson = function(file) {
  return JSON.parse(fs.readFileSync(file));
};

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
  fs.readdirSync(reportsDir).map(function(file) {

    var matches = reportFileRegex.exec(file);
    if (matches === null) {
      console.error(file + ' doesnt match');
      return {};
    }

    var report = loadJson(path.join(reportsDir, file));

    return {
      url: '/reports/' + matches[1] + '/' + ('00' + matches[2]).substr(-2, 2),
      filed: report.filed,
      year: matches[1],
      month: matches[2],
      monthName: monthNames[parseInt(matches[2])]
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
    var report = loadJson(path.join(reportsDir, fileName));
    report.monthName = monthNames[parseInt(req.params.month)];
    res.render('report', report);
  } catch (e) {
    if (e.code === 'ENOENT') {
      res.status('404');
      res.send('Not found');
    } else {
      res.send(e);
    }
  }
});

app.listen(3000, function() {
  console.log('Listening on 0.0.0.0:3000');
});

