const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid

// now is valid if it is a new username
let userswithsamename = users.filter((user)=>{
    return user.username === username
  });
  if(userswithsamename.length > 0){
    //return true;
    // if function doesExist in sample
    // but isValid has inverse logic
    return false; // repeated username KO

  } else {
    return true; // new username OK
  }
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
let validusers = users.filter((user)=>{
    return (user.username === username && user.password === password)
  });
  if(validusers.length > 0){
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  console.log("username [" + username + "] password [" + password + "]");
  if (!username || !password) {
      return res.status(404).json({message: "Error logging in"});
  }

  if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
      accessToken,username
  }
  return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  console.log("params [" + req.params + "]");
  const isbn = req.params.isbn;
  console.log("body [" + req.body + "]");
  const review = req.body.review;
  // the username is saverd in session in /login
  console.log("user [" +  req.session.authorization.username + "]");
  const username = req.session.authorization.username;
  // if book exist
  if (books[isbn]) {
    let auxBook = books[isbn];
    // put into aux book the review
    auxBook.reviews[username] = review;
    // update de book with auxBook complete with the new review
    books[isbn] = auxBook;
    return res.status(200).send("Put review OK");
}
else {
    return res.status(404).json({message: "The book is not found"});
}
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization.username;
    if (books[isbn]) {
        let book = books[isbn];
        delete book.reviews[username];
        books[isbn] = book;
        return res.status(200).send("Review  deleted OK");
    }
    else {
        return res.status(404).json({message: "The book is not found"});
    }
  });


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
