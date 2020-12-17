'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class article extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.article.belongsToMany(models.user, { through: 'userArticle'})
    }
  };
  article.init({
    title: DataTypes.STRING(9000),
    source: DataTypes.STRING(9000),
    description: DataTypes.STRING(9000),
    publishedAt: DataTypes.DATE,
    url: DataTypes.STRING(9000),
    urlToImage: DataTypes.STRING(9000),

  }, {
    sequelize,
    modelName: 'article',
  });
  return article;
};