import { axiosInstance } from "@/lib/axios";
import { Album, Song, Stats } from "@/types";
import toast from "react-hot-toast";

import { create } from "zustand";

interface MusicStore {
    songs: Song[];
    albums: Album[]
    isLoading: boolean;
    error: string | null;
    currentAlbum: null | Album;
    featuredSongs: Song[];
    madeForYouSongs: Song[];
    trendingSongs: Song[];
    stats: Stats;

    fetchAlbums: () => Promise<void>;
    fetchAlbumById: (id: string) => Promise<void>;
    fetchFeaturedSongs: () => Promise<void>;
    fetchMadeForYouSongs: () => Promise<void>;
    fetchTrendingSongs: () => Promise<void>;
    fetchStats: () => Promise<void>;
    fetchSongs: () => Promise<void>;
    deleteSong: (id: string) => Promise<void>;
    deleteAlbum : (id: string) => Promise<void>;
}

export const useMusicStore = create<MusicStore>(( set ) => ({
    albums: [],
    songs: [],
    isLoading: false,
    error: null,
    currentAlbum: null,
    featuredSongs: [],
    madeForYouSongs: [],
    trendingSongs: [],
    stats: {
        totalSongs: 0,
        totalAlbums: 0,
        totalUsers: 0,
        totalArtists: 0,
    },

    fetchSongs: async () => {
        set({ isLoading: true, error: null });
        try {
            const res = await axiosInstance.get("/songs");
            set({ songs: res.data });
        } catch (error:any) {
            set({ error: error.response.data.message});
        } finally {
            set({ isLoading: false });
        }
    },

    fetchStats: async () => {
        set({ isLoading: true, error: null});
        try {
            const res = await axiosInstance.get("/stats");
            set({ stats: res.data });
        } catch (error:any) {
            set({ error: error.response.data.message });
        } finally {
            set({ isLoading: false });
        }
    },

    fetchAlbums: async () => {
        //data fetching:
        set({
            isLoading: true,
            error: null
        });

        try {
            const res = await axiosInstance.get("/albums");
            set({
                albums: res.data
            });
        } catch (error:any) {
            set({
                error: error.response.data.message
            });
        } finally {
            set({
                isLoading: false
            });
        }
    },

    fetchAlbumById: async (id:string) => {
        set({ isLoading: true, error: null });
        try {
            const res = await axiosInstance.get(`/albums/${id}`);
            set({ currentAlbum: res.data });
        } catch (error:any) {
            set({ error: error.response.data.message})
        } finally {
            set({ isLoading: false});
        }
    },

    
    fetchFeaturedSongs: async() => {
        set({ isLoading: true, error: null});
        try {
            const res = await axiosInstance.get("/songs/featured");
            set({ featuredSongs: res.data });
        } catch (error:any) {
            set({ error: error.response.data.message });
        } finally {
            set({ isLoading: false });
        }
    },

    fetchMadeForYouSongs: async() => {
        set ({ isLoading: true, error:null });
        try {
            const res = await axiosInstance.get("/songs/made-for-you");
            set({ madeForYouSongs: res.data });
        } catch (error:any) {
            set({ error: error.response.data.message });
        } finally {
            set({ isLoading: false});
        }
    },

    fetchTrendingSongs: async() => {
        set({ isLoading: true, error:null });
        try {
            const res = await axiosInstance.get("/songs/trending");
            set({ trendingSongs: res.data });
        } catch (error:any) {
            set({ error: error.response.data.message });
        } finally {
            set({ isLoading: false });
        }
    },


    deleteSong: async (id) => {
        set({ isLoading: true, error: null });
        try {  
            await axiosInstance.delete(`/admin/songs/${id}`);
            console.log("Pass");
            set( state => ({
                songs: state.songs.filter(song => song._id !== id)
            }));
            toast.success("Song deleted successfully");
        } catch (error:any) {

            console.log(error);
        } finally {
            set({ isLoading: false });
        }
    },

    deleteAlbum: async (id) => {
        set({ isLoading: true, error:null });
        try {
            await axiosInstance.delete(`/admin/albums/${id}`);
            set((state) => ({
                albums: state.albums.filter(album => album._id !== id),
                songs: state.songs.map((song) => song.albumId === state.albums.find((a) => a._id === id)?.title ? {...song, album:null} : song ),
            }));
            toast.success("Album deleted successfully");
        } catch (error:any) {
            toast.error("Error in deleting album");
        } finally {
            set({ isLoading: false });
        }
    }
}))