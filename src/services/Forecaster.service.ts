import env from '@env'
import fetchJson from '../fetchJson.function'

const FORECAST_URL = "http://api.openweathermap.org/data/2.5/forecast?AppId=c1ed9bfa67dc10e625fae724e5bc9137&id=4393217"
const MINUTE = 60 * 1000

type UnitType = "imperial" | "metric"

export interface ForecasterOptions {
  checkInterval: number,
  units: UnitType
}

export class ForecasterService {
  constructor(
    // Instantiate with prior data, optional
    private lastForecast?: FORECAST_DATA,
    private lastChecked?: number,
    private options: ForecasterOptions = { checkInterval: 20 * MINUTE, units: "imperial" }) {
  }

  async getForecast(): Promise<FORECAST_DATA> {
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

interface ForecastAPIQueryParams {
  AppId: string,
  id: string,
  units: UnitType,
}

async function makeForecastAPICall(params: ForecastAPIQueryParams) {
    const queryString = createQueryStringFromObj(params)
    return fetchJson(`${FORECAST_URL}?${queryString}`)
}

function createQueryStringFromObj(params: any) {
  const enc = encodeURIComponent
  const queryString = Object.keys(params)
    .map(k => `${enc(k)}=${enc(params[k])}`)
    .join("&")
  return queryString
}

// TODO: fill out this interface again
export interface FORECAST_DATA {
  
}
