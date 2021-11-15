module.exports = (sequelize, dataTypes) => {
    let alias = 'User';
    let cols = {
        id: {
          type: dataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        name: {
          type: dataTypes.STRING,
        },
        email: {
          type: dataTypes.STRING,
        },
        password: {
          type: dataTypes.STRING,
        }
      };
      let config = {
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: false
      };
    const User = sequelize.define(alias, cols, config);

    User.associate = function(models){
        User.hasMany(models.News, {
            as: "news",
            foreignKey: "user_id"
        })
    }


    return User
}