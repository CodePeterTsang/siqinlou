import { create } from "zustand";
import { roomListApi, sgListApi } from "./api";

type Room = {
  id: number;
  roomNo: string;
};

type Ca = {
  id: number;
  caNo: string;
};

interface State {
  roomList: [];
  geList: [];
}

interface Action {
  setRoomList: () => void;
  setGeList: (roomNo?: string, caStatus?: number) => void;
}

const useConfigStore = create<State & Action>((set, get) => ({
  roomList: [],
  geList: [],
  // user: { userNo: "", role: "", userName: "" },
  setGeList: async (roomNo?: string, caStatus?: number) => {
    if (get().roomList.length) {
      const { data } = await sgListApi({
        roomNo,
        caStatus,
      });
      set(() => ({
        geList: data.map((ca: Ca) => ({
          value: ca.caNo,
          label: ca.caNo,
        })),
      }));
    }
  },
  setRoomList: async () => {
    if (!get().roomList.length) {
      const { data } = await roomListApi({
        roomNo: "",
      });
      set(() => ({
        roomList: data.map((room: Room) => ({
          value: room.roomNo,
          label: room.roomNo,
        })),
      }));
    }
  },
  // setUser: async () => {},
}));

export const useRoomList = () => useConfigStore((state) => state.roomList);
export const useSetRoomList = () =>
  useConfigStore((state) => state.setRoomList);

export const useGeList = () => useConfigStore((state) => state.geList);
export const useSetGeList = () => useConfigStore((state) => state.setGeList);

export default useConfigStore;
