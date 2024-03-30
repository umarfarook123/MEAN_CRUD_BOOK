// NPM
const express = require('express');
const router = express.Router();
const multer = require('multer');

const storage = multer.diskStorage({
    filename: (req, res, cb) => {
        cb(null, Date.now())
    }
})


// CONTROLLERS

const { isOriginVerify, authenticateJWT } = require('../helpers/origin_check');
const { bookData} = require('../controller/book.controller');


router.post(['/add-book', '/book-lists', '/get-single-book', '/update-book','/delete-book'], bookData
);




module.exports = router;