# Berichtsheft

Diese App rendert JSON-Dateien in ein Template das die Berichtsheftvorlage der IHK Detmold nachahmt.

![screenshot](https://github.com/sometoby/berichtsheft/raw/master/.screenshot.png)

## Bekannte Probleme/Fehlende Features

* Berufsschulblöcke können noch nicht gepflegt werden.
* Beim Ausdrucken muss noch mit Einstellungen rumgepfuscht werden damit das Layout richtig aussieht.
* Wenn die komplette Berichtsseite nicht auf den Bildschirm passt ist das Scrollverhalten eher mies.

## Benötigte Software

* Git
* Python 3.4 oder neuer
* Optional: virtualenv und virtualenvwrapper, um die Abhängigkeiten nicht systemweit zu installieren

## Installation

Diese Schritte sollten auf gängigen Linux-Distros und MacOS laufen. Auf Windows läuft die App bestimmt, hab ich aber nicht getestet. Werd ich auch nicht machen.

```sh
$ git clone https://github.com/sometoby/berichtsheft
$ cd berichtsheft

# Jetzt entweder:

# 1) Abhängigkeiten systemweit installieren
$ sudo pip install -r requirements.txt

# Oder 2) Abhängigkeiten in ein Virtualenv installieren
$ mkvirtualenv berichtsheft
$ workon berichtsheft
$ pip install -r requirements.txt

# Dann noch das Datenverzeichnis anlegen.
mkdir -p data/reports

# Und Showtime.
$ python app.py
```

## Datenpflege

Die App lädt alle Berichte aus dem Verzeichnis `data/reports`. Die Dateien müssen nach dem Muster `<jahr>-<monat>.json` benannt sein (z.B. `2014-08.json`).

Die JSON-Dateien sollten wie folgt aussehen:
```json
{
  "filed": true,
  "date": "28.08.2014",
  "reportNo": 1,
  "sparte": "Abteilung oder Sparte",
  "activities": [
    "Betriebliche Tätigkeit der ersten Woche",
    "Ditto, zweite Woche",
    "Dritte Woche",
    "Vierte Woche"
  ],
  "topics": [
    "Themen der Unterweisung",
    "Lehrgespräche des betrieblichen Unterrichts",
    "und außerbetriebliche Schulungsveranstaltungen",
    "..."
  ]
}
```

Das Feld `filed` ist optional und bestimmt, ob in der Übersicht der Bericht mit einem Häkchen angezeigt wird. Damit kann festgehalten werden, welche Berichte schon ausgedruckt und unterschrieben sind.

## Drucken

Die Übersichtsseite hat eine optimierte Printansicht und kann fast problemlos gedruckt werden. Achte beim Ausdrucken (Strg+P) darauf, dass die **Papiergröße auf A4 eingestellt ist und die Seitenabstände ausgeschaltet sind**, sonst bricht das Layout zusammen.
