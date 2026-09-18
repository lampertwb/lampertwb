# Weather Data API

A small Flask API that serves daily mean-temperature readings for European
weather stations, built as part of a Python (Flask) Udemy course.

## Run it locally

```bash
pip install -r requirements.txt
python main.py
```

The app runs at `http://127.0.0.1:5000/`.

## Endpoints

- `/` — station index (STAID + station name)
- `/api/v1/<station>/<date>` — one station, one date (e.g. `/api/v1/1/1988-10-25`)
- `/api/v1/<station>` — one station, all dates (e.g. `/api/v1/1`)
- `/api/v1/yearly/<station>/<year>` — one station, one year (e.g. `/api/v1/yearly/1/1988`)

`<station>` is a station ID from the index at `/`; `<date>` is `YYYY-MM-DD`.

## Data source

Daily mean temperature series from the **European Climate Assessment & Dataset
(ECA&D)**, used here for non-commercial, educational purposes.

This portfolio copy ships a **trimmed sample of 5 stations** (STAID 1, 5, 12,
48, 71) instead of the full ~92-station dataset, to keep the repo lightweight.
The API endpoints above only return data for those 5 IDs. To run it with the
full dataset, download the daily mean temperature series (`TG`) for any
station from ECA&D and drop the files into `data_small/`:

> Klein Tank, A.M.G. and Coauthors, 2002. Daily dataset of 20th-century surface
> air temperature and precipitation series for the European Climate Assessment.
> *Int. J. of Climatol.*, 22, 1441-1453. Data and metadata available at
> https://www.ecad.eu
