from flask import Flask, render_template
from flask.ext.scss import Scss
import calendar
import json
import locale
import os
import re

# Flask setup
app = Flask(__name__)
app.debug = True
app.jinja_env.add_extension("pyjade.ext.jinja.PyJadeExtension")
Scss(app)

# Settings, put these somewhere else later
reports_dir = "data/reports"
reportfile_regex = re.compile("(?P<year>\d{4})-(?P<month>\d{2})\.json")
locale.setlocale(locale.LC_ALL, "de_DE")


def is_report_file(path):
    matching_name = reportfile_regex.match(os.path.basename(path))
    regular_file = os.path.isfile(path)
    return matching_name and regular_file


def group_reports_by_year(reports):
    years = {}
    for report in reports:
        year = report["year"]
        if year not in years:
            years[year] = {"yearNo": year, "reports": []}
        years[year]["reports"].append(report)
    return years.values()


def get_report_files():
    return [os.path.join(reports_dir, f)
            for f in os.listdir(reports_dir)
            if is_report_file(os.path.join(reports_dir, f))]


def load_report_metadata(path):
    matches = reportfile_regex.match(os.path.basename(path))

    with open(path, "r") as fp:
        report = json.load(fp)

    year_s = matches.group("year")
    month_s = matches.group("month")

    return {
        "url": "/reports/{}/{}".format(year_s, month_s),
        "filed": report.get("filed", False),
        "year": year_s,
        "month": month_s,
        "month_name": calendar.month_name[int(month_s)]
    }


# Application code starts here

@app.route("/")
def index():
    reports = list(map(load_report_metadata, get_report_files()))
    years = group_reports_by_year(reports)
    return render_template("index.jade", years=years)


@app.route("/reports/<string:year>/<string:month>")
def view_report(year, month):
    filename = "{}-{}.json".format(year, month)
    report_path = os.path.join(reports_dir, filename)

    try:
        with open(report_path, "r") as fp:
            context = json.load(fp)

        context["month_name"] = calendar.month_name[int(month)]

        return render_template("report.jade", **context)

    except FileNotFoundError:
        return "File not found: {}".format(report_path)


if __name__ == "__main__":
    app.run()
