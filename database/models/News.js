module.exports = (sequelize, dataTypes) => {
    let alias = 'News';
    let cols = {
        id: {
          type: dataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        title: {
          type: dataTypes.STRING,
        },
        description: {
            type: dataTypes.STRING,
          },
        genre_id: {
          type: dataTypes.INTEGER,
        },
        user_id: {
          type: dataTypes.INTEGER,
        },
      };
      let config = {
        paranoid: true,
        deletedAt: "softDelete",
        createdAt: "created_at",
        updatedAt: "updated_at",
        tableName: "news",
      };
    const News = sequelize.define(alias, cols, config);

    News.associate = function(models){
        News.belongsTo(models.Genre, { // models.Genre -> Genres es el valor de alias en genres.js
            as: "genres",
            foreignKey: "genre_id"
        });
        News.belongsTo(models.User, {
            as: "users",
            foreignKey: "user_id"
        });

    };

    return News
}