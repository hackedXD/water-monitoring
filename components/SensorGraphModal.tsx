import { SensorData } from "@/hooks/useSensorData";
import React from "react";
import {
  Dimensions,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { LineChart } from "react-native-gifted-charts";
import { SafeAreaView } from "react-native-safe-area-context";

interface Props {
  visible: boolean;
  selectedSensor: string | null;
  historicalData: SensorData[];
  onClose: () => void;
}

const SensorGraphModal: React.FC<Props> = ({
  visible,
  selectedSensor,
  historicalData,
  onClose,
}) => {
  const getSensorConfig = (sensorType: string) => {
    const configs = {
      turbidity: { name: "Turbidity", unit: "NTU", color: "#8b4513" },
      ph: { name: "pH Level", unit: "pH", color: "#e74c3c" },
      dissolvedOxygen: {
        name: "Dissolved Oxygen",
        unit: "mg/L",
        color: "#3498db",
      },
      tds: { name: "TDS", unit: "ppm", color: "#2ecc71" },
    };
    return configs[sensorType as keyof typeof configs];
  };

  if (!selectedSensor) return null;

  const config = getSensorConfig(selectedSensor);
  const screenData = Dimensions.get("window");

  // Calculate available width to fill the entire chart container
  // Account for modal padding (20px each side) and chart container padding (16px each side)
  const availableWidth = screenData.width - 72;

  // Extract data for the selected sensor
  const sensorValues = historicalData.map(
    (reading) => reading[selectedSensor as keyof SensorData] as number
  );

  // Create chart data for react-native-gifted-charts
  const recentData = historicalData;
  const chartData = recentData.map((reading, index) => {
    // Convert epoch timestamp to readable time (HH:MM)
    const date = reading.timestamp;
    const timeLabel = date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    return {
      value: reading[selectedSensor as keyof SensorData] as number,
      label: timeLabel,
      dataPointText: (
        reading[selectedSensor as keyof SensorData] as number
      ).toFixed(1),
    };
  });
  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>{config.name} Over Time</Text>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.modalContent}>
          <View style={styles.chartContainer}>
            <View style={styles.chartWrapper}>
              <LineChart
                data={chartData}
                width={availableWidth}
                height={280}
                color={config.color}
                thickness={3}
                curved
                isAnimated
                animationDuration={1000}
                dataPointsColor={config.color}
                dataPointsRadius={6}
                textShiftY={-8}
                textShiftX={-5}
                textColor={config.color}
                textFontSize={12}
                showDataPointOnFocus
                showStripOnFocus
                showTextOnFocus
                stripColor={config.color}
                stripOpacity={0.3}
                focusEnabled
                delayBeforeUnFocus={3000}
                unFocusOnPressOut
                yAxisColor="#e1e8ed"
                xAxisColor="#e1e8ed"
                backgroundColor="#ffffff"
                adjustToWidth
                spacing={Math.max(
                  (availableWidth - 120) / Math.max(chartData.length - 1, 1),
                  40
                )}
                xAxisLabelTextStyle={{
                  fontSize: 10,
                  color: "#7f8c8d",
                  textAlign: "center",
                }}
                rotateLabel
                labelsExtraHeight={20}
              />
            </View>

            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Current</Text>
                <Text style={[styles.statValue, { color: config.color }]}>
                  {sensorValues.length > 0
                    ? sensorValues[sensorValues.length - 1].toFixed(1)
                    : "--"}{" "}
                  {config.unit}
                </Text>
              </View>

              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Average</Text>
                <Text style={[styles.statValue, { color: config.color }]}>
                  {sensorValues.length > 0
                    ? (
                        sensorValues.reduce((a, b) => a + b, 0) /
                        sensorValues.length
                      ).toFixed(1)
                    : "--"}{" "}
                  {config.unit}
                </Text>
              </View>

              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Min</Text>
                <Text style={[styles.statValue, { color: config.color }]}>
                  {sensorValues.length > 0
                    ? Math.min(...sensorValues).toFixed(1)
                    : "--"}{" "}
                  {config.unit}
                </Text>
              </View>

              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Max</Text>
                <Text style={[styles.statValue, { color: config.color }]}>
                  {sensorValues.length > 0
                    ? Math.max(...sensorValues).toFixed(1)
                    : "--"}{" "}
                  {config.unit}
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e1e8ed",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2c3e50",
  },
  closeButton: {
    padding: 8,
    backgroundColor: "#e74c3c",
    borderRadius: 20,
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  chartContainer: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    overflow: "hidden", // Prevent any overflow
  },
  chartWrapper: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
    alignSelf: "center", // Center the chart
  },
  statsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 20,
  },
  statItem: {
    width: "48%",
    backgroundColor: "#f8f9fa",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    alignItems: "center",
  },
  statLabel: {
    fontSize: 12,
    color: "#7f8c8d",
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default SensorGraphModal;
