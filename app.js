const express = require("express");
const morgan = require("morgan");

const postBank = require("./postBank");
const app = express();
app.use(express.static("public"));


app.use(morgan("dev"));
app.use(express.json());
app.get("/", (req, res) => {
  // FIRST GET THE LIST OF POSTS
  const posts = postBank.list();

  //THEN PREPARE SOME HTML TO SENT AS OUTPUT

  const html = `<!DOCTYPE html>
  <html>
  <head>
    <title>Wizard News</title>
    <link rel="stylesheet" href="/style.css" />
  </head>
  <body>
    <div class="news-list">
      <header><img src="/logo.png"/>Wizard News</header>
      ${posts
        .map(
          (post) => `
        <div class='news-item'>
          <p>
            <span class="news-position">${post.id}. ▲</span> <a href="/posts/${post.id}">${post.title}</a>
            <small>(by ${post.name})</small>
          </p>
          
          <small class="news-info">
            ${post.upvotes} upvotes | ${post.date}
            
          </small>
          
        </div>`
        )
        .join("")}
        
    </div>
  </body>
</html>`;
  //FINALY SEND A RESONSE
  res.send(html);
});

// SINGLE POST
app.get("/posts/:id", (req, res) => {
  const id = req.params.id;
  const post = postBank.find(id);
  if (!post.id) {
    // If the post wasn't found, just throw an error
    throw new Error("Not Found");
    
  }
  const html = `<!DOCTYPE html>
  <html>
  <head>
    <title>Wizard News</title>
    <link rel="stylesheet" href="/style.css" />
  </head>
  <body>
    <div class="news-list">
      <header><img src="/logo.png"/>Wizard News</header>
      <p>
      <span class="news-position">${post.id}. ▲</span>${post.title}
      <small>(by ${post.name})</small>
      
    </p>
    <small class="news-info">
    ${post.date}  <br> ${post.content} 
  </small>
       
    </div>
  </body>
</html>`;
  //FINALY SEND A RESONSE
  res.send(html);
  
});


// // ERROR HANDLER OPTION 1
// function errorHandler(err, req, res, next) {
//   if (err) {
//     console.log("Server ERROR")
//     return res.send(`
//     <html>
//     <body>
//     <h1>404 ERROR</h1>
//     <h3>PAGE NOT FOUND</h3>
//     <p>
    
//     <span><a href='/'>Click to go home</a></span>
//     </p>
//     </body>
//     </html>
//     `);
//   }
//   next();
// };

// app.use(errorHandler)




///ERRROR HANDLER OPTION 2
app.use((err, req, res, next) => {
  if (err) {
    
    return res.send(`
    <html>
    <body>
    <h1>404 ERROR</h1>
    <h3>PAGE NOT FOUND</h3>
    <p>
    
    <span><a href='/'>Click to go home</a></span>
    </p>
    </body>
    </html>
    `);
  }
  next();
});

const { PORT = 1337 } = process.env;
app.listen(PORT, () => {
  console.log(`App listening in port ${PORT}`);
});
