
var PictureEditor = function (sound) 
{
	this.sound = sound;
	//UI
	this.checkbox = null;
	this.nameEdit = null;
	this.saveNameButton = null;
	this.renameCancelButton = null;
	this.playButton = null;
	this.renameButton = null;
	this.deleteButton = null;
	this.nameLabel = null;
	this.editSection = null;
};
// Create UI elements
PictureEditor.prototype.getLiElement = function ()
{
	var li = document.createElement("LI");
	var img = document.createElement("IMG");
	img.className = "thumb";
	img.src = this.sound.url;
	li.appendChild(img);
	li.appendChild(this.getButtonSection());
	return li;
};
PictureEditor.prototype.getButtonSection = function ()
{
	var div = document.createElement("DIV");
	div.className = "buttonSection section"
	div.appendChild(this.getManifyButton());
	div.appendChild(this.getDeleteButton());
	return div;
};
PictureEditor.prototype.getManifyButton = function ()
{
	var a = document.createElement("A");
	var icon = document.createElement("IMG");
	icon.src = "../img/icon_magnify.png";
	a.appendChild(icon);
	a.href = "#";
	a.onclick = this.getMagnifyAction();
	return a;
};

PictureEditor.prototype.getDeleteButton = function ()
{
	var a = document.createElement("A");
	var icon = document.createElement("IMG");
	icon.src = "../img/icon_delete.png";
	a.appendChild(icon);
	a.href = "#";
	a.onclick = this.getDeleteAction();
	return a;
};

// Actions

PictureEditor.prototype.getMagnifyAction = function ()
{
	var self = this;
	return function (event)
	{
		window.open(self.sound.url);
	} 
};

PictureEditor.prototype.getDeleteAction = function ()
{
	var self = this;
	return function (event)
	{
		if (window.confirm("本当に削除してよろしいですか?")) 
		{
			deleteFile(self.sound);
		}
	}
};

function deleteFile (sound)
{
	var fileName = sound.fileName;
	webkitRequestFileSystem(PERSISTENT, 1024*1024, function(fileSystem)
	{
		fileSystem.root.getDirectory(AUDIO_DATA_DIR, {create:true}, function(directory)
		{
			directory.getFile(fileName, {create:true}, function(fileEntry)
			{
				console.log(fileEntry.toURL());
				fileEntry.remove(function()
				{
					alert("削除しました");
					readImageDirectory(renderListAndSave);
				}, 
				onFileError);
			}, 
			onFileError);
		},
		onFileError);
	});
};

function renderList (pictures)
{	
	document.getElementById("no_image").style.display = (pictures.length<1)?"block":"none";
	document.getElementById("image_list").innerHTML = '';
	XOCollage.Picture.list = pictures;
	for (var i=0; i<pictures.length; i++)
	{
		var soundEditor = new PictureEditor(pictures[i]);
		document.getElementById("image_list").appendChild(soundEditor.getLiElement());
	}
}
var REGEX_FILE_TYPE_IMAGE = new RegExp("image\\/.*");
var SIZE_LIMIT = 1024 * 1024;
var NAME_LENGTH_LIMIT = 30;
function readFile (event)
{
	var file = event.target.files[0];
	console.log("File Type: " + file.type);
	for (var key in file)
	{
		console.log(key + "=" + file[key]);
	}
	var isImageFile = file.type && file.type.match(REGEX_FILE_TYPE_IMAGE);
	if (!isImageFile)
	{
		alert("画像ファイルではないようです。");
	}
	else if (file.size > SIZE_LIMIT)
	{
		alert("ファイルサイズが大きすぎます。1MB未満のファイルにしてください。");
	}
	else
	{
		var reader = new FileReader();
		reader.onload = getOnReadCallback (new Date().getTime()+"_"+file.name, file.type);
		reader.readAsArrayBuffer(file);
	}
}
function getOnReadCallback (fileName, fileType)
{
	return function (event)
	{
		if (event.target.readyState != FileReader.DONE) return;
		writeFile(fileName, fileType, event);
	}
}
function writeFile (fileName, fileType, readerEvent)
{
	webkitRequestFileSystem(PERSISTENT, 1024*1024, function(fileSystem)
	{
		fileSystem.root.getDirectory(AUDIO_DATA_DIR, {create:true}, function(directory)
		{
			directory.getFile(fileName, {create:true}, function(fileEntry)
			{
				console.log(fileEntry.toURL());
				fileEntry.createWriter(function(writer)
				{
					var blob = new Blob([readerEvent.target.result],{type: fileType});
	
					writer.onwrite = function(entry)
					{
						console.log("writing. " + entry);
					};
					writer.onwriteend = function(entry)
					{
						console.log("write complete. " + fileEntry.toURL());
						readImageDirectory(renderListAndSave);
					};
					writer.onerror = function(error)
					{
						alert("write failed : " + error);
					};
					writer.write(blob);
				}, 
				onFileError);
			}, 
			onFileError);
		},
		onFileError);
	});
}
function renderListAndSave (pictures) 
{
	renderList(pictures);
	XOCollage.Picture.saveAll();
}

var fileSelector;
var labelSave;
function initConfig ()
{
	fileSelector = document.getElementById('fileSelector');
	fileSelector.addEventListener('change', readFile);
	readImageDirectory(renderList);
}

window.onload = initConfig; 