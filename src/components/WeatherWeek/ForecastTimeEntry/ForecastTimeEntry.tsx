import React, { Component } from "react"
import { View, Text, StyleSheet } from "react-native"

import { ForecastJsonEntry } from "@services/ForecastJson.interface"

export interface TimeEntryData {
  entry: ForecastJsonEntry
  hours: number
  showWeather: boolean
}

export interface Props {
  timeEntry: TimeEntryData
  style?: React.ViewStyle
}

export interface State {}

export class ForecastTimeEntry extends Component<Props, State> {
  static defaultProps = {}

  state = {}

  render() {
    const { timeEntry } = this.props

    function timefmt(h: number): string {
      const a = h < 12 ? "am" : "pm"
      let hdisp = h % 12
      if (hdisp === 0) { hdisp = 12 }
      return `${hdisp}${a}`
    }

    return (
      <View style={styles.timeView}>
        {[
          <Text style={styles.timeText}>{ timefmt(timeEntry.hours) }</Text>,
          timeEntry.showWeather ?
            <Text>{timeEntry.entry.weather[0].description}</Text> : <Text>-</Text>,
          <Text>
            {Math.round(timeEntry.entry.main.temp_max)}F&nbsp;
            {/* Show low if max and min are different */}
            {timeEntry.entry.main.temp_max !== timeEntry.entry.main.temp_min ?
               `/ ${Math.round(timeEntry.entry.main.temp_min)}F` : ""}
          </Text>
        ]}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  timeText: {
    color: "#1243de",
    fontWeight: "bold",
  } as React.TextStyle,

  timeView: {
    marginVertical: 5,
  } as React.ViewStyle,
})
