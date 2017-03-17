import env from "@env"
import fetchJson from "../fetchJson.function"
import { ForecastJson, ForecastJsonEntry } from "./ForecastJson.interface"
export { ForecastJson, ForecastJsonEntry }

const FORECAST_URL = "http://api.openweathermap.org/data/2.5/forecast"
const MINUTE = 60 * 1000

type UnitType = "imperial" | "metric"

export interface ForecasterOptions {
  checkInterval: number,
  units: UnitType
}

export class ForecasterService {
  constructor(
    // Instantiate with prior data, optional
    private lastForecast?: ForecastJson,
    private lastChecked?: number,
    private options: ForecasterOptions = { checkInterval: 20 * MINUTE, units: "imperial" }) {
  }

  async getForecast(): Promise<ForecastJson> {
    await this.keepForecastUpToDate()
    return this.lastForecast
  }

  async keepForecastUpToDate() {
    const isOutOfDate = this.lastChecked == null || this.lastChecked + this.options.checkInterval < Date.now()
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
  return fetchJson<ForecastJson>(`${FORECAST_URL}?${queryString}`)
}

function createQueryStringFromObj(params: any) {
  const enc = encodeURIComponent
  const queryString = Object.keys(params)
    .map(k => `${enc(k)}=${enc(params[k])}`)
    .join("&")
  return queryString
}
