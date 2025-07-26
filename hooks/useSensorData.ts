import { database } from "@/firebase.config";
import { get, limitToLast, onChildAdded, query, ref } from "firebase/database";
import { useEffect, useState } from "react";

interface SensorData {
  turbidity: number;
  ph: number;
  dissolvedOxygen: number;
  tds: number;
  timestamp: Date;
}

export const useSensorData = () => {
  const [sensorData, setSensorData] = useState<SensorData>();
  const [historicalSensorData, setHistoricalSensorData] = useState<
    SensorData[]
  >([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const readingsRef = ref(database, "/device1/readings");
    const initialReadingsQuery = query(readingsRef, limitToLast(10));

    get(initialReadingsQuery)
      .then((snapshot) => {
        if (!snapshot.exists()) {
          console.log("No data available");
          return;
        }

        const data: SensorData[] = [];
        snapshot.forEach((childSnapshot) => {
          const childData = childSnapshot.val();
          data.push({
            turbidity: childData.turbidity,
            ph: childData.ph,
            dissolvedOxygen: childData.do,
            tds: childData.tds,
            timestamp: childSnapshot.key
              ? new Date(parseInt(childSnapshot.key) * 1000)
              : new Date(),
          });
        });
        setSensorData(data[data.length - 1]);
        setHistoricalSensorData(data);
      })
      .catch((error) => {
        console.error("Error fetching initial readings:", error);
      });

    const unsubscribe = onChildAdded(readingsRef, (snapshot) => {
      const newData = snapshot.val();
      if (newData) {
        const newSensorData: SensorData = {
          turbidity: newData.turbidity,
          ph: newData.ph,
          dissolvedOxygen: newData.do,
          tds: newData.tds,
          timestamp: snapshot.key
            ? new Date(parseInt(snapshot.key) * 1000)
            : new Date(),
        };
        setSensorData(newSensorData);
        setHistoricalSensorData((prevData) => [...prevData, newSensorData]);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return {
    sensorData,
    historicalSensorData,
    isConnected,
  };
};

export type { SensorData };
