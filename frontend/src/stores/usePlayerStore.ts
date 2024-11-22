import { create } from "zustand";
import { Song } from "@/types";
import { useChatStore } from "./useChatStore";

interface PlayerStore {
  currSong: Song | null;
  isPlaying: boolean;
  queue: Song[];
  currIdx: number;

  initializeQueue: (songs: Song[]) => void;
  playAlbum: (song: Song[], startIdx?: number) => void;
  setCurrSong: (song: Song | null) => void;
  togglePlay: () => void;
  playNext: () => void;
  playPrev: () => void;
}

export const usePlayerStore = create<PlayerStore>((set, get) => ({
  currSong: null,
  isPlaying: false,
  queue: [],
  currIdx: -1,

  initializeQueue: (songs: Song[]) => {
    set({
      queue: songs,
      currSong: get().currSong || songs[0],
      currIdx: get().currIdx === -1 ? 0 : get().currIdx,
    });
  },

  playAlbum: (songs: Song[], startIdx = 0) => {
    if (songs.length === 0) return;

    const song = songs[startIdx];

    const socket = useChatStore.getState().socket;
    if (socket.auth) {
      socket.emit("update_activity", {
        userId: socket.auth.userId,
        activity: `Playing ${song.title} by ${song.artist}`
      })
    }
    set({
      queue: songs,
      currSong: song,
      currIdx: startIdx,
      isPlaying: true,
    });
  },

  setCurrSong: (song: Song | null) => {
    if (!song) return;

    const socket = useChatStore.getState().socket;
    if (socket.auth) {
      socket.emit("update_activity", {
        userId: socket.auth.userId,
        activity: `Playing ${song.title} by ${song.artist}`
      })
    }

    const songIdx = get().queue.findIndex((s) => s._id === song._id);
    set({
      currSong: song,
      isPlaying: true,
      currIdx: songIdx !== 1 ? songIdx : get().currIdx,
    });
  },

  togglePlay: () => {
    const willStartPlaying = !get().isPlaying;

    const currSong = get().currSong;
    const socket = useChatStore.getState().socket;
    if (socket.auth) {
      socket.emit("update_activity", {
        userId: socket.auth.userId,
        activity: willStartPlaying && currSong ? `Playing ${currSong.title} by ${currSong.artist}` : "Idle",
      });
    }

    set({
        isPlaying: willStartPlaying,
    })
  },

  playNext: () => {
    const { currIdx, queue } = get();
    const nextIdx = currIdx+1;
    
    //if there is next song
    if(nextIdx < queue.length) {
        const nextSong = queue[nextIdx];

        const socket = useChatStore.getState().socket;
        if (socket.auth) {
          socket.emit("update_activity", {
            userId: socket.auth.userId,
            activity: `Playing ${nextSong.title} by ${nextSong.artist}`
          })
        }

        set({
            currSong: nextSong,
            currIdx: nextIdx,
            isPlaying: true,
        });
    } else {
        set({ isPlaying: false });

        const socket = useChatStore.getState().socket;
        if (socket.auth) {
          socket.emit("update_activity", {
            userId: socket.auth.userId,
            activity: `Idle`
          });
        }
    }
  },

  playPrev: () => {
    const { currIdx, queue } = get();
    const prevIdx = currIdx-1;

    //if there is prev song:
    if(prevIdx >= 0) {
        const prevSong = queue[prevIdx];

        const socket = useChatStore.getState().socket;
        if (socket.auth) {
          socket.emit("update_activity", {
            userId: socket.auth.userId,
            activity: `Playing ${prevSong.title} by ${prevSong.artist}`
          });
        }

        set({
            currSong: prevSong,
            currIdx: prevIdx,
            isPlaying: false,
        })
    } else {
        set({ isPlaying: false });

        const socket = useChatStore.getState().socket;
        if (socket.auth) {
          socket.emit("update_activity", {
            userId: socket.auth.userId,
            activity: `Idle`
          });
        }
    }
  },
}));
