const router = require('express').Router();
const {User, Post, Comment, Vote} = require('../../models');
const withAuth = require('../../utils/auth');

// get all comments
router.get('/', withAuth, (req, res) => {
    Comment.findAll()
    .then(data => res.json(data))
    .catch(err=> {
        console.log(err);
        res.status(500).json(err);
    });
});

router.get('/:id', withAuth, (req, res) => {
    Comment.findOne({
        where: {
            id: req.params.id
        }
    })
    .then(data => res.json(data))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

router.post('/', withAuth, (req, res) => {
    Comment.create({
        comment_text: req.body.comment_text
    })
    .then(data => res.json(data))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// if there's time, add the feature to edit comments
router.put('/:id', withAuth, (req, res) => {
    Comment.update(req.body.comment_text, {
        where: {
            id: req.params.id
        }
    })
    .then(data => res.json(data))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    })
});

router.delete('/:id', (req, res) => {
    Comment.destroy({
        where: {
            id: req.params.id
        }
    })
    .then(data => {
        if (!data) {
            res.status(404).json({message: 'No comment found with this id'});
            return;
        }
        res.json(data)
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

module.exports = router;