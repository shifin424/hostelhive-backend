import cloudinary from 'cloudinary'
import {CloudinaryStorage} from 'multer-storage-cloudinary'
import multer from 'multer'
import dotenv from 'dotenv'

dotenv.config()

cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key:process.env.API_KEY , 
    api_secret: process.env.API_SECRET
  });

  const storage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder: "HostelHive",
      allowedFormats: ["jpeg", "png", "jpg"],
    },
  });
  
  const fileFilter = (req, file, cb) => {
    if (!["image/png", "image/jpg", "image/jpeg"].includes(file.mimetype)) {
      return cb(new Error("File is not an image"));
    }
    return cb(null, true);
  };
  
  const upload = multer({ storage, fileFilter });
  
  const uploadMiddleware = (req, res, next) => {
    upload.single("file")(req, res, (err) => {
      if (err) {
        if (err.message === "File is not an image") {
          return res.json({ imageError: 'Selected file is not an image' });
        }
      }
      return next();
    });
  };
  
  export default uploadMiddleware;