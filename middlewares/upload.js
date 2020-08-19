const multer = require("multer")
const path = require("path")

const storage = multer.diskStorage({
    destination:(req,res,callback) => {
        callback(null,"./uploads")
    },
    filename:(req,file,callback) => {
        console.log(file)
        callback(null,'img'+Date.now()+path.extname(file.originalname))
    }
})

let upload = multer({
    storage
})

module.exports = upload.single("uploadImage")