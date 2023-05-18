// import "../node_modules/jquery/dist/jquery.js";
import "../node_modules/bootstrap/dist/css/bootstrap.css";
import "../node_modules/bootstrap/dist/js/bootstrap.js";
import "../css/style.css";
import "./RegexSearch.css";

// Get what we need from HTML
var searchButton = document.getElementById("searchButton");
var highlightButton = document.getElementById("highlightButton");
var nextButton = document.getElementById("nextButton");
var previousButton = document.getElementById("previousButton");
var resetButton = document.getElementById("resetButton");
var copyResultButton = document.getElementById("copyResultButton");
var saveButton_modal = document.getElementById("saveButton_modal");
var profilesList = document.getElementById("profilesList");
var profileNameInput_modal = document.getElementById("profileNameInput_modal");
var regexInput = document.getElementById("regexInput");
var regexInput_modal = document.getElementById("regexInput_modal");
var templateInput = document.getElementById("templateInput");
var templateInput_modal = document.getElementById("templateInput_modal");
var resultTextarea = document.getElementById("resultTextarea");
var globalCheckbox = document.getElementById("globalCheckbox");
var globalCheckbox_modal = document.getElementById("globalCheckbox_modal");
var caseInsensitiveCheckbox = document.getElementById("caseInsensitiveCheckbox");
var caseInsensitiveCheckbox_modal = document.getElementById("caseInsensitiveCheckbox_modal");
var multilineCheckbox = document.getElementById("multilineCheckbox");
var multilineCheckbox_modal = document.getElementById("multilineCheckbox_modal");
var IgnoreHTMLCheckbox = document.getElementById("IgnoreHTMLCheckbox");
var IgnoreHTMLCheckbox_modal = document.getElementById("IgnoreHTMLCheckbox_modal");
var matchesCount = document.getElementById("matchesCount");
var colorButton = document.getElementById("colorButton");
var customColorRadio = document.getElementById("customColor");
var customColorInput = document.getElementById("customColorInput");
var customBorderColorRadio = document.getElementById("customBorderColor");
var customBorderColorInput = document.getElementById("customBorderColorInput");
var updateColorButton = document.getElementById("updateColor");
var smallFormCheckbox = document.getElementById("smallFormCheckbox");
var fullFormCheckbox = document.getElementById("fullFormCheckbox");
var shiftHeld = false;
var highlightColor = "yellow";
var highlightBorderColor = "magenta";
var selectedItemIndex = -1;
//  Get last data from storage so user doesn't have to type it again and update saving model
getCurrent();
// Get profiles from storage
displayProfiles();

//register the Listener
browser.tabs.executeScript(null, {
  file: "/content_script.js"
});


regexInput.addEventListener('keyup', clickSearchButtonOnEnter)
templateInput.addEventListener('keyup', clickSearchButtonOnEnter)
function clickSearchButtonOnEnter(event){
  if (event.keyCode === 16) { // Shift key
    shiftHeld = false;
  }
  if (event.keyCode === 13){ // Enter key
    if(this.id === regexInput.id && shiftHeld){
      highlightButton.click();
      return;
    }
    searchButton.click()
  }
}

regexInput.addEventListener('keydown', event => {
  if (event.keyCode === 16) { // Shift key
    shiftHeld = true;
  }
});

// When search Button clicked
searchButton.addEventListener("click", (e) => {

  // Add this script to the current tab , first arguments (null) gives the current tab
  browser.tabs.executeScript(null, {
    file: "/content_script.js"
  });

  // Get current tab to connect to the Script we provided on the code above
  var gettingActiveTab = browser.tabs.query({
    active: true,
    currentWindow: true
  });
  gettingActiveTab.then((tabs) => {
    browser.tabs.sendMessage(tabs[0].id, {
      regex: regexInput.value,
      flags: getFlags(),
      template: templateInput.value,
      action: "search",
      ignoreHTML: IgnoreHTMLCheckbox.checked
    }).then(getResponse);
  });

  // callback function when we get the response from the script on the tab
  function getResponse(handleResponse, handleError) {
    // reset the result textarea
    resultTextarea.value = "";
    var matches = handleResponse.results;

    for (var i = 0; i < matches.length; i++) {
      resultTextarea.value += matches[i];
    }
    
    if (matches.length == 0 || matches == undefined){
      matchesCount.innerText = "No Matches Found";
    } else {
      matchesCount.innerText = `${matches.length} match${ matches.length > 1 ? 'es' : '' } found`;
    }
    // store current values in the storage so user doesn't have to type again when he comes back to popup
    storeCurrent();
  }
});

