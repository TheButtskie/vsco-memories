//https://stackoverflow.com/questions/14544104/checkbox-check-event-listener
// Select all checkboxes with the name 'settings' using querySelectorAll.
var checkboxes = document.querySelectorAll("input[type=checkbox][name=adjust]");
var radios = document.querySelectorAll("input[type=radio][name=viewing]");
let enabledSettings = []
let enabledViewing = []

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

// Use Array.forEach to add an event listener to each radio.
radios.forEach(function(radio) {
  radio.addEventListener('change', function() {
    enabledViewing = 
      Array.from(radios) // Convert radios to an array to use filter and map.
      .filter(i => i.checked) // Use Array.filter to remove unchecked radios.
      .map(i => i.value) // Use Array.map to extract only the radio values from the array of objects.
      
    getViewingValue(enabledViewing[0])
    console.log(enabledViewing)
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

function getViewingValue(viewing_type) {
  if (viewing_type != []) {
    viewing_type = Array.from(radios) // Convert radios to an array to use filter and map.
      .filter(i => i.checked) // Use Array.filter to remove unchecked radios.
      .map(i => i.value);
  }
  var single_view = document.getElementsByClassName("single-photo")[0];
  var gallery_view = document.getElementsByClassName("photo-grid")[0];
  if (viewing_type == "single") {
    single_view.style.display = 'grid';
    gallery_view.style.display = 'none';
  } else if (viewing_type == "gallery") {
    single_view.style.display = 'none';
    gallery_view.style.display = 'grid';
  }
  return viewing_type
}


// cycle through the images
var getImgs = function(data) {
  var image_location = document.getElementsByTagName("img")[0];
  var loop_on = enabledSettings.includes("loop");
  var randomize_on = enabledSettings.includes("randomize");
  var viewing_type = getViewingValue(enabledViewing);
  var user_delay = Number(slider.value)*1000;

  if (viewing_type.includes("single")) {
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
  } else if (viewing_type.includes("gallery")) {
    // fill up the gallery with images
    var image_location = document.getElementsByClassName("card");
    var number_images = image_location.length;
    for (var i = 0; i < number_images; i++) {
      if (randomize_on) {
        image_location[i].setAttribute("src", data[getRandomInt(data.length)][0]);
      } else {
        image_location[i].setAttribute("src", data[i % data.length][0]);
      }
    }
    // randomly change the images in the gallery 
    // mindful not to change a photo that was recently loaded -- TODO
    while (i < data.length || loop_on) {
      setTimeout(function(){
        if (randomize_on) {
          image_location[getRandomInt(number_images)].setAttribute("src", data[getRandomInt(data.length)][0]);
        } else {
          image_location[getRandomInt(number_images)].setAttribute("src", data[i % data.length][0]);
        }
      }, user_delay*i);
      i++;
    }
  }
};
