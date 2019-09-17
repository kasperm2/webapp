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
const userRef = db.collection("users");
let currentUser;


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
  currentUser = user;
  console.log(currentUser);
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
  // reset input fields
  document.querySelector('#name').value = "";
  document.querySelector('#mail').value = "";
  document.querySelector('#birthdate').value = "";
  document.querySelector('#phoneNumber').value = "";
  document.querySelector('#imagePreview').src = "";
}

// append user data to profile page
function appendUserData() {
  // auth user
  document.querySelector('#name').value = currentUser.displayName;
  document.querySelector('#mail').value = currentUser.email;

  // database user
  userRef.doc(currentUser.uid).get().then(function(doc) {
    let userData = doc.data();
    console.log(userData);
    if (userData) {
      document.querySelector('#birthdate').value = userData.birthdate;
      document.querySelector('#phoneNumber').value = userData.phoneNumber;
      document.querySelector('#imagePreview').src = userData.img;
    }
  });
}

// update user data - auth user and database object
function updateUser() {
  let user = firebase.auth().currentUser;

  // update auth user
  user.updateProfile({
    displayName: document.querySelector('#name').value
  });

  // update database user
  userRef.doc(currentUser.uid).set({
    img: eventImage,
    name: document.querySelector('#name').value,
    birthdate: document.querySelector('#birthdate').value,
    phoneNumber: document.querySelector('#phoneNumber').value
  }, {
    merge: true
  });
}

function appendUserData(user) {
  document.querySelector('#profil-info').innerHTML += `
  <label for="name">Navn</label>
  <input type="text" id="name" placeholder="${user.displayName}" required>
  <label for="mail">Mail</label>
  <input type="email" id="mail" placeholder="${user.email}" required>
  <label for="birthdate">Fødselsdag</label>
  <input type="text" id="birthdate" placeholder="${user.birthdate}" required>
  <label for="phoneNumber">Telefonnummer</label>
  <input type="text" id="phoneNumber" placeholder="${user.phoneNumber}" required>

  <form action="#">
    <div class="file-field upload-file6 input-field">
      <div class="btn">
        <span><i class="small material-icons">cloud_upload</i>Upload billede</span>
        <input type="file" id="imagePreview" onchange="previewImage(this.files[0])">
      </div>
      <div class="file-path-wrapper">
        <input class="file-path validate" type="text">
      </div>
    </div>
    <a href="#" onclick="updateUser()" class="waves-effect right button-align skub waves-light btn">Opdater</a>
  </form>
  `;
}

function appendMoreUserData(user) {
  document.querySelector('#profile-image').innerHTML += `
  <img src="${user.img}" alt="profil-billede">
  <h1>${user.displayName}</h1>
  `;
  console.log(users);
}


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

 // Users login


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