highlightButton.addEventListener("click", (e) => {
  // Add this script to the current tab , first arguments (null) gives the current tab
  browser.tabs.executeScript(null, {
    file: "/content_script.js"
  });

  // Get current tab to connect to the Script we provided on the code above
  var gettingActiveTab = browser.tabs.query({
    active: true,
    currentWindow: true
  });
  gettingActiveTab.then((tabs) => {
    browser.tabs.sendMessage(tabs[0].id, {
      regex: regexInput.value,
      flags: getFlags(),
      action: "highlight",
      ignoreHTML: IgnoreHTMLCheckbox.checked,
      highlightColor: highlightColor,
      highlightBorderColor: highlightBorderColor
    });
  });
  storeCurrent();
});

nextButton.addEventListener("click", (e) => {

  // Add this script to the current tab , first arguments (null) gives the current tab
  browser.tabs.executeScript(null, {
    file: "/content_script.js"
  });

  // Get current tab to connect to the Script we provided on the code above
  var gettingActiveTab = browser.tabs.query({
    active: true,
    currentWindow: true
  });
  gettingActiveTab.then((tabs) => {
    browser.tabs.sendMessage(tabs[0].id, {
      regex: regexInput.value,
      flags: getFlags(),
      template: templateInput.value,
      action: "next",
      ignoreHTML: IgnoreHTMLCheckbox.checked,
      highlightColor: highlightColor,
      highlightBorderColor: highlightBorderColor,
      selectedItemIndex:selectedItemIndex
    }).then(getResponse);
  });

  // callback function when we get the response from the script on the tab
  function getResponse(handleResponse, handleError) {
    try {
      var matches = handleResponse.results;
      if (handleResponse.selectedItemIndex > 0) {
        selectedItemIndex = handleResponse.selectedItemIndex
        storeCurrent();
        return
      }
      selectedItemIndex = handleResponse.selectedItemIndex
      // reset the result textarea
      if (selectedItemIndex <= 0) {
        resultTextarea.value = "";
        for (var i = 0; i < matches.length; i++) {
          resultTextarea.value += matches[i] + "\n";
        }
        if (matches.length == 0 || matches == undefined) {
          matchesCount.innerText = "No Matches Found";
        } else {
          matchesCount.innerText = `${matches.length} match${matches.length > 1 ? 'es' : ''} found`;
        }
      }
      // store current values in the storage so user doesn't have to type again when he comes back to popup
      storeCurrent();
    }
    catch (ex) { 
      window.eval(`console.error(ex)`);
    }
  }
});

