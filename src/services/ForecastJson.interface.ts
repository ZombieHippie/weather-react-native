// http://openweathermap.org/forecast5
export interface ForecastJson {
  cod: string, // "200",
  message: number, // 0.4702,
  cnt: number, // 40,
  list: ForecastJsonEntry[],
  city: {
    id: number, // 4393217,
    name: string, // "Kansas City",
    coord: {
      lat: number, // 39.0997,
      lon: number, // -94.5786
    },
    country: string, // "US"
  }
}

export interface ForecastJsonEntry {
  dt: number, // 1489622400,
  main: {
    // Current examples are in Kelvin, but it depends on the units param
    temp: number, // 276.47,
    temp_min: number, // 276.42,
    temp_max: number, // 276.47,
    pressure: number, // 1005.32,
    sea_level: number, // 1041.11,
    grnd_level: number, // 1005.32,
    humidity: number, // 58,
    temp_kf: number, // 0.05
  },
  weather: Array<
    {
      id: number, // 800,
      main: string, // "Clear",
      description: string, // "clear sky",
      icon: string, // "01n"
    }
  >,
  clouds: {
    all: number, // 0
  },
  wind: {
    speed: number, // 3.63,
    deg: number, // 166.502
  },
  snow: {},
  sys: {
    pod: string, // "n"
  },
  dt_txt: string, // "2017-03-16 00:00:00"
}

export default ForecastJson
