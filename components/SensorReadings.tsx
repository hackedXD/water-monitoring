import { SensorData } from "@/hooks/useSensorData";
import type React from "react";
import { memo, useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

function getTimeAgo(timestamp: Date, currentTime: Date): string {
  const diff = currentTime.getTime() - timestamp.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days}d ago`;
  } else if (hours > 0) {
    return `${hours}h ago`;
  } else if (minutes > 0) {
    return `${minutes}m ago`;
  } else {
    return `${seconds}s ago`;
  }
}

// Separate component for the timestamp to avoid re-rendering the entire sensor grid
const LastUpdatedText = memo(({ timestamp }: { timestamp: Date }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Text style={styles.lastUpdated}>
      Last updated: {getTimeAgo(timestamp, currentTime)}
    </Text>
  );
});

function SensorReadings({
  data,
  onSensorPress,
}: {
  data?: SensorData;
  onSensorPress?: (sensorType: string) => void;
}) {
  const sensors = [
    {
      name: "Turbidity",
      value: data?.turbidity.toFixed(1),
      unit: "NTU",
      color: "#8b4513",
      icon: "🌫️",
      type: "turbidity",
    },
    {
      name: "pH Level",
      value: data?.ph.toFixed(1),
      unit: "pH",
      color: "#e74c3c",
      icon: "⚗️",
      type: "ph",
    },
    {
      name: "Diss. Oxygen",
      value: data?.dissolvedOxygen.toFixed(1),
      unit: "mg/L",
      color: "#3498db",
      icon: "💨",
      type: "dissolvedOxygen",
    },
    {
      name: "TDS",
      value: data?.tds.toFixed(0),
      unit: "ppm",
      color: "#2ecc71",
      icon: "🧪",
      type: "tds",
    },
  ];

  return (
    <View style={styles.container}>
      {data?.timestamp && <LastUpdatedText timestamp={data.timestamp} />}
      <View style={styles.grid}>
        {sensors.map((sensor, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.card, { borderLeftColor: sensor.color }]}
            onPress={() => onSensorPress?.(sensor.type)}
            activeOpacity={0.7}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.icon}>{sensor.icon}</Text>
              <Text style={styles.sensorName}>{sensor.name}</Text>
            </View>
            <View style={styles.valueContainer}>
              <Text style={[styles.value, { color: sensor.color }]}>
                {sensor.value ? sensor.value : "--"}
              </Text>
              <Text style={styles.unit}>{sensor.unit}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

export default memo(SensorReadings);

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  lastUpdated: {
    fontSize: 12,
    color: "#95a5a6",
    fontStyle: "italic",
    textAlign: "right",
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
    color: "#2c3e50",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    width: "48%",
    borderLeftWidth: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  icon: {
    fontSize: 20,
    marginRight: 8,
  },
  sensorName: {
    fontSize: 14,
    color: "#7f8c8d",
    fontWeight: "500",
  },
  valueContainer: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  value: {
    fontSize: 24,
    fontWeight: "bold",
  },
  unit: {
    fontSize: 14,
    color: "#95a5a6",
    marginLeft: 4,
  },
  tapHint: {
    fontSize: 11,
    color: "#95a5a6",
    textAlign: "center",
    marginTop: 8,
    fontStyle: "italic",
  },
});
