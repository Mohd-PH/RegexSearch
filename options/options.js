
var profilesList = document.querySelector("#profilesList");

document.addEventListener("DOMContentLoaded", displayProfiles);



function saveButtonClicked(e){
    const id = e.target.getAttribute("storageID");
    const profileName = document.querySelector('[storageID="'+ id + '"][name="profileNameInput"]');
    const regex = document.querySelector('[storageID="'+ id + '"][name="regex"]');
    const Global = document.querySelector('[storageID="'+ id + '"][name="Global"]');
    const CaseInsensitive = document.querySelector('[storageID="'+ id + '"][name="Case-insensitive"]');
    const Multiline = document.querySelector('[storageID="'+ id + '"][name="Multiline"]');
    const IgnoreHTML = document.querySelector('[storageID="'+ id + '"][name="IgnoreHTML"]');
    const template = document.querySelector('[storageID="'+ id + '"][name="template"]');

    updateProfile(id, profileName.value, regex.value, Global.checked, CaseInsensitive.checked, Multiline.checked, template.value, IgnoreHTML.checked);
}
function deleteButtonClicked(e){
  const id = e.target.getAttribute("storageID");
  deleteProfile(id);
}


function displayProfiles() {
  var store = browser.storage.local.get({
    profiles: []
  });
  store.then(function(results) {
    var profiles = results.profiles;
    console.log(profiles);
    for (i = 0; i < profiles.length; i++) {
      console.log(profiles[i]);
      addProfileToAList(profiles[i]);

    }
  } , console.log);
}
function addProfileToAList(profile) {
  
  // fix if the profile doesn't have IgnoreHTML
  profile.IgnoreHTML = profile.IgnoreHTML ? true : false;

  var listItem = document.createElement("div");
  listItem.setAttribute("class", "col-md-6 col-xs-12");
  listItem.innerHTML = '<div class="panel panel-default  ">\
  <div class="panel-heading" storageID="' + profile.id + '"></div>\
  <div class="panel-body">\
  <div class="form-group">\
    <label for="profileNameInput">Profile Name</label>\
    <input type="text" class="form-control profileNameInput monospaced" storageID="' + profile.id + '" name="profileNameInput" placeholder="Name">\
  </div>\
  <div class="form-group">\
    <label for="regex">Regex</label>\
    <div class="input-group">\
      <span class="input-group-addon" id="slash-addon1">/</span>\
      <input type="text" class="form-control regex monospaced" storageID="' + profile.id + '" name="regex"  placeholder="Regular Expression">\
      <span class="input-group-addon" id="slash-addon2">/</span>\
    </div>\
  </div>\
  <div class="checkbox">\
    <label><input type="checkbox" storageID="' + profile.id + '" name="Global" id="globalCheckbox" ' + (profile.globalFlag ? "checked" : "") + '> Global </label>\
    <label><input type="checkbox" storageID="' + profile.id + '" name="Case-insensitive" id="caseInsensitiveCheckbox" ' + (profile.caseInsensitiveFlag ? "checked" : "") + '> Case-insensitive </label>\
    <label><input type="checkbox" storageID="' + profile.id + '" name="Multiline" id="multilineCheckbox" ' + (profile.multilineFlag ? "checked" : "") + '> Multiline </label>\
    <label><input type="checkbox" storageID="' + profile.id + '" name="IgnoreHTML" id="IgnoreHTMLCheckbox" ' + (profile.IgnoreHTML ? "checked" : "") + '> Ignore HTML </label>\
  </div>\
  <div class="form-group">\
    <label for="template">Type a custom template (Optional)</label>\
    <input type="text" class="form-control template monospaced" storageID="' + profile.id + '" name="template" placeholder="template" >\
  </div>\
  <div class=""  >\
    <button class="btn btn-primary saveButton" storageID="' + profile.id + '" id="searchButton"><span class="glyphicon glyphicon-ok"></span> Save</button>\
    <button class="btn btn-danger deleteButton" storageID="' + profile.id + '" id="searchButton"><span class="glyphicon glyphicon-remove"></span> Delete</button>\
  </div>\
  </div></div>';
  listItem.querySelector('.panel-heading').innerHTML = profile.name; // profile name  Heading
  listItem.querySelector('.profileNameInput').value = profile.name; // profile name Input
  listItem.querySelector('.regex').value = profile.regex; // regex Input
  listItem.querySelector('.template').value = profile.template; // template Input

  profilesList.appendChild(listItem);

  var saveButtons = document.getElementsByClassName("saveButton");
  saveButtons[saveButtons.length - 1].addEventListener("click", saveButtonClicked);

  var deleteButtons = document.getElementsByClassName("deleteButton");
  deleteButtons[deleteButtons.length - 1].addEventListener("click", deleteButtonClicked);
}


function deleteProfile(profileId){
  var store = browser.storage.local.get({
    profiles: []
  }).then((results) =>{
    var profiles = results.profiles;

    for (i = 0; i < profiles.length; i++) {
      if (profileId == profiles[i].id) {
        profiles.splice(i , 1);
        updateProfiles(profiles);
        break;
      }
    }
  }).catch(()=>{

  });
}

function updateProfile(profileId, newName, newRegex, newGlobal, newCase, newMultiline, newTemplate, newIgnoreHTML){
  var store = browser.storage.local.get({
    profiles: []
  }).then((results) =>{
    var profiles = results.profiles;

    for (i = 0; i < profiles.length; i++) {
      if (profileId == profiles[i].id) {
        profiles[i].name = newName;
        profiles[i].regex = newRegex;
        profiles[i].globalFlag = newGlobal;
        profiles[i].caseInsensitiveFlag = newCase;
        profiles[i].multilineFlag = newMultiline;
        profiles[i].template = newTemplate;
        profiles[i].IgnoreHTML = newIgnoreHTML;
        

        updateProfiles(profiles);
        break;
      }
    }
  }).catch(()=>{

  });
}



function updateProfiles(newProfiles) {
  var store = browser.storage.local.set({
    profiles: newProfiles
  }).then(
    () => {
       location.reload();
    }
  );
}
