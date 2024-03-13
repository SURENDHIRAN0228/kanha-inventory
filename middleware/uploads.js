const multer = require('multer');
const uniqid = require('uniqid');
const path = require("path");

const storage = multer.diskStorage({
    destination: function(req, file, cd) {
        cd(null, 'storage/uploads')
    },
    filename: function(req, file,cd) {
        cd(null, Date.now() + uniqid() +path.extname(file.originalname))
    }
})
const uploads = multer({ storage: storage });
exports.uploads = (field) => uploads.single(field);