previousButton.addEventListener("click", (e) => {

  // Add this script to the current tab , first arguments (null) gives the current tab
  browser.tabs.executeScript(null, {
    file: "/content_script.js"
  });

  // Get current tab to connect to the Script we provided on the code above
  var gettingActiveTab = browser.tabs.query({
    active: true,
    currentWindow: true
  });
  gettingActiveTab.then((tabs) => {
    browser.tabs.sendMessage(tabs[0].id, {
      regex: regexInput.value,
      flags: getFlags(),
      template: templateInput.value,
      action: "previous",
      ignoreHTML: IgnoreHTMLCheckbox.checked,
      highlightColor: highlightColor,
      highlightBorderColor: highlightBorderColor,
      selectedItemIndex:selectedItemIndex
    }).then(getResponse);
  });

  // callback function when we get the response from the script on the tab
  function getResponse(handleResponse, handleError) {
    try {
      var matches = handleResponse.results;
      if (handleResponse.selectedItemIndex != matches.length -1) {
        selectedItemIndex = handleResponse.selectedItemIndex;
        storeCurrent();
        return
      }
      selectedItemIndex = handleResponse.selectedItemIndex
      // reset the result textarea
      resultTextarea.value = "";
      for (var i = 0; i < matches.length; i++) {
        resultTextarea.value += matches[i] + "\n";
      }
      if (matches.length == 0 || matches == undefined) {
        matchesCount.innerText = "No Matches Found";
      } else {
        matchesCount.innerText = `${matches.length} match${matches.length > 1 ? 'es' : ''} found`;
      }
    // store current values in the storage so user doesn't have to type again when he comes back to popup
      storeCurrent();
    }
    catch (ex) { 
      window.eval(`console.error(ex)`);
    }
  }
});


// A function returns REGEX flags depending on user choices
function getFlags() {
  var flags = ""; // start with empty flags
  if (globalCheckbox.checked) {
    flags += "g";
  }
  if (caseInsensitiveCheckbox.checked) {
    flags += "i";
  }
  if (multilineCheckbox.checked) {
    flags += "m";
  }
  return flags;
}


// When save button (the one in the saving model) have been pressed
saveButton_modal.addEventListener("click", (e) => {
  // Get data
  var id = getID();
  var name = profileNameInput_modal.value;
  var regex = regexInput_modal.value;
  var globalFlag = globalCheckbox_modal.checked;
  var caseInsensitiveFlag = caseInsensitiveCheckbox_modal.checked;
  var multilineFlag = multilineCheckbox_modal.checked;
  var ignoreHTML = IgnoreHTMLCheckbox_modal.checked;
  var template = templateInput_modal.value;

  // Check for the name , we need it to save the profile
  if (name.length == 0) {
    $("#name_alert_modal").show();
    return;
  }
  // make new object
  profile = new profile(id , name, regex, globalFlag, caseInsensitiveFlag, multilineFlag, template, ignoreHTML);
  // add the profile to the storage
  addProfile(profile);

});


// When the user clicks on profile we need to load it
profilesList.addEventListener("click", (e) => {
  const storageID = e.target.getAttribute("storageID");
  if (storageID == 'manage'){
    browser.runtime.openOptionsPage();
  } else {
    getProfile(storageID);
  }
});

// Copy Result button event
copyResultButton.addEventListener("click", (e) => {
  resultTextarea.select();
  document.execCommand("Copy");
});


// sync modal with main inputs and store it for the next session if the user exits by mistake
regexInput.addEventListener("change", (e) => {
  updateSaveModal();
  storeCurrent();
  selectedItemIndex = -1
});
templateInput.addEventListener("change", (e) => {
  updateSaveModal();
  storeCurrent();
  selectedItemIndex = -1
});
globalCheckbox.addEventListener("change", (e) => {
  updateSaveModal();
  storeCurrent();
  selectedItemIndex = -1
});
caseInsensitiveCheckbox.addEventListener("change", (e) => {
  updateSaveModal();
  storeCurrent();
  selectedItemIndex = -1
});
multilineCheckbox.addEventListener("change", (e) => {
  updateSaveModal();
  storeCurrent();
  selectedItemIndex = -1
});
IgnoreHTMLCheckbox.addEventListener("change", (e) => {
  updateSaveModal();
  storeCurrent();
  selectedItemIndex = -1
});
resultTextarea.addEventListener("change", (e) => {
  storeCurrent();
  selectedItemIndex = -1
});

smallFormCheckbox.addEventListener("change", (e) => {
  smallFormCheckboxChange(e);
});

function smallFormCheckboxChange(e){
  if (smallFormCheckbox.checked) {
    document.querySelectorAll(".small-form").forEach((el) => {
      el.classList.remove("small-form")
      el.classList.add("big-form")
    })
    document.querySelectorAll(".full-form").forEach((el) => {
      el.classList.remove("full-form")
      el.classList.add("small-form")
    })
    fullFormCheckbox.checked=true;
  }
  storeCurrent();
}

