import React, { Component } from "react"
import { View, StyleSheet } from "react-native"

import WeatherWeek from "@components/WeatherWeek/WeatherWeek"

interface Props {}
interface State {}
export default class App extends Component<Props, State> {
  render() {
    return (
      <View style={styles.container}>
        <WeatherWeek/>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF",
  } as React.ViewStyle,
})
