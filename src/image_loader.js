var url = decodeURIComponent(location.href.replace(/^.*\?img\=(.*)\&.*$/, function(){return arguments[1]}));
var flip = location.href.replace(/^.*flip\=(.*)$/, function(){return arguments[1]});

document.getElementById("image").src = url;
document.getElementById("image").style.WebkitTransform = (flip=="true")?"scaleX(-1)":"";
window.onresize = function () {
	var img = document.getElementById("image");
	img.style.width = document.body.clientWidth + "px";
};

