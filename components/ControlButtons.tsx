import { useCommand } from "@/hooks/useCommand";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function ControlButtons() {
  const { loading: fillLoading, send: sendFill } = useCommand("fill");
  const { loading: drainLoading, send: sendDrain } = useCommand("drain");

  return (
    <View style={styles.buttonContainer}>
      <TouchableOpacity
        style={[
          styles.button,
          fillLoading ? styles.disabledButton : styles.fillButton,
        ]}
        onPress={() => (!(fillLoading || drainLoading) ? sendFill() : null)}
      >
        <Text style={styles.buttonIcon}>⬆️</Text>
        <Text style={styles.buttonText}>Fill</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.button,
          drainLoading ? styles.disabledButton : styles.drainButton,
        ]}
        onPress={() => (!(fillLoading || drainLoading) ? sendDrain() : null)}
      >
        <Text style={styles.buttonIcon}>⬇️</Text>
        <Text style={styles.buttonText}>Drain</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
    paddingHorizontal: 20,
  },
  button: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 25,
    borderRadius: 15,
    alignItems: "center",
    marginHorizontal: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  disabledButton: {
    backgroundColor: "#e0e0e0",
    opacity: 0.6,
  },
  fillButton: {
    backgroundColor: "#3498db",
  },
  drainButton: {
    backgroundColor: "#e74c3c",
  },
  buttonIcon: {
    fontSize: 28,
    marginBottom: 6,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
});
