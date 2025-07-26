"use client";

import { StatusBar, StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import ControlButtons from "../components/ControlButtons";
import SensorGraphModal from "../components/SensorGraphModal";
import SensorReadings from "../components/SensorReadings";
import { useGraphModal } from "../hooks/useGraphModal";

export default function Index() {
  const {
    selectedSensor,
    showGraph,
    handleSensorPress,
    closeGraph,
    sensorData,
    historicalSensorData,
  } = useGraphModal();

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
        <View style={styles.content}>
          <Text style={styles.title}>Water Quality Monitor</Text>

          <SensorReadings data={sensorData} onSensorPress={handleSensorPress} />

          <ControlButtons />
        </View>

        <SensorGraphModal
          visible={showGraph}
          selectedSensor={selectedSensor}
          historicalData={historicalSensorData}
          onClose={closeGraph}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  content: {
    flex: 1,
    padding: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "left",
    marginBottom: 30,
    color: "#2c3e50",
  },
});
