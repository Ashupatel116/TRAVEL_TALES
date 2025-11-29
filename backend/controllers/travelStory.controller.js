import { fileURLToPath } from "url";
import TravelStory from "../models/travelStory.model.js";
import { errorHandler } from "../utils/error.js";
import path from "path"
import fs from "fs"
import { error } from "console";

export const addTravelStory = async (req, res, next) => {
  const { title, story, visitedLocation, imageUrl, visitedDate } = req.body;
  const userId = req.user.id;
 console.log(req.body);

  if (!title || !story || !visitedLocation || !imageUrl || !visitedDate) {
    return next(errorHandler(400, "All fields are required"));
  }

  const parsedVisitedDate = new Date(parseInt(visitedDate));

  try {
    const travelStory = new TravelStory({
      title,
      story,
      visitedLocation,
      userId,
      imageUrl,
      visitedDate: parsedVisitedDate,
    });

    await travelStory.save();

    res.status(201).json({
      success: true,
      story: travelStory,
      message: "Your story has been added successfully",
    });
  } catch (error) {
    next(error);
  }
}

export const getAllTravelStory = async (req, res, next) =>{
  const userId = req.user.id 

  try{
    const travelStories = await TravelStory.find({userId : userId}).sort({
      isFavorite: -1 ,
    })
    res.status(200).json({stories: travelStories })
  }catch (error){
    next(error)
  }
}

export const imageUpload = async (req, res, next) => {
  try{
    if(!req.file){
      return next(errorHandler(400, "No image Uploaded "))
    }

    const imageUrl = `http://localhost:3000/uploads/${req.file.filename}`


    res.status(201).json({imageUrl})

  } catch (error){
    next(error)
  }
}

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const rootDir = path.join(__dirname , "..")

export const deleteImage = async (req, res, next) => {
      const {imageUrl} =  req.query

      if (!imageUrl){
        return next(errorHandler(400,"imageUrl not found "))
      }

      try{
        const filename = path.basename(imageUrl)

        const filePath = path.join(rootDir , "uploads", filename)
         console.log(filePath)

        // check if file exist
        if(!fs.existsSync(filePath)){
          return next(errorHandler(404 , "file not found"))
        } 

        await fs.promises.unlink(filePath)

        res.status(200).json({message: "Image Deleted Successfully"})

      }catch(error){
        next(error)
      }
}


export const editTravelStory = async (req, res, next) => {
  const {id} = req.params
  const {title , story , visitedDate , visitedLocation , imageUrl} = req.body 
  const  userId = req.user.id 

  //validate req. field 
   if (!title || !story || !visitedLocation || !imageUrl || !visitedDate) {
    return next(errorHandler(400, "All fields are required"));
  }

  const parsedVisitedDate = new Date(parseInt(visitedDate));
   

  try{
      const travelStory = await TravelStory.findOne({_id: id , userId })

      if(!travelStory){
        next(errorHandler(404 , "TravelStory Not found "))
      }

      const placeholderImageUrl = `http://localhost:3000/assets/placeholder.jpg`

      travelStory.title = title
      travelStory.story = story
      travelStory.visitedLocation = visitedLocation
      travelStory.visitedDate = parsedVisitedDate
      travelStory.imageUrl = imageUrl || placeholderImageUrl

      await travelStory.save()

      res.status(200).json({
        story: travelStory ,
        message: "Travel story updated successfull"
      })

  } catch(error){
    next(error)
  }


}

export const deleteTravelStory = async (req , res, next) =>{
  const{id} = req.params
  const userId = req.user.id

  try{
    const travelStory = await TravelStory.findOne({_id: id, userId})

    if(!travelStory){
      next(errorHandler(404,"Travel Story not found "))
    }

    // delete story 

    await travelStory.deleteOne({_id:id , userId: userId})

    // Extract the file name 

    const imageUrl = travelStory.imageUrl
    const filename = path.basename(imageUrl)

    //delete file path 
    const filepath = path.join(rootDir , "uploads" , filename)

    // check if file available 

    if(!fs.existsSync(filepath)){
      return next(errorHandler(404 , "Image not found "))
    }

    // delete the file 

    await fs.promises.unlink(filepath)

    res.status(200).json({message  :"Travel story deleted successfully "})


  }catch(error){
    next(error)
  }

}

export const updateIsFavourite = async(req, res , next ) => {
  const{id} = req.params
  const {isFavorite} = req.body
  const userId = req.user.id 
  
  

  try{
    const travelStory = await TravelStory.findOne({_id:id , userId:userId})

    if(!travelStory){
      return next(errorHandler(404 , "Travel story not found "))
    }

    travelStory.isFavorite = isFavorite

    await travelStory.save()

    res.status(200).json({story: travelStory , message: "Updated successfully "})

  } catch (error){
    next(error)
  }

}


export const searchTravelStory = async (req, res, next) => {
  const { query } = req.query;
  const userId = req.user.id;

  if (!query || query.trim() === "") {
    return next(errorHandler(400, "Search query is required"));
  }

  try {
    const searchResult = await TravelStory.find({
      userId,
      $or: [
        { title: { $regex: query, $options: "i" } },
        { story: { $regex: query, $options: "i" } },
        { visitedLocation: { $regex: query, $options: "i" } },
      ],
    }).sort({ isFavorite: -1 });

    res.status(200).json({ stories: searchResult });
  } catch (error) {
    console.error("Error searching travel stories:", error);
    next(error);
  }
};


export const filterTravelStories = async(req,res,next) =>{
  const {startDate , endDate} = req.query
  const userId = req.user.id

  try{
    const start = new Date(parseInt(startDate))
    const end = new Date(parseInt(endDate))

    const filteredStories = await TravelStory.find({
      userId : userId,
      visitedDate:{$gte: start , $lte: end},
    }).sort({isFavorite: -1})

    res.status(200).json({stories:filteredStories})
  }catch(error){
    next(error)
  }
}
