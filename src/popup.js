var AUDIO_COUNT = 8;
var images = [];

function initIndex ()
{
	readImageDirectory(function (pictures) {
		document.getElementById("no_image").style.display = (pictures.length<1)?"block":"none";
		
		for (var i=0; i<pictures.length; i++) {
			var picture = pictures[i];
			var a = document.createElement("A");
			a.href = "javascript:void(0)";
			a.addEventListener("click", getImageHandler(picture), false);
			var img = document.createElement("IMG");
			img.onload = getOnloadHandler(picture, img);
			img.src = picture.url;
			images.push(img);
			a.appendChild(img);
			document.getElementById("images").appendChild(a);
		}
		
	});

	document.getElementById("labelFlip").innerHTML = chrome.i18n.getMessage("flipHorizontally");
	document.getElementById("checkboxFlip").addEventListener("change", flipImages);
}

window.onload = initIndex;

var flip = false;
function getOnloadHandler (image, img) {
	return function () {
		image.width = img.naturalWidth;
		image.height = img.naturalHeight;
	}
}

function getImageHandler(image) {
	return function () {
		chrome.tabs.query({
			active : true,
			currentWindow : true
		}, function(tabs) {
			chrome.tabs.sendMessage(tabs[0].id, {
				url : image.url,
				width: image.width,
				height: image.height,
				flip: flip
			}, function(response) {
			});
		});
	}
}
function flipImages () {
	flip = document.getElementById("checkboxFlip").checked;
	for (var i=0; i < images.length; i++) {
		images[i].style.WebkitTransform = (flip)?"scaleX(-1)":"";
	}	
}

