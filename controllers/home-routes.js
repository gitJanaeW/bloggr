const router = require('express').Router();
const sequelize = require('../config/connection');
const {Post, User, Comment} = require('../models');

router.get('/', (req, res) => {
    console.log("HOMEPAGE REACHED SUCCESSFULLY");
});

module.exports = router;