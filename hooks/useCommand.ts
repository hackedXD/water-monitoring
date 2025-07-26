import { database } from "@/firebase.config";
import { onValue, ref, set } from "firebase/database";
import { useState } from "react";

export const useCommand = (command: string) => {
  const [loading, setLoading] = useState(false);

  const sendCommand = (command: string) =>
    new Promise<void>((resolve, reject) => {
      const cmdRef = ref(database, "/device1/command");
      set(cmdRef, command)
        .then(() => {
          const unsubscribe = onValue(cmdRef, (snapshot) => {
            if (snapshot.val() === "ack") {
              console.log(`Command "${command}" acknowledged`);
              unsubscribe();
              resolve();
            } else {
              console.log("Command not acknowledged");
              console.log(snapshot.val());
            }
          });
        })
        .catch((error) => {
          console.error("Error sending fill command:", error);
          reject(error);
        });
    });

  return {
    loading,
    send: () => {
      setLoading(true);
      sendCommand(command)
        .then(() => setLoading(false))
        .catch(() => setLoading(false));
    },
  };
};
