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
  apiKey: "AIzaSyD12x3NRaz7apxsiO4Aaro56Iqt0tAJcjg",
  authDomain: "web-applikation-2d72a.firebaseapp.com",
  databaseURL: "https://web-applikation-2d72a.firebaseio.com",
  projectId: "web-applikation-2d72a",
  storageBucket: "web-applikation-2d72a.appspot.com",
  messagingSenderId: "618467941437",
  appId: "1:618467941437:web:55e26fce9ee0c50ce75e54"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const vareRef = db.collection("indkob");
const planRef = db.collection("mealplan");
//const imgRef = db.collection("images");

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

// Begyndelse af images funktion

//imgRef.onSnapshot(function(snapshotData) {
  //let images = snapshotData.docs;
  //appendMoreUserData(images);
//});

//function appendMoreUserData(images){
  //document.querySelector('#profile-img').innerHTML +=`
  //`;
//};

// Show date

// var today = new Date();
// var day = today.getDay();
// var daylist = ["Søndag","Mandag","Tirsdag","Onsdag","Torsdag","Fredag","Lørdag"];
// var hour = today.getHours();
// var min = today.getMinutes();
//
//
// var todayHTML = document.getElementById("todayHTML");
//
// todayHTML.innerHTML = daylist[day];


// Begyndelse af madplans funktion

planRef.onSnapshot(function(snapshotData) {
  let mealplan = snapshotData.docs;
  appendMealplan(mealplan);
});

function appendMealplan(mealplan){
  let htmlTemplate = "";
    for (let mad of mealplan) {
    htmlTemplate += `
    <div class="aligments3">
    <p id="day-of-week">MANDAG 16/9</p>
    <h3 id="title-header">${mad.data().title}</h3>
    <p id="small-titles2">Personer</p>
    <span></span>
    <p id="small-titles2">Kommentare</p>
    <span id="kommentar-data">${mad.data().comment}</span>
    <a href="${mad.data().link}" class="waves-effect waves-light btn button-klar">SE OPSKRIFT</a>
    <img src="${mad.data().img}" alt="mad">
    </div>
    `;
  }
  document.querySelector('#card-text4').innerHTML = htmlTemplate;
}

let eventImage = "";

function createMealplan() {
  console.log("Hej");
  let recipeTitle = document.querySelector('#food-input');
  let writeComment = document.querySelector('#commentary-input');
  let linkRecipe = document.querySelector('#recipe-link');

  console.log(recipeTitle.value);
  console.log(writeComment.value);
  console.log(linkRecipe.value);
  console.log(eventImage);


let newMealplan = {
  title: recipeTitle.value,
  comment: writeComment.value,
  link: linkRecipe.value,
  img: eventImage
};

planRef.add(newMealplan);

}

function previewImage(file){
  if (file){
    let reader = new FileReader();
    reader.onload = function(event) {
      eventImage = event.target.result;
    };
    reader.readAsDataURL(file);
  }
}





// Materilize Carousel

let elems = document.querySelectorAll('.carousel');
let options = {
  fullWidth: true,
  indicators: true
};
let instances = M.Carousel.init(elems, options);




 // Materilize dropodown

 document.addEventListener('DOMContentLoaded', function() {
   var elems = document.querySelectorAll('select');
   var instances = M.FormSelect.init(elems);
 });


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
      <button onclick="deleteVare('${vare.id}');" class="hide-delete"><i class="material-icons">clear</i></button>
      <label>
        <input type="checkbox" / class="toggle-edit">
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


// ========== DELETE VARE ==========
function deleteVare(id) {
  // console.log(id);
  vareRef.doc(id).delete();
}

// ========= DELETE ALLE VARER ====

function clearVare(id) {
  // console.log(id);
  vareRef.doc(id).delete();
}

// ========== TOGGLE ON / OFF KNAP VARE ============
function editVare() {
  let deleteIndkob = document.querySelectorAll(".hide-delete");
  for (let element of deleteIndkob) {
    if (element.style.display === "none") {
      element.style.display = "inline-block";
    } else {
      element.style.display = "none";
    }
  }
}
