## can validate api request headers, body by using `express-validator` lib
How it works:- adding new middleware to route file
`check` method use to validate requet headers, quary parameters 
`body` method use to validate requet body 

`
// route file
const {body} = require('express-validator/check');

router.post('/post', [
    body('title').trim().isLength({min: 5}),
    body('content').trim().isLength({min: 5})
],feedController.createPost);


// controller file
const {validationResult} = require('express-validator/check');

const errors = validationResult(req);
if(!errors.isEmpty()) {
    return res.status(422).json({
        message: 'Validation failed, entered data is incorrect.',
        errors: errors.array()
    })
}
`

## Connect to mongoDB database
Use `mongoose` library to connect to mongoDb.
`
const mongoose = require('mongoose');
const MONGODB_URL = 'Mongo DB Compass connect url';

mongoose.connect(MONGODB_URL)
.then(result => {
    app.listen(8080);
    console.log('connected to port 8080');
}).catch(err => {
    console.log(err);
});
`

## Create mongo DB schema by using mongoose

`
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const postShcema = new Schema({
    title: {
        type: String,
        required: true,
    },
    imageUrl: {
        type: String,
        required: true,
    },
    connect: {
        type: String,
        required: true,
    },
    creator: {
        type: Object,
        required: true,
    },
}, {timestamps: true}
);

// we are not directly export `postShcema`, instant of that we use `mongoose.model` export
module.exports = mongoose.model('Post', postShcema);
`

## serve files, images statically
`// app.js file
const path = require('path');

// rejister new middleware to serve static folder, root/images/sample-img.png
app.use('/images', express.static(path.join(__dirname, 'images')));
`

## rejister common error handler middlerware to send the error response
` // app.js file
app.use((error, req, res, next) => {
    console.log('common error middleware >>>', error);
    const status = error.statusCode || 500;
    const message = error.message;

    res.status(statusCode).json({message: message})
});
`

## file upload to image folder,
`
// used multer npm lib to support file upload
const multer = require('multer');

const fileStorage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'images');
    },
    filename: function(req, file, cb) {
        cb(null, uuidv4())
    }
});

const fileFilter = (req, file, cb) => {
    if(
        file.mimetype === 'images/png' ||
        file.mimetype === 'images/jpg' ||
        file.mimetype === 'images/jpeg'
    ) {
        cb(null, true)
    }else {
        cb(null, false)
    }
}

// all the image files comes under this middleware 
app.use(multer({storage: fileStorage, fileFilter: fileFilter}).single('image'))
`

## define sepearate route file in express
`
const express = require('express');

const router = express.Router();

router.put('/signup');

module.exports = router;
`