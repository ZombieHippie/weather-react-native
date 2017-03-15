
export type UnitType = "imperial" | "metric"
export interface ForecasterOptions {
  checkInterval: number
  units: UnitType
}

import env from '../env'

const FORECAST_URL = "http://api.openweathermap.org/data/2.5/forecast?AppId=c1ed9bfa67dc10e625fae724e5bc9137&id=4393217"
interface ForecastParameters {
  AppId: String
  id: String // City Id
  units?: UnitType
}

const MINUTE = 60 * 1000

export class Forecaster {
  constructor (
      private lastForecast?: ForecastAPIResponse,
      private lastChecked?: number,
      private options: ForecasterOptions = { checkInterval: 20 * MINUTE, units: "imperial" }
      ) {
    // Instantiate with prior data, optional
  }

  async getForecast(): Promise<ForecastAPIResponse> {
    await this.keepForecastUpToDate()
    return this.lastForecast
  }

  async keepForecastUpToDate() {
    const isOutOfDate = this.lastChecked && this.lastChecked + this.options.checkInterval < Date.now()
    if (isOutOfDate) {
      this.lastForecast = await makeForecastAPICall({
        AppId: env.OpenWeatherMapAPIKey,
        id: env.WeatherCityID,
        units: this.options.units,
      })
      this.lastChecked = Date.now()
    }
  }
}


async function makeForecastAPICall(params: ForecastParameters): Promise<ForecastAPIResponse> {
  const queryString = createQueryStringFromObj(params)

  const resp = await fetch(`${FORECAST_URL}?${queryString}`)

  return resp.json()
}

function createQueryStringFromObj(params: Object) {
  const enc = encodeURIComponent
  const queryString = Object.keys(params)
    // map to `key=val` strings
    .map(k => `${enc(k)}=${enc((<any> params)[k])}`)
    .join("&")
  
  return queryString
}

export interface ForecastAPIResponse {
	cod: "200" | String
	message: number // 0.4702,
	cnt: number // 40,
	list: Array<{
			dt: number, // 1489622400,
			main: {
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
					main: String, // "Clear",
					description: String, // "clear sky",
					icon: String, // "01n"
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
				pod: String, // "n"
			},
      // dt_txt is in 3 hour increments
			dt_txt: String, // "2017-03-16 00:00:00"
		}
  >
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

