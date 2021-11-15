module.exports = (sequelize, dataTypes) => {
    let alias = 'Genre';
    let cols = {
        id: {
            type: dataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: dataTypes.STRING
        }
    };
    let config = {
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: false
      };
    const Genre = sequelize.define(alias, cols, config)

    Genre.associate = function(models) {
        Genre.hasMany(models.News, { // models.Newss -> Movie es el valor de alias en movie.js
            as: "news", // El nombre del modelo pero en plural
            foreignKey: "genre_id"
        })
    }

    return Genre
}