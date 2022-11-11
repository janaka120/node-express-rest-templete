const fs = require('fs');
const path = require('path');

const {validationResult} = require('express-validator/check');
const PostShcema = require('../models/post');
const UserShcema = require('../models/user');

exports.getPosts = (req, res, next) => {
    const currentPage = req.query.page || 1;
    const perPage = 2;
    let totalItems;
    PostShcema.find()
        .countDocuments()
        .then(count => {
            totalItems = count;
            return PostShcema.find()
            .skip((currentPage - 1) * perPage)
            .limit(perPage);
        })
        .then(posts => {
            if(!posts) {
                const error = new Error('Could not find posts.');
                error.status = 422;
                throw error;
            }

            res.status(200).json({
                message: 'Fetch posts successfully.',
                posts: posts,
                totalItems: totalItems
            })
        }).catch(err => {
            console.log("Get post err >>>", err);
            if(!err.status) {
                err.status = 500;
            }
            next();
        });
}


exports.createPost = (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        const error = new Error('Validation failed, entered data is incorrect.');
        error.status = 422;
        throw error;
    }
    if(!req.file) {
        const error = new Error('No image provided.');
        error.status = 422;
        throw error;
    }

    const imageUrl = req.file.path.replace("\\" ,"/"); // this image file path generated by multer when storing image in folder 
    console.log(" req.body >>", req.body);
    const {title, content} = req.body;
    let creator;
    const post = new PostShcema({
        title: title,
        content: content,
        imageUrl: imageUrl,
        creator: req.userId, // extract form jwt token
    });
    post.save()
        .then(result => {
            return UserShcema.findById(req.userId);
        })
        .then(user => {
            creator = user;
            user.posts.push(post);
            return user.save();
        }).then(result => {
            res.status(201).json({
                message: 'post created successfully!',
                post: post,
                creator: {_id: creator._id, name: creator.name}
            });
        }).catch(err => {
            console.log("Create post err >>>", err);
            if(!err.status) {
                err.status = 500;
            }
            next();
        });
}

exports.getPostDetails = (req, res, next) => {
    const postId = req.params.postId;
    PostShcema.findById(postId).then(post => {
        if(!post) {
            const error = new Error('Could not find post.');
            error.status = 422;
            throw error;
        }

        res.status(200).json({
            message: 'post fetched.',
            post: post
        })
    }).catch(err => {
        console.log("Create post err >>>", err);
        if(!err.status) {
            err.status = 500;
        }
        next();
    });
}

exports.updatePostDetails = (req, res, next) => {
    const postId = req.params.postId;
    const {title, content} = req.body;
    let imageUrl = req.body.image;
    if(req.file) {
        imageUrl = req.file.path.replace("\\","/");
    }

    if(!imageUrl) {
        const error = new Error('No file piked');
        error.status = 422;
        throw error;
    }

    PostShcema.findById(postId).then(post => {
        if(!post) {
            const error = new Error('Could not find post.');
            error.status = 422;
            throw error;
        }
        if(post.creator.toString() !== req.userId) {
            const error = new Error('Not authorized!.');
            error.status = 403;
            throw error;
        }
        if(imageUrl !== post.imageUrl) {
            clearImage(post.imageUrl);
        }
        post.title = title;
        post.content = content;
        post.imageUrl = imageUrl;
        return post;
    
    }).then(result => {
        res.status(200).json({
            message: 'post updated.',
            post: result
        })
    }).catch(err => {
        console.log("Update post err >>>", err);
        if(!err.status) {
            err.status = 500;
        }
        next();       
    });
}

exports.deletePost = (req, res, next) => {
    const postId = req.params.postId;
    PostShcema.findById(postId).then(post => {
        // check logged in user
        if(!post) {
            const error = new Error('Could not find post.');
            error.status = 422;
            throw error;
        }

        if(post.creator.toString() !== req.userId) {
            const error = new Error('Not authorized!.');
            error.status = 403;
            throw error;
        }

        clearImage(post.imageUrl);
        return PostShcema.findByIdAndRemove(postId);
    })
    .then(result => {
        return UserShcema.findById(req.userId);
    }).then(user => {
        user.posts.pull(postId);
        return user.save();
    }).then(result => {
        res.status(200).json({
            message: 'post deleted.',
            post: result
        })
    }).catch(err => {
        console.log("Delete post err >>>", err);
        if(!err.status) {
            err.status = 500;
        }
        next();       
    });
}

const clearImage = (filePath) => {
    filePath = path.join(__dirname, '../', filePath);
    // delete file
    fs.unlink(filePath, err => console.log("file delete err" >> err))
}