fullFormCheckbox.addEventListener("change", (e) => {
  fullFormCheckboxChange(e);
});

function fullFormCheckboxChange(e){
  if (!fullFormCheckbox.checked) {
    document.querySelectorAll(".small-form").forEach((el) => {
      el.classList.remove("small-form")
      el.classList.add("full-form")
    })
    document.querySelectorAll(".big-form").forEach((el) => {
      el.classList.remove("big-form")
      el.classList.add("small-form")
      console.log(el)
    })
  }
  smallFormCheckbox.checked =false;
  storeCurrent();
}

// Reset Button Event
resetButton.addEventListener("click", (e) => {
  regexInput.value = "";
  templateInput.value = "";
  globalCheckbox.checked = false;
  caseInsensitiveCheckbox.checked = false;
  multilineCheckbox.checked = false;
  IgnoreHTMLCheckbox.checked = false;
  resultTextarea.value = "";
  matchesCount.innerText = "";
  selectedItemIndex = -1;
  smallFormCheckbox.checked = false;
  // Remove the highlights on the page
  
  // Add this script to the current tab , first arguments (null) gives the current tab
  browser.tabs.executeScript(null, {
    file: "/content_script.js"
  });

  // Get current tab to connect to the Script we provided on the code above
  browser.tabs.query({
    active: true,
    currentWindow: true
  }).then((tabs) => { // Send the message to remove the highlights
    browser.tabs.sendMessage(tabs[0].id, {
      action: "remove-highlights"
    });
  });
  
  // to reset the storage also
  storeCurrent();
});

// Open Color Highlight Modal
colorButton.addEventListener("click", (e) => {
  if (highlightColor && highlightColor[0] == "#") {
    customColorRadio.checked = true;
    customColorInput.value = highlightColor.substring(1);
  } else {
    document.querySelector("input[name='color'][value='" + highlightColor + "']").checked = true;
  }
  if (highlightBorderColor && highlightBorderColor[0] == "#") {
    customBorderColorRadio.checked = true;
    customBorderColorInput.value = highlightBorderColor.substring(1);
  } else {
    document.querySelector("input[name='borderColor'][value='" + highlightBorderColor + "'").checked = true;
  }
});

// Update Color Button Event
updateColorButton.addEventListener("click", (e) => {
  highlightColor = document.querySelector("input[name='color']:checked").value;
  if(highlightColor === "custom")
    highlightColor = "#" + customColorInput.value;
  highlightBorderColor = document.querySelector("input[name='borderColor']:checked").value;
  if(highlightBorderColor === "custom")
    highlightBorderColor = "#" + customBorderColorInput.value;
  storeHighlightColor();
  storeHighlightBorderColor();
});

// Update save model inputs
function updateSaveModal() {
  regexInput_modal.value = regexInput.value;
  templateInput_modal.value = templateInput.value;
  globalCheckbox_modal.checked = globalCheckbox.checked;
  caseInsensitiveCheckbox_modal.checked = caseInsensitiveCheckbox.checked;
  multilineCheckbox_modal.checked = multilineCheckbox.checked;
  IgnoreHTMLCheckbox_modal.checked = IgnoreHTMLCheckbox.checked;
}
//  === Storage functions ===

// store current data for the next session if the user exits by mistake
function storeCurrent() {
  let currentData = {
    regexInput: regexInput.value,
    templateInput: templateInput.value,
    globalCheckbox: globalCheckbox.checked,
    caseInsensitiveCheckbox: caseInsensitiveCheckbox.checked,
    multilineCheckbox: multilineCheckbox.checked,
    IgnoreHTMLCheckbox: IgnoreHTMLCheckbox.checked,
    resultTextarea: resultTextarea.value,
    selectedItemIndex:selectedItemIndex,
    smallForm: smallFormCheckbox.checked
  };
  let store = browser.storage.local.set({
    currentData
  });
  store.then(onError, onError);
}

