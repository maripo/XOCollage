var XOC = function (imgInfo) {
	var imgSrc = imgInfo.url;
	var iframe = document.createElement("iframe");
	iframe.src = chrome.extension.getURL("html/image_loader.html?img="+encodeURIComponent(imgInfo.url)+"&flip=" + imgInfo.flip);
	
	this.div = document.createElement("DIV");
	this.div.style.position = "absolute";
	this.div.style.top = document.body.scrollTop + "px";
	this.div.style.zIndex = 9999;
	this.div.appendChild(iframe);
	this.div.className = "hosuto_container";
	
	var slider = document.createElement("INPUT");
	slider.type = "range";
	slider.min = XOC.MIN_SIZE;
	slider.max = XOC.MAX_SIZE;
	slider.value = XOC.DEFAULT_SIZE;
	
	this.naturalWidth = imgInfo.width;
	this.naturalHeight = imgInfo.height;

	this.iframe = iframe;
	
	iframe.style.width = this.naturalWidth + "px";
	iframe.style.height = this.naturalHeight + "px";
	iframe.frameBorder = 0;
	
	slider.addEventListener("input", XOC.getOnChangeHandler(slider, this, this.div) , false);
	this.div.appendChild(slider);
	var cover = document.createElement("DIV");
	cover.style.width = this.naturalWidth + "px";
	cover.style.height = this.naturalHeight + "px";
	cover.style.position = "absolute";
	cover.style.left = 0;
	cover.style.top = 0;
	cover.style.zIndex = 999;
	this.cover = cover;
	this.div.appendChild(cover);
	slider.max = 1800;
	slider.style.zIndex = 1000;
	new Draggable(this.div, {});
};

XOC.getOnChangeHandler = function (slider, obj, container) {
	return function () {
		var width = slider.value;
		var height = slider.value * obj.naturalHeight/ obj.naturalWidth;
		obj.iframe.style.width = width + "px";
		obj.iframe.style.height = height + "px";
		obj.cover.style.width = width + "px";
		obj.cover.style.height = height + "px";
		container.style.width = slider.value + "px";
	}
	
}

XOC.DEFAULT_SIZE = 600;
XOC.MAX_SIZE = 2400;
XOC.MIN_SIZE = 240;
XOC.IMAGE_PREFIX = "img/XOC";
XOC.IMAGE_EXT = "png";

XOC.prototype.add = function (target) {
	target.appendChild(this.div);
};


chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if (!XOC.cssDone) {
		XOC.cssDone = true;
		var css = document.createElement("link");
		css.setAttribute("rel", "stylesheet");
		css.setAttribute("type", "text/css");
		css.setAttribute("href", chrome.extension.getURL("css/hosuto.css"));
		document.getElementsByTagName("HEAD")[0].appendChild(css);
	}
	window.setTimeout();
	new XOC(request, request.flip).add(document.body);
});