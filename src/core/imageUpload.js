import multer, { diskStorage } from "multer";
import dirname from 'path';
import fileURLToPath from 'url';

var storage = diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads');
  },
  filename: function (req, file, cb) {
    cb(null, `${file.fieldname}_${Date.now()}${dirname.extname(file.originalname)}`);
  },
});
var upload = multer({ storage: storage });

export default upload;