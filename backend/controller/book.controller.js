const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendResponse = require("../helpers/send_response");
const fs = require('fs');
const path = require('path');
const common = require("../helpers/common");
const {
    create,
    find,
    findOne,
    updateOne,
    deleteOne, aggregation,
    countDocuments, insertmany
} = require("../helpers/query_helper");
const async = require('async');

const config = require('../config/config')


exports.bookData = async (req, res) => {

    let { title, author, description, pubYear, ISBN, searchKey } = req.body;

    let api = req.originalUrl;
    try {

        if (api == '/add-book') {
            let validator = await common.validateField(['title', 'author', 'description', 'pubYear', 'ISBN'], req.body);
            if (!validator.status) return sendResponse(res, false, '', validator.message, '', validator.errors);

            let { data: bookData } = await findOne('BOOKS', { ISBN });
            if (bookData) return sendResponse(res, false, "", "ISBN already exists");

            let { status, data: bookCreateResp } = await create('BOOKS', { title, author, description, pubYear, ISBN });
            if (!status) return sendResponse(res, false, '', "Something wrong!");

            return sendResponse(res, true, '', "Book added successfully!");

        }
        else if (api == '/update-book') {

            let validator = await common.validateField(['ISBN'], req.body);
            if (!validator.status) return sendResponse(res, false, '', validator.message, '', validator.errors);

            let { data: bookData } = await findOne('BOOKS', { ISBN });
            if (!bookData) return sendResponse(res, false, "", "Book not found!");

            let { status: updStatus, data: bookUpd } = await updateOne('BOOKS', { _id: bookData._id }, { $set: req.body });
            if (!updStatus) return sendResponse(res, false, '', "Something wrong!");

            return sendResponse(res, true, '', "Book updated successfully!");

        }
        else if (api == '/delete-book') {

            let validator = await common.validateField(['ISBN'], req.body);
            if (!validator.status) return sendResponse(res, false, '', validator.message, '', validator.errors);

            let { data: bookData } = await findOne('BOOKS', { ISBN });
            if (!bookData) return sendResponse(res, false, "", "Book not found!");

            let { status: updStatus, data: bookUpd } = await deleteOne('BOOKS', { _id: bookData._id }, { $set: req.body });
            if (!updStatus) return sendResponse(res, false, '', "Something wrong!");

            return sendResponse(res, true, '', "Book deleted successfully!");

        }
        else if (api == '/book-lists') {


            let options = common.pagination(req.body);

            let findQuery = {}

            if (searchKey) {
                findQuery = {
                    $and: [{
                        $or: [{
                            title: { $regex: new RegExp(searchKey, "i") },
                        }, {
                            ISBN: { $regex: new RegExp(searchKey, "i") }
                        }]
                    }]
                }
            }


            async.parallel({
                getData: async function () {

                    let { data } = await find('BOOKS', findQuery, { title: 1, author: 1, ISBN: 1 }, options); if (!data) return
                    return data
                },
                getCount: async function () {
                    let count = await countDocuments('BOOKS', findQuery);
                    return count

                },
            }, function (err, results) {

                if (results.getData) return sendResponse(res, true, results.getData, "", results.getCount)
            });


        }

        else if (api == '/get-single-book') {

            let validator = await common.validateField(['ISBN'], req.body);
            if (!validator.status) return sendResponse(res, false, '', validator.message, '', validator.errors);

            let { data: taskData } = await findOne('BOOKS', { ISBN }, {});
            if (!taskData) return sendResponse(res, false, '', 'No data Found!');
            return sendResponse(res, true, taskData);

        }
        else {

            return sendResponse(res, false, "", "No API Found");

        }



    } catch (err) {

        return sendResponse(res, false, "", err.message);
    }

}
