"use strict";

// hide all pages
function hideAllPages() {
  let pages = document.querySelectorAll(".page");
  for (let page of pages) {
    page.style.display = "none";
  }
}

// show page or tab
function showPage(pageId) {
  hideAllPages();
  document.querySelector(`#${pageId}`).style.display = "block";
  location.href = `#${pageId}`;
  setActiveTab(pageId);
}

// sets active tabbar/ menu item
function setActiveTab(pageId) {
  let pages = document.querySelectorAll(".tabbar2 a");
  for (let page of pages) {
    if (`#${pageId}` === page.getAttribute("href")) {
      page.classList.add("active");
    } else {
      page.classList.remove("active");
    }

  }
}

// set default page
function setDefaultPage() {
  let page = "home";
  if (location.hash) {
    page = location.hash.slice(1);
  }
  showPage(page);
}


function showLoader(show) {
  let loader = document.querySelector('#loader');
  if (show) {
    loader.classList.remove("hide");
  } else {
    loader.classList.add("hide");
  }
}

// ========== Firebase sign in functionality ========== //

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCr9783mNpQFd0rbxsz76boqAvcB7g6Jyk",
  authDomain: "niels-hh.firebaseapp.com",
  databaseURL: "https://niels-hh.firebaseio.com",
  projectId: "niels-hh",
  storageBucket: "niels-hh.appspot.com",
  messagingSenderId: "123409531330",
  appId: "1:123409531330:web:84e712137cf12b4f19165b"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const vareRef = db.collection("indkob");

// Firebase UI configuration
const uiConfig = {
  credentialHelper: firebaseui.auth.CredentialHelper.NONE,
  signInOptions: [
    firebase.auth.EmailAuthProvider.PROVIDER_ID,
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    firebase.auth.FacebookAuthProvider.PROVIDER_ID
  ],
  signInSuccessUrl: '#home',
};

// Init Firebase UI Authentication
const ui = new firebaseui.auth.AuthUI(firebase.auth());

// Listen on authentication state change
firebase.auth().onAuthStateChanged(function(user) {
  let tabbar = document.querySelector('#tabbar2');
  console.log(user);
  if (user) { // if user exists and is authenticated
    setDefaultPage();
    tabbar.classList.remove("hide");
    appendUserData(user);
  } else { // if user is not logged in
    showPage("login");
    tabbar.classList.add("hide");
    ui.start('#firebaseui-auth-container', uiConfig);
  }
  showLoader(false);
});

// sign out user
function logout() {
  firebase.auth().signOut();
}

function appendUserData(user) {
  document.querySelector('#profile').innerHTML += `
    <h3>${user.displayName}</h3>
    <p>${user.email}</p>
  `;
}

// ------- her begynder Indkøbs funktionen -------- //
// watch the database ref for changes
vareRef.onSnapshot(function(snapshotData) {
  let indkob = snapshotData.docs;
  appendIndkob(indkob);
});

// append VARE to the DOM
function appendIndkob(indkob) {
  let htmlTemplate = "";
  for (let vare of indkob) {
    // console.log(vare.id);
    console.log(vare.data().vare);
    htmlTemplate += `
    <p>
      <label>
        <input type="checkbox" />
        <span>${vare.data().vare}</span>
      </label>
    </p>
    `;
  }
  document.querySelector('#scrollable').innerHTML = htmlTemplate;
  // RYDDER INPUT FELT EFTER SUBMIT
  document.getElementById('vare').value='';
  //
}

// add a new VARE to firestore (database)
function createVare() {
  // references to the inoput fields
  let vareInput = document.querySelector('#vare');
  console.log(vareInput.value);

  let newVare = {
    vare: vareInput.value,
  };

  vareRef.add(newVare);
}
