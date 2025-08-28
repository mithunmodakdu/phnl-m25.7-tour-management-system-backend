/* eslint-disable no-useless-escape */
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { cloudinaryUpload } from "./cloudinary.config";
import multer from "multer";

const storage = new CloudinaryStorage({
  cloudinary: cloudinaryUpload,
  params: {
    public_id: (req, file) =>{
      const fileName = file.originalname
      .toLowerCase()
      .replace(/\s+/g, "-")   //remove whitespaces, replace with dash
      .replace(/\./g, "-")    //remove dot, replace with dash
      .replace(/[^a-z0-9\-\.]/g, "")    //remove special characters

      const extension = file.originalname.split(".").pop();

      //binary base 0, 1    hexadecimal base 0-9, A-F   Base 36 means 0-9, A-Z    
      //Math.random() = 0.235642222  --> toString(36) = 0.lljhhhhk255mukld --> substring(2) = lljhhhhk255mukld

      const uniqueFileName = Math.random().toString(36).substring(2) + "-" + Date.now() + "-" + fileName + "." + extension;

      return uniqueFileName;  
    } 
  }
});

export const multerUpload = multer({storage: storage});