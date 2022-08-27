const router = require('express').Router();
const {User, Post, Like, Comment} = require('../../models');

// get all user data
router.get('/', (req, res) => {
    User.findAll({
        attributes: {exclude: ['password']}
    })
    .then(data => res.json(data))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
})

// get one row of data
router.get('/:id', (req, res) => {
    User.findOne({
        attributes: {exclude: ['password']},
        where: {
            id: req.params.id
        },
        include: [
            {
                model: Post,
                attributes: ['id', 'title', 'body'] //add 'created_at' and get it working
            },
            {
                model: Comment,
                attributes: ['id', 'comment_text'], //add 'created_at' and get it working
                include: {
                    // include the title of posts user has commented on
                    model: Post,
                    attributes: ['title']
                }
            },
            {
                // include your own posts
                model: Post,
                attributes: ['title'],
                through: Like,
                as: 'liked_posts'
            }
        ]
    })
    .then(data => {
        if (!data) {
            res.status(404).json({message: 'No user found with this id'});
            return;
        }
        res.json(data);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// create a user
router.post('/', (req, res) => {
    User.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    })
    .then(data => {
        req.session.save(() => {
            req.session.user_id = data.id;
            req.session.username = data.username;
            req.session.loggedIn = true;
            res.json(data);
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

router.post('/login', (req, res) => {
    User.findOne({
        where: {
            // no id params are included in url, so we track by login email instead
            email: req.body.email
        }
    })
    .then(data => {
        if (!data) {
            res.status(404).json({message: "No user found with that email address"});
            return;
        }
        const validPassword = data.checkPassword(req.body.password);
        if (!validPassword) {
            res.status(400).json({message: "Incorrect password"});
            window.alert("Incorrect password.");
            return;
        }
    
        req.session.save(() => {
            req.session.user_id = data.user_id;
            req.session.username = data.username;
            req.session.loggedIn = true;
            res.json({user: data, message: `${data.username} logged in`});
        });
    });
})

router.post('/logout', (req, res) => {
    // if loggedIn end session
    if (req.session.loggedIn) {
        req.session.destroy(() => {
            res.status(204).end();
        });
    } else {
        // res is 404 (as in no session found to end)
        res.status(404).end();
    }
});

// update a user's username, email or password
router.put('/:id', (req, res) => {
    // pass in req.body instead to only update what's passed through
    User.update(req.body, {
        individualHooks: true,
        where: {
        id: req.params.id
        }
    })
    .then(data => {
    if (!data) {
        res.status(404).json({ message: 'No user found with this id' });
        return;
    }
    res.json(data);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

router.delete('/:id', (req, res) => {
    User.destroy({
        where: {
            id: req.params.id
        }
    })
    .then(data => {
        if (!data) {
            res.status(404).json({message: "No user found with this id"});
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