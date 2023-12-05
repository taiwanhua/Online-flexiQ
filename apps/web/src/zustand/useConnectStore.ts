import { SendJsonMessage } from "@/hooks/useConnect";
import { RoomsWithConnectPlayerRoom } from "@repo/core/room";
import { create } from "zustand";

export type ConnectStore = RoomsWithConnectPlayerRoom;

export type ConnectionStatus =
  | "Connecting"
  | "Open"
  | "Closing"
  | "Closed"
  | "Uninstantiated";

const emptyFunction = () => {
  // empty
};

interface Store {
  connectStore: ConnectStore | null;
  setConnectStore: (connectStore: ConnectStore) => void;
  clearConnectStore: () => void;
  sendJsonMessage: SendJsonMessage;
  setSendJsonMessage: (sendJsonMessageFn: SendJsonMessage) => void;
  clearSendJsonMessage: () => void;
  connectionStatus: ConnectionStatus;
  setConnectionStatus: (connectionStatus: ConnectionStatus) => void;
  clearConnectionStatus: () => void;
}

export const useConnectStore = create<Store>((set) => ({
  connectStore: null,
  sendJsonMessage: emptyFunction,
  connectionStatus: "Closed",
  setSendJsonMessage: (sendJsonMessage) => {
    set((store) => ({ ...store, sendJsonMessage }));
  },
  clearSendJsonMessage: (): void =>
    set((store) => ({ ...store, setSendJsonMessage: emptyFunction })),

  setConnectionStatus: (connectionStatus) => {
    set((store) => ({ ...store, connectionStatus }));
  },
  clearConnectionStatus: (): void =>
    set((store) => ({ ...store, setSendJsonMessage: emptyFunction })),

  setConnectStore: (connectStore): void =>
    set((store) => {
      return { ...store, connectStore };
    }),
  clearConnectStore: (): void =>
    set((store) => ({ ...store, connectStore: null })),
}));