// Get last user input, called when we start the script
function getCurrent() {
  let store = browser.storage.local.get({
    currentData: {
      regexInput: "",
      templateInput: "",
      globalCheckbox: false,
      caseInsensitiveCheckbox: false,
      multilineCheckbox: false,
      IgnoreHTMLCheckbox: false,
      resultTextarea: "",
      selectedItemIndex:-1,
      smallForm: false,
    },

    highlightColor: "yellow",
    highlightBorderColor: "magenta"
  });

  store.then(function(results) {
    regexInput.value = results.currentData.regexInput;
    templateInput.value = results.currentData.templateInput;
    globalCheckbox.checked = results.currentData.globalCheckbox;
    caseInsensitiveCheckbox.checked = results.currentData.caseInsensitiveCheckbox;
    multilineCheckbox.checked = results.currentData.multilineCheckbox;
    IgnoreHTMLCheckbox.checked = results.currentData.IgnoreHTMLCheckbox;
    resultTextarea.value = results.currentData.resultTextarea;
    selectedItemIndex = results.currentData.selectedItemIndex;
    highlightColor = results.highlightColor;
    highlightBorderColor= results.highlightBorderColor,
    smallFormCheckbox.checked = results.currentData.smallForm;
    smallFormCheckboxChange("")
    updateSaveModal();
  }, onError);
}


// add profile to the storage then update the profiles in the list
function addProfile(profile) {
  let store = browser.storage.local.get({
    profiles: []
  });
  store.then(function(results) {
    var profiles = results.profiles;
    profiles.push(profile);
    let store = browser.storage.local.set({
      profiles
    });
    store.then(null, onError);
    displayProfiles();
  });
}

// Get the profiles from storage then display them in the list
function displayProfiles() {
  let store = browser.storage.local.get({
    profiles: []
  });
  store.then(function(results) {
    var profiles = results.profiles;

    for (var i = 0; i < profiles.length; i++) {
      addProfileToAList(profiles[i]);
    }
  });
}

// simple function to append a profile to the list
function addProfileToAList(profile) {
  var listItem = document.createElement("li");
  listItem.innerHTML = '<a href="#" class="profile" storageID="' + profile.id + '">' + profile.name + '</a>';
  profilesList.appendChild(listItem);
}

// Get a profile from storage using its name then add its data to the input fields
function getProfile(profileId) {
  let store = browser.storage.local.get({
    profiles: []
  });
  store.then(function(results) {
    var profiles = results.profiles;

    for (var i = 0; i < profiles.length; i++) {
      if (profileId == profiles[i].id) {
        regexInput.value = profiles[i].regex;
        templateInput.value = profiles[i].template;
        globalCheckbox.checked = profiles[i].globalFlag;
        caseInsensitiveCheckbox.checked = profiles[i].caseInsensitiveFlag;
        multilineCheckbox.checked = profiles[i].multilineFlag;
        IgnoreHTMLCheckbox.checked = profiles[i].IgnoreHTML ? true : false;
        break;
      }
    }
  }, onError);
}


function storeHighlightColor() {
  browser.storage.local.set({ highlightColor })
    .catch(onError);
}
function storeHighlightBorderColor () {
  browser.storage.local.set({ highlightBorderColor })
    .catch(onError);
}


// to log errors :D
function onError(err) {
  console.error(err);
}


// Profile object constructer
function profile(id , name, regex, globalFlag, caseInsensitiveFlag, multilineFlag, template, IgnoreHTML) {
  this.id = id;
  this.name = name;
  this.regex = regex;
  this.globalFlag = globalFlag;
  this.caseInsensitiveFlag = caseInsensitiveFlag;
  this.multilineFlag = multilineFlag;
  this.IgnoreHTML = IgnoreHTML;
  this.template = template;
}
function getID() {
  return Math.floor((Math.random() * 99999999999) + 1);
}
