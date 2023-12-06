import { ConnectStore, useConnectStore } from "@/zustand/useConnectStore";
import { useEffect } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { isEqual } from "lodash-es";

export interface Param {
  url: string;
}

export type SendJsonMessage = ReturnType<
  typeof useWebSocket
>["sendJsonMessage"];

export type ConnectionStatus =
  | "Connecting"
  | "Open"
  | "Closing"
  | "Closed"
  | "Uninstantiated";

export interface Return {
  connectionStatus: ConnectionStatus;
  sendJsonMessage: SendJsonMessage;
  lastJsonMessage: ConnectStore;
}

export function useConnect({ url }: Param): Return {
  const {
    connectStore,
    setConnectStore,
    setSendJsonMessage,
    setConnectionStatus,
  } = useConnectStore();

  const { sendJsonMessage, readyState, lastJsonMessage } =
    useWebSocket<ConnectStore>(url, {
      onOpen: (event) => console.log("opened", event),
      heartbeat: {
        message: JSON.stringify("ping"),
        returnMessage: "pong",
        timeout: 10000,
        interval: 10000, // every 10 seconds, a ping message will be sent
      },
    });

  const connectionStatus = {
    [ReadyState.CONNECTING]: "Connecting",
    [ReadyState.OPEN]: "Open",
    [ReadyState.CLOSING]: "Closing",
    [ReadyState.CLOSED]: "Closed",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated",
  }[readyState] as ConnectionStatus;

  useEffect(() => {
    if (connectionStatus === "Open") {
      setSendJsonMessage(sendJsonMessage);
    }
    setConnectionStatus(connectionStatus);
  }, [
    connectionStatus,
    sendJsonMessage,
    setConnectionStatus,
    setSendJsonMessage,
  ]);

  useEffect(() => {
    if (
      lastJsonMessage !== null &&
      lastJsonMessage !== undefined &&
      !isEqual(connectStore, lastJsonMessage)
    ) {
      setConnectStore(lastJsonMessage);
    }
  }, [connectStore, lastJsonMessage, setConnectStore]);

  return {
    connectionStatus,
    sendJsonMessage,
    lastJsonMessage,
  };
}
