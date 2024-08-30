import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBTxHnJxkwNRfe1EEJ9Ei_mlgcZQrB2ojk",
  authDomain: "passsever-279f7.firebaseapp.com",
  projectId: "passsever-279f7",
  storageBucket: "passsever-279f7.appspot.com",
  messagingSenderId: "375802674224",
  appId: "1:375802674224:web:eb239de457d87c4ff181f5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const save = document.getElementById('save');
save.addEventListener("click", function(event) {
  event.preventDefault();

  const username = document.getElementById('username').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  
  // Check if username already exists in localStorage
  let existingUsernames = JSON.parse(localStorage.getItem('usernames')) || [];
  if (existingUsernames.includes(username)) {
    alert('Username already exists. Please choose a different username.');
    return;
  }
  
  createUserWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed up
    const user = userCredential.user;
    alert('Registered successfully');

    // Save the username to localStorage
    existingUsernames.push(username);
    localStorage.setItem('usernames', JSON.stringify(existingUsernames));

    // Save the current username to use later
    localStorage.setItem('username', username);

    // Redirect to main.html
    window.location.href = "main.html";
  })
  .catch((error) => {
    const errorMessage = error.message;
    alert(errorMessage);
  });
});
