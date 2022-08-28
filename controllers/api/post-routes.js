// NOTE: get routes are not working due to SQL syntax
const router = require('express').Router();
const sequelize = require('sequelize');
const {User, Post, Like, Comment} = require('../../models');
const withAuth = require('../../utils/auth');

// get all posts
router.get('/', (req, res) => {
    Post.findAll({
        //add 'created_at' and get it working
        attributes: [
            'id',
            'title',
            'body',
            [sequelize.literal('(SELECT COUNT(*) FROM like WHERE post.id = like.post_id)'), 'like_count']
        ],
        include: [
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'user_id'],
                include: {
                    // get the username of the commenter
                    model: User,
                    attributes: ['username']
                }
            },
            {
                // get the username of the poster
                model: User,
                attributes: ['username']
            }
        ]
    })
    .then(data => res.json(data))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    })
});

// get a single post
router.get('/:id', (req, res) => {
    Post.findOne({
        where: {
            id: req.params.id
        },
        //add 'created_at' and get it working
        attributes: [
            'id',
            'title',
            'body',
            [sequelize.literal('(SELECT COUNT(*) FROM like WHERE post.id = like.post_id)'), 'like_count']
        ],
        include: [
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'post_id', 'user_id'], //add 'created_at' and get it working
                include: {
                    model: User,
                    attributes: ['username']
                }
            },
            {
                model: User,
                attributes: ['username']
            }
        ]
    })
    .then(data => {
        if (!data) {
            res.status(400).json({message: 'No post found wit this id'});
            return;
        }
        res.json(data);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// create a post
router.post('/', withAuth, (req, res) => {
    Post.create({
        title: req.body.title,
        body: req.body.body
    })
    .then(data => res.json(data))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    })
});

// like a post

// edit a post
router.put('/:id', (req, res) => {
    Post.update(
        {
            title: req.body.title,
            body: req.body.body
        },
        {
            where: {
                id: req.params.id
            }
        }
    )
    .then(data => {
        if (!data) {
            res.status(404).json({message: 'No post found with this id'});
            return;
        }
        res.json(data);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// delete post
router.delete('/:id', (req, res) => {
    Post.destroy({
        where: {
            id: req.params.id
        }
    })
    .then(data => {
        if (!data) {
            res.status(404).json({message: 'No post found with this id'});
            return;
        }
        res.json(data);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

module.exports = router;