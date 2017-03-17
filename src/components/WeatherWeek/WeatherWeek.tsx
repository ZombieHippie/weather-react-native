import React, { Component } from "react"
import { View, Text, StyleSheet, ScrollView } from "react-native"

import { ForecasterService, ForecastJson, ForecastJsonEntry } from "@services/Forecaster.service"

import { ForecastTimeEntry, TimeEntryData } from "./ForecastTimeEntry/ForecastTimeEntry"

export interface Props {}
export interface State {
  forecastJson: ForecastJson
  displayForecast: TimeForecastEntriesByDay
}

const forecaster = new ForecasterService()
export default class WeatherWeek extends Component<Props, State> {
  static defaultProps = {}

  state = {
    forecastJson: { message: 0 } as ForecastJson,
    displayForecast: {} as TimeForecastEntriesByDay
  }

  private mounted = false

  componentDidMount() {
    this.mounted = true
    this.refreshWeather()
    // Keep weather up to date in 10 second intervals
    setInterval(() => this.refreshWeather(), 10e3)
  }

  componentWillUnmount() {
    this.mounted = false
  }

  refreshWeather() {
    if (this.mounted) {
      forecaster
        .getForecast()
        .then(forecastJson  => {
          // Check if new forecast data
          if (this.state.forecastJson.message !== forecastJson.message) {
            const displayForecast = fmtForecastEntriesForRender(forecastJson.list)
            const newState = Object.assign({}, this.state, { forecastJson, displayForecast })
            this.setState(newState)
          }
        })
    }
  }

  render() {
    const { displayForecast, forecastJson } = this.state

    const forecastDayKeys = Object.keys(displayForecast)

    const title = forecastJson && forecastJson.city && forecastJson.city.name || "Fetching Weather..."

    return (
      <View>
        <Text style={styles.title}>{title}</Text>

        <ScrollView style={styles.container} horizontal={true}>
          {forecastDayKeys.map(key =>
            <View style={styles.dayCol}>
              <Text style={styles.dayText}>{key}</Text>
              {displayForecast[key].map(timeEntry =>
                <ForecastTimeEntry timeEntry={timeEntry}/>
              )}
            </View>
          )}
        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
  } as React.ViewStyle,

  title: {
    fontSize: 24,
    padding: 20,
    fontWeight: "bold",
  } as React.TextStyle,

  dayText: {
    textAlign: "center",
    fontWeight: "bold",
  } as React.TextStyle,

  dayCol: {
    paddingHorizontal: 5,
    flex: 1,
  } as React.TextStyle,
})

type TimeForecastEntriesByDay = {[day: string]: TimeEntryData[]}
function fmtForecastEntriesForRender(entries: ForecastJsonEntry[]): TimeForecastEntriesByDay {
  let lastWeather: string
  const collection: TimeForecastEntriesByDay = {}
  entries.forEach(entry => {
    const date = new Date(entry.dt * 1000)
    // Create new date and hours for organizing data w.r.t. local time.
    const [day, hours] = [date.toLocaleDateString(), date.getHours()]

    if (hours < 7) { return }

    if (collection[day] == null) {
      collection[day] = []
      // Always show weather on first day entry.
      lastWeather = null
    }

    // Only show weather icon as the weather has changed
    let showWeather = entry.weather.length && lastWeather !== entry.weather[0].main
    if (showWeather) {
      lastWeather = entry.weather[0].main
    }

    collection[day].push({
      entry,
      hours,
      showWeather
    })
  })

  return collection
}
