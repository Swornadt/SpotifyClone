import { Song } from "../models/songModel.js";
import { User } from "../models/userModel.js";
import { Album } from "../models/albumModel.js";

export const getStats = async (req, res, next) => {
    try {
        /*we use await promise.all to make all async functions 
        run in parallel for optimization, instead of writing multiple 
        lines of async functions*/
        const [ totalSongs, totalUsers, totalAlbums, uniqueArtists ]= await Promise.all([
            Song.countDocuments(),
            User.countDocuments,
            Album.countDocuments(),

            //aggregate pipeline syntax:
            Song.aggregate([ //fetches all the songs
                {
                    $unionWith: { //combines all the songs
                        coll:"albums",
                        pipeline:[]
                    }
                },
                {
                    $group:{ //groups the artists (eliminating repetitons)
                        _id: "$artist",
                    }
                },
                { 
                    $count: "count", //counts the unique artists
                }
            ])
        ]);
        res.status(200).json({
            totalAlbums,
            totalSongs,
            totalUsers,
            totalArtists: uniqueArtists[0]?.count || 0,
        });
    } catch (error) {
        next(error);
    }
}