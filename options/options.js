
var profilesList = document.querySelector("#profilesList");

document.addEventListener("DOMContentLoaded", displayProfiles);



function saveButtonClicked(e){
    const id = e.target.getAttribute("storageID");
    const profileName = document.querySelector('[storageID="'+ id + '"][name="profileNameInput"]');
    const regex = document.querySelector('[storageID="'+ id + '"][name="regex"]');
    const Global = document.querySelector('[storageID="'+ id + '"][name="Global"]');
    const CaseInsensitive = document.querySelector('[storageID="'+ id + '"][name="Case-insensitive"]');
    const Multiline = document.querySelector('[storageID="'+ id + '"][name="Multiline"]');
    const template = document.querySelector('[storageID="'+ id + '"][name="template"]');

    updateProfile(id, profileName.value, regex.value, Global.value, CaseInsensitive.value, Multiline.value, template.value)
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
  var listItem = document.createElement("div");
  listItem.setAttribute("class", "col-sm-6");
  listItem.innerHTML = '<div class="panel panel-default  ">\
  <div class="panel-heading" storageID="' + profile.id + '"> ' + profile.name + '</div>\
  <div class="panel-body">\
  <div class="form-group">\
    <label for="profileNameInput">Profile Name</label>\
    <input type="text" class="form-control" storageID="' + profile.id + '" name="profileNameInput" placeholder="Name" value="' + profile.name + '" >\
  </div>\
  <div class="form-group">\
    <label for="regex">Regex</label>\
    <div class="input-group">\
      <span class="input-group-addon" id="slash-addon1">/</span>\
      <input type="text" class="form-control" storageID="' + profile.id + '" name="regex"  placeholder="Regular Expression" value="' + profile.regex + '">\
      <span class="input-group-addon" id="slash-addon2">/</span>\
    </div>\
  </div>\
  <div class="checkbox">\
    <label><input type="checkbox" storageID="' + profile.id + '" name="Global" id="globalCheckbox" ' + (profile.globalFlag ? "checked" : "") + '> Global </label>\
    <label><input type="checkbox" storageID="' + profile.id + '" name="Case-insensitive" id="caseInsensitiveCheckbox" ' + (profile.caseInsensitiveFlag ? "checked" : "") + '> Case-insensitive </label>\
    <label><input type="checkbox" storageID="' + profile.id + '" name="Multiline" id="multilineCheckbox" ' + (profile.multilineFlag ? "checked" : "") + '> Multiline </label>\
  </div>\
  <div class="form-group">\
    <label for="template">Type a custom template (Optional)</label>\
    <input type="text" class="form-control" storageID="' + profile.id + '" name="template" placeholder="template" value="' + profile.template +'">\
  </div>\
  <div class=""  >\
    <button class="btn btn-primary saveButton" storageID="' + profile.id + '" id="searchButton"><span class="glyphicon glyphicon-ok"></span> Save</button>\
    <button class="btn btn-danger deleteButton" storageID="' + profile.id + '" id="searchButton"><span class="glyphicon glyphicon-remove"></span> Delete</button>\
  </div>\
  </div></div>';
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

function updateProfile(profileId, newName, newRegex, newGlobal, newCase, newMultiline, newTemplate){
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
