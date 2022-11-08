exports.getPost = (req, res, next) => {
    res.status(200).json({
        posts: [{title: 'Fiest post', content: 'This is the first post!'}]
    })
}

exports.createPost = (req, res, next) => {
    console.log(" req.body >>", req.body);
    const {title, content} = req.body;
    res.status(201).json({
        message: 'post created successfully!',
        posts: [{
            id: new Date().toISOString(),
            title: title,
            content: content
        }]
    })
}