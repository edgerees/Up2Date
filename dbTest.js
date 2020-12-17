const db = require('./models');

// db.article.create({
//   title: 'this article',
//   description: 'hello',
//   urlToImage: 'todo.png'
// }).then(function(art) {
//   console.log('Created: ', art.title)
// })

// db.article.findAll().then(function(art) {
//   console.log('Found: ', art.title)
// })


db.article.findOrCreate({
  where: {
    title: 'trump',
    source: 'is whack'
  },
  defaults: {
    description: 'Traumatised by a very jealous toy aussie, Simba is very cute but rarely comes out to play'
  }
}).then(([article, created])=>{
  db.user.findOne()
  .then(user=>{
    //associate previously loaded pet instance
    user.addArticle(article);
    console.log('Edrees' + user.name + ' is reading ' + article.title);
  })
})



