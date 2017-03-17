// All API requests in this application should use fetchJson so we can easily collect
// all of our mock data stubs into a single place.

// TODO: Document this USE_MOCK_DATA var; perhaps enable it as a flag, or global variable?
// Cole - I'm not familiar with the common way React developers handle this yet.
const USE_MOCK_DATA = true

import * as MOCKS from "./__mocks__/index"

export default async function fetchJson<T>(req: RequestInfo, init?: RequestInit): Promise<T> {
  if (USE_MOCK_DATA) {
    const reqStr = req.toString()
    // quick pause similar to having to make a request
    await pause(400)
    // TODO: in testing, we would likely need more configuration options, or to be able to
    // force it to fail, in the case of testing no internet connection.
    switch (true) {
      case reqStr.search("api.openweathermap.org/data/2.5/forecast") > -1:
        return <any> MOCKS.FORECAST_IMPERIAL
    }

    // didn't find resource...
    // TODO: design this to behave the same way fetch does
    console.warn("fetchJson: could not find mock for resource.", req)
    return null

  } else {
    const resp = await fetch(req, init)
    console.log(resp)
    return resp.json() as Promise<T>
  }
}

// Pause for an amount of time
async function pause(ms: number) {
  return new Promise(res => setTimeout(res, ms))
}
