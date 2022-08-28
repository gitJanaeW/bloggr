const {Model, DataTypes} = require('sequelize');
const sequelize = require('../config/connection');

class Post extends Model {
    static like(body, models) {
        // send a user & post id to the like obj being created
        return models.Like.create({
            user_id: body.user_id,
            post_id: body.post_id
        })
        .then(() => {
            // then add the like to the post obj it's applied to
            return Post.findOne({
                where: {
                    id: body.post_id
                },
                //add 'created_at' and get it working
                attributes: [
                    'id',
                    'title',
                    'body',
                    // create/add to a row called like_count that is a number value of all the like.post_ids that match the post.id
                    [sequelize.literal('(SELECT COUNT(*) FROM like WHERE post.id = like.post_id)'), 'like_count']
                ],
                // later include:[] a list of comments associated with this post
            });
        });
    }
}

Post.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1]
            }
        },
        body: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1]
            }
        },
        user_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'user',
                key: 'id'
            }
        }
    },
    {
        sequelize,
        timestamps: false, //add 'created_at' and get it working
        freezeTableName: true,
        underscored: true,
        modelName: 'post'
    }
);

module.exports = Post;