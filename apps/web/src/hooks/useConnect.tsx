import { ConnectStore, useConnectStore } from "@/zustand/useConnectStore";
import { useEffect, useMemo } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { Player } from "@repo/core/room";
import { useSessionStorageState } from "@/hooks/useSessionStorageState";
import queryString from "query-string";

export interface Param {
  url?: string;
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

export function useConnect({ url: urlParam }: Param): Return {
  const [playerInfoSession, setPlayerInfoSession] =
    useSessionStorageState<Player | null>("playerInfo", null);

  const {
    connectStore,
    setConnectStore,
    setSendJsonMessage,
    setConnectionStatus,
  } = useConnectStore();

  const url = useMemo(() => {
    if (urlParam) {
      return urlParam;
    }

    return queryString.stringifyUrl({
      url: import.meta.env.VITE_WS_SERVER_URL,
      query: connectStore
        ? { ...connectStore.player }
        : { ...playerInfoSession },
    });
  }, [connectStore, playerInfoSession, urlParam]);

  const { sendJsonMessage, readyState, lastJsonMessage } =
    useWebSocket<ConnectStore>(url, {
      onOpen: (event) => {
        console.log("opened", event);
        setSendJsonMessage(sendJsonMessage);
      },
      onMessage: (event) => {
        console.log("onMessage", event);
        let nextConnectStore: ConnectStore | null | "pong" = null;
        try {
          nextConnectStore = JSON.parse(event.data) as unknown as
            | ConnectStore
            | "pong";
        } catch (error) {
          console.log(error);
        }
        if (!nextConnectStore || nextConnectStore === "pong") {
          return;
        }

        setPlayerInfoSession(nextConnectStore.player);
        setConnectStore(nextConnectStore);
      },
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
    setConnectionStatus(connectionStatus);
  }, [connectionStatus, setConnectionStatus]);

  return {
    connectionStatus,
    sendJsonMessage,
    lastJsonMessage,
  };
}
