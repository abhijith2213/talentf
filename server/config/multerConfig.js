const multer = require ('multer')

const storage = multer.diskStorage({
    destination(req,file,callback){
        callback(null,'./public/images');
    },
    filename(req,file,callback){

        if(!file.originalname.match(/\.(jpg|jpeg|png|webp)$/)) {
            return callback( new Error('Please upload a valid image file'))
        }else{
            return callback(null,`${file.fieldname}_${Date.now()}_${file.originalname}`);
        }
    },
});

const upload = multer({storage:storage})
module.exports = upload;