import { usePlayerStore } from "@/stores/usePlayerStore";
import { useEffect, useRef } from "react";

const AudioPlayer = () => {

    const audioRef = useRef<HTMLAudioElement>(null);
    const prevSongRef = useRef<string | null>(null);

    const { currSong, isPlaying, playNext } = usePlayerStore();

    //handling pause/play logic
    useEffect(() => {
        if(isPlaying) audioRef.current?.play();
        else audioRef.current?.pause();
    },[isPlaying]);

    //handling song end
    useEffect(() => {
        const audio = audioRef.current;

        const handleEnded = () => {
            playNext();
        }

        audio?.addEventListener("ended",handleEnded);

        return () => audio?.removeEventListener("ended", handleEnded);
    }, [playNext]);

    //handle song change:
    useEffect(() => {
        if (!audioRef.current || !currSong) return;
        const audio = audioRef.current;
        //check if it is a new song
        const isSongChange = prevSongRef.current !== currSong?.audioUrl;
        if (isSongChange) {
            audio.src = currSong?.audioUrl;
            //reset playback
            audio.currentTime = 0;
            prevSongRef.current = currSong?.audioUrl;
            if(isPlaying) audio.play();
        }
    },[currSong, isPlaying]);

    return (
        <div>
            <audio ref={audioRef} />
        </div>
    );
}

export default AudioPlayer;
