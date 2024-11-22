import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMusicStore } from "@/stores/useMusicStore";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { Clock, Pause, Play } from "lucide-react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

const formatDuration = (seconds:number) => {
    const min = Math.floor(seconds/60);
    const remainingSec = seconds%60;
    return `${min}:${remainingSec.toString().padStart(2, "0")}`
};

const AlbumPage = () => {
  const { albumId } = useParams();
  const { fetchAlbumById, currentAlbum, isLoading } = useMusicStore();
  const { currSong, isPlaying, playAlbum, togglePlay } = usePlayerStore();

  useEffect(() => {
    if (albumId) fetchAlbumById(albumId);
  }, [fetchAlbumById, albumId]);

  if (isLoading) return null;

  const handlePlayAlbum = () => {
    if(!currentAlbum) return;
    const isCurrAlbumPlaying = currentAlbum?.songs.some(song => song._id === currSong?._id);
    if(isCurrAlbumPlaying) togglePlay();
    else {
      playAlbum(currentAlbum?.songs, 0);
    }
  }

  const handlePlaySong = (index:number) => {
    if (!currentAlbum) return;
    playAlbum(currentAlbum?.songs, index);
  }

  return (
    <div className="h-full">
      <ScrollArea className="h-full">
        {/* Main Content */}
        <div className="relative min-h-ful">
          {/* Bg gradient */}
          <div
            className="rounded-md absolute inset-0 bg-gradient-to-b from-[#5038a0]/80 via-zinc-900/80 to-zinc-900 pointer-events-none"
            aria-hidden="true"
          />
          {/* Content */}
          <div className="relative z-10">
            <div className="flex p-6 gap-6 pb-8">
              <img
                src={currentAlbum?.imageUrl}
                alt={currentAlbum?.title}
                className="w-[240px] shadow-xl rounded"
              />
              <div className="flex flex-col justify-end">
                <p className="text-sm font-medium">Album</p>
                <h1 className="text-7xl font-bold my-4">
                  {currentAlbum?.title}
                </h1>
                <div className="flex items-center gap-2 text-sm text-zinc-100">
                  <span className="font-medium text-white">
                    {currentAlbum?.artist}
                  </span>
                  <span>. {currentAlbum?.songs.length} songs</span>
                  <span>. {currentAlbum?.releaseYear}</span>
                </div>
              </div>
            </div>

            {/* Play Button */}
            <div className="px-6 pb-4 flex items-center gap-6">
              <Button
                size="icon"
                onClick={handlePlayAlbum}
                className="w-10 h-10 rounded-full bg-green-500 hover:bg-green-400 hover:scale-105 transition-all"
              >
                {isPlaying && currentAlbum?.songs.some((song) => song._id === currSong?._id) ? (
                  <Pause className="h-7 w-7 text-black"/>
                ) : (
                  <Play className="h-7  w-7 text-black" />
                )}
              </Button>
            </div>

            {/* Table Section */}
            <div className="bg-black/20 backdrop-blur-sm">
              {/* Table Header */}
              <div className="grid grid-cols-[16px_4fr_2fr_1fr] gap-4 px-10 py-2 text-sm text-zinc-400 border-b border-white/5">
                <div>#</div>
                <div>Title</div>
                <div>Released Date</div>
                <div>
                  <Clock className="h-4 w-4" />
                </div>
              </div>

              {/* Songs List */}
              <div className="px-6">
                <div className="space-y-2 py-4">
                  {currentAlbum?.songs.map((song, index) => {
                    const isCurrSong = currSong?._id === song._id;
                  return (
                    <div
                      key={song._id}
                      onClick={() => handlePlaySong(index)}
                      className={`grid grid-cols-[16px_4fr_2fr_1fr] gap-4 px-4 py-2 text-sm text-zinc-400 hover:bg-white/5 rounded-md group cursor-pointer`}
                    >
                      <div className="flex items-center justify-center">
                        {isCurrSong && isPlaying ? (
                            <div className="size-4 text-green-500">♫</div>
                          ) : (
                            <span className="group-hover:hidden">{index + 1}</span>
                          )
                        }
                        {!isCurrSong && (
                          <Play className="h-4 w-4 hidden group-hover:block" />
                        )}
                      </div>

                      <div className="flex items-center gap-3">
                        <img
                          src={song.imageUrl}
                          alt={song.title}
                          className="size-10"
                        />
                        <div>
                          <div className={`font-medium text-white`}>
                            {song.title}
                          </div>
                          <div>{song.artist}</div>
                        </div>
                      </div>
                      <div className="flex items-center">
                          {song.createdAt.split("T")[0]}
                        </div>
                        <div className="flex items-center">
                          {formatDuration(song.duration)}
                        </div>
                    </div>
                  )})}


                </div>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default AlbumPage;
