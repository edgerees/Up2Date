require('dotenv').config();
const express = require('express');
const router = express.Router();
const axios= require('axios');
const db = require('../models');

const API_KEY = process.env.API_KEY;
const passport = require('../config/ppConfig');
const methodOverride = require('method-override')
const isLoggedIn = require('../middleware/isLoggedIn');
router.use(methodOverride('_method'));


router.get('/entertainment',  async(req, res) => {
   
  try {
      const newsAPI = await axios.get(`http://newsapi.org/v2/top-headlines?country=us&category=entertainment&apiKey=${API_KEY}`)       
      // console.log(newsAPI.data)
      res.render('news/entertainment', { articles : newsAPI.data.articles})
  } catch (err) {
      if(err.response) {
          console.log(err.response.data)
          console.log(err.response.status)
          console.log(err.response.headers)
          res.render('news/entertainment', { articles : null })
      } else if(err.request) {
          res.render('news/entertainment', { articles : null })
          console.log(err.request)
      } else {
          res.render('news/entertainment', { articles : null })
          console.error('Error', err.message)
      }
  } 
})

router.get('/sports',  async(req, res) => {
   
  try {
      const newsAPI = await axios.get(`http://newsapi.org/v2/top-headlines?country=us&category=sports&apiKey=${API_KEY}`)       
      // console.log(newsAPI.data)
      res.render('news/sports', { articles : newsAPI.data.articles})
  } catch (err) {
      if(err.response) {
          console.log(err.response.data)
          console.log(err.response.status)
          console.log(err.response.headers)
          res.render('news/sports', { articles : null })
      } else if(err.request) {
          res.render('news/sports', { articles : null })
          console.log(err.request)
      } else {
          res.render('news/sports', { articles : null })
          console.error('Error', err.message)
      }
  } 
})

router.get('/news',  async(req, res) => {
   
    try {
        const newsAPI = await axios.get(`http://newsapi.org/v2/top-headlines?country=us&apiKey=${API_KEY}`)       
        // console.log(newsAPI.data)
        res.render('news/news', { articles : newsAPI.data.articles})
    } catch (err) {
        if(err.response) {
            console.log(err.response.data)
            console.log(err.response.status)
            console.log(err.response.headers)
            res.render('news/news', { articles : null })
        } else if(err.request) {
            res.render('news/news', { articles : null })
            console.log(err.request)
        } else {
            res.render('news/news', { articles : null })
            console.error('Error', err.message)
        }
    } 
})

router.get('/search', async(req, res) => {
   let search = req.query.search
    console.log(req.query.search)
    try {
        const newsAPI = await axios.get(`https://newsapi.org/v2/top-headlines?q=${search}&apiKey=${API_KEY}`)
        res.render('news/search', { articles : newsAPI.data.articles})
    } catch (err) {
        if(err.response) {
            res.render('news/search', { articles : null })
            console.log(err.response.data)
            console.log(err.response.status)
            console.log(err.response.headers)
        } else if(err.request) {
            res.render('news/search', { articles : null })
            console.log(err.request)
        } else {
            res.render('news/search', { articles : null })
            console.error('Error', err.message)
        }
    } 
})

router.post('/news/userArticles', isLoggedIn, (req, res) => {
  db.user.findOne({
    where: { id: req.user.id}
  }).then((user) => {
    console.log(req.body);
    db.article.findOrCreate({
      where: {
        title: req.body.articleTitle,
        description: req.body.articleDescription,
        urlToImage: req.body.articleImage,
        url: req.body.articleUrl,
      },
      defaults: {
        title: req.body.title,
        urlToImage: req.body.articleImage,
        publishedAt: req.body.articlePublishedAt,
        description: req.body.articleDescription,
        url: req.body.articleUrl,
      }
    }).then((articleReport) => {
      const article = articleReport[0]
      article.addUser(user).then(() => {
        res.redirect('/news/userArticles')

      }).catch(err => {
        console.log(err);
        res.status(400).render('404')
    })
    })
  })
  
})
router.get('/userArticles', isLoggedIn, (req, res) => {
  db.user.findOne({
    where: { id: req.user.id },
    include: db.article
  }).then((user) => {
    if (!user) throw Error()
    db.article.findAll().then((allArticles => {
      let userArticles = allArticles.filter((cat) => {
        return user.articles.map((c) => c.id).includes(cat.id)
      })
      res.render('news/userArticles', {articles: userArticles})
    })).catch(err => {
      console.log(err);
      res.status(400).render('404')
  })  
  })
})

router.delete('/', isLoggedIn, function (req, res) {
  console.log(req.body);
  db.userArticle.destroy({
      where: {
          userId: req.user.id,
          articleId: req.body.articleId
      }
  })
  .then((_project) => {
      res.redirect('/userArticles')
  }).catch(err => {
    console.log(err);
    res.status(400).render('404')
})
})

module.exports = router;

