import { Song } from "../models/songModel.js";
import { Album } from "../models/albumModel.js";
import { User } from "../models/userModel.js";
import cloudinary from "../lib/cloudinary.js";

//helper function for cloudinary:
const uploadToCloudinary = async (file) => {
    try {
        const result = await cloudinary.uploader.upload(file.tempFilePath, {
            resource_type: "auto",
        })
        return result.secure_url;
    } catch (error) {
        console.log("Error in uploadToCloudinary", error);
        throw new Error ("Error in uploading to Cloudinary");
        next(error);

    }
}

//main admin functions:
export const createSong = async (req,res,next) => {
    try {
        if (!req.files || !req.files.audioFile || !req.files.imageFile) {
            return res.status(400).json({ message: "Please upload all files "});
        }

        const {title, artist, albumId, duration} = req.body;
        const audioFile = req.files.audioFile;
        const imageFile = req.files.imageFile;
        
        const audioUrl = await uploadToCloudinary(audioFile);
        const imageUrl = await uploadToCloudinary(imageFile);

        const song = new Song({
            title,
            artist,
            audioUrl,
            imageUrl,
            duration,
            albumId: albumId || null
        })
        await song.save();
        
        //if song belongs to an album then update the album's songs array
        if (albumId) {
            await Album.findByIdAndUpdate(albumId, {
                $push: {songs:song._id},
            })
        }
        res.status(201).json(song);
    } catch (error) {
        console.log("Error in createSong", error);
        nextTick(error);
    }
}

export const deleteSong = async (req, res, next) => {
    try {
        const { id } = req.params;
        const song = await Song.findById(id);

        //if song belongs to album, we need to update the album array:
        if (song.albumId) {
            await Album.findByIdAndUpdate(song.albumId, {
                $pull: { songs: song._id },
            })
        }
        await Song.findByIdAndDelete(id);
        res.status(200).json({ message: "Song deleted successfully "});
    } catch (error) {
        console.log("Error in song deletion ", error);
        next(error);
    }
}

export const createAlbum = async (req, res, next) => {
    try {
        const { title, artist, releaseYear } = req.body;
        const { imageFile } = req.files;
        
        const imageUrl = await uploadToCloudinary(imageFile);

        const album = new Album({
            title,
            artist,
            imageUrl,
            releaseYear
        });
        await album.save();
        
        res.status(201).json(album);
    } catch (error) {
        console.log("Error in createAlbum", error);
        next(error);
    }
}

export const deleteAlbum = async (req, res, next) => {
    try {
        const { id } = req.params;
        await Song.deleteMany({ albumId: id});
        await Album.findByIdAndDelete(id);
        res.status(200).json({ message: "Album deleted successfully" });
    } catch (error) {
        console.log("Error in deleteAlbum", error);
        next(error);
    }
}   

export const checkAdmin = async (req, res, next) => {
	try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized access" });
        }
        console.log("Admin email from ENV: admincontroller", process.env.ADMIN_EMAIL);
        const currentUser = await clerkClient.users.getUser(req.auth.userId);
        const isAdmin = process.env.ADMIN_EMAIL === currentUser.primaryEmailAddress?.emailAddress;

        return res.status(200).json({
            message: "Admin check successful",
            admin: isAdmin, // Return the admin status dynamically.
        });
        
    } catch (error) {
        console.error("Error in checkAdmin:", error);
        return res.status(500).json({ message: "Server error" });
    }
};