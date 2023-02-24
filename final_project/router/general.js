const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
    const username = req.body.username;
    const password = req.body.password;
    if (username && password) {
      if (isValid(username)) { 
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "User successfully registred. Now you can login"});
      } else {
        return res.status(404).json({message: "User already exists!"});    
      }
    } 
    return res.status(404).json({message: "Unable to register user."});
});

function promiseBookList(){
    return new Promise((resolve,reject)=>{
      resolve(books);
    })
  }
  
// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  //res.send(JSON.stringify(books, null, 4));
  promiseBookList().then( (bookList)=>res.send(JSON.stringify(bookList, null, 4)),
    (error)=>res.send("No items")
  );

});

function promiseIsbn(isbn){
    let book = books[isbn];  
    return new Promise((resolve,reject)=>{
      if (book) {
        resolve(book);
      }else{
        reject("Book no exist");
      }    
    })
  }

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  //res.send(books[isbn])
  promiseIsbn(isbn).then( (book)=>res.send(JSON.stringify(book, null, 4)),
    (error)=>res.send(error)
  );
 });
  
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here

  // get author from req
  let author =  req.params.author;
  // array for author books
  let authorBooks = [];

  // iterate for every book
  for (const [key] of Object.keys(books)) {
      // if same author put element into array of author books
      if (books[key].author === author) {
        authorBooks.push(books[key]);
      }
  }
  // response with array or author books
  res.send(authorBooks);

});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  // get title from req
  let title =  req.params.title;
  // array for title books
  let titleBooks = [];

  // iterate for every book
  for (const [key] of Object.keys(books)) {
      // if same title put element into array of title books
      if (books[key].title === title) {
        titleBooks.push(books[key]);
      }
  }
  // response with array or author books
  res.send(titleBooks);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  res.send(books[req.params.isbn].reviews)
});

module.exports.general = public_users;
