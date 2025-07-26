import { useState } from "react";
import { useSensorData } from "./useSensorData";

export const useGraphModal = () => {
  const [selectedSensor, setSelectedSensor] = useState<string | null>(null);
  const [showGraph, setShowGraph] = useState(false);
  const { sensorData, historicalSensorData, isConnected } = useSensorData();

  const handleSensorPress = (sensorType: string) => {
    setSelectedSensor(sensorType);
    setShowGraph(true);
  };

  const closeGraph = () => {
    setShowGraph(false);
    setSelectedSensor(null);
  };

  return {
    selectedSensor,
    showGraph,
    handleSensorPress,
    closeGraph,
    sensorData,
    historicalSensorData,
    isConnected,
  };
};
