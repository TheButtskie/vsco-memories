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

// cycle through the images
var getImgs = function(data) {
  var image_location = document.getElementsByTagName("img")[0];
  for (let i = 0; i < data.length; i++) {
    setTimeout(function(){
  	  image_location.setAttribute("src", data[i][0]);
  	}, 2000*i);
  }
  image_location.setAttribute("src", ""); //reset to blank source
};
