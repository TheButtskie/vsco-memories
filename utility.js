//https://stackoverflow.com/questions/14544104/checkbox-check-event-listener
// Select all checkboxes with the name 'settings' using querySelectorAll.
var checkboxes = document.querySelectorAll("input[type=checkbox][name=adjust]");
let enabledSettings = []

/*
For IE11 support, replace arrow functions with normal functions and
use a polyfill for Array.forEach:
https://vanillajstoolkit.com/polyfills/arrayforeach/
*/

// Use Array.forEach to add an event listener to each checkbox.
checkboxes.forEach(function(checkbox) {
  checkbox.addEventListener('change', function() {
    enabledSettings = 
      Array.from(checkboxes) // Convert checkboxes to an array to use filter and map.
      .filter(i => i.checked) // Use Array.filter to remove unchecked checkboxes.
      .map(i => i.value) // Use Array.map to extract only the checkbox values from the array of objects.
      
    console.log(enabledSettings)
  })
});

// GET request
var imageList = [];
var getJSON = function(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'json';
    xhr.onload = function() {
      var status = xhr.status;
      if (status === 200) {
        callback(null, xhr.response);
      } else {
        callback(status, xhr.response);
      }
    };
    xhr.send();
};

window.onload = function() {
  const form  = document.getElementById('SearchFormInput');
  form.addEventListener('search', (event) => {
    if (form.value == null) {
      return false;
    }
    console.log(form.value)
    getJSON('https://fastapi-btest.herokuapp.com/' + form.value,
      function(err, data) {
      if (err !== null) {
        console.log('Something went wrong: ' + err);
      } else {
        console.log('Your query count: ' + data.data);
        imageList = data.data
        if (imageList.length > 0) {
          getImgs(imageList)
        }
      }
    });
    return false;
  });
}

// slider for delay
var slider = document.getElementById("myRange");
var output = document.getElementById("demo");
output.innerHTML = slider.value;

slider.oninput = function() {
  output.innerHTML = this.value;
}

// helper function inside of getImgs ~ choose random image 
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

// cycle through the images
var getImgs = function(data) {
  var image_location = document.getElementsByTagName("img")[0];
  var loop_on = enabledSettings.includes("loop");
  var randomize_on = enabledSettings.includes("randomize");
  var user_delay = Number(slider.value)*1000;

  let i = 0;
  while (i < data.length || loop_on) {
    setTimeout(function(){
      if (randomize_on) {
        image_location.setAttribute("src", data[getRandomInt(data.length)][0]);
      } else {
        image_location.setAttribute("src", data[i % data.length][0]);
      }
  	}, user_delay*i);
    i++;
  }
  image_location.setAttribute("src", ""); //reset to blank source
};
