var XOCollage = {};
XOCollage.Picture = function (options)
{
	this.url = options.url;
	this.name = options.name;
	this.date = options.date;
	this.volume = options.volume; //Percentage
	this.enabled = options.enabled;
	this.fileName = options.fileName;
};

var STORAGE_KEY_PICTURES = "sound";
// JSON save & load
XOCollage.Picture.saveAll = function ()
{
	console.log(JSON.stringify(XOCollage.Picture.list));
	localStorage[STORAGE_KEY_PICTURES] = JSON.stringify(XOCollage.Picture.list);
};
XOCollage.Picture.loadAll = function ()
{
	try
	{
		XOCollage.Picture.importedList = JSON.parse(localStorage[STORAGE_KEY_PICTURES]);
	}
	catch (ex) 
	{
		console.log(ex);
	}
};
XOCollage.Picture.importedList = [];

XOCollage.Picture.applySavedPreferences = function (pictures) 
{
	XOCollage.Picture.loadAll();
	for (var i=0; i<pictures.length; i++)
	{
		var picture = pictures[i];
		for (j=0; j<XOCollage.Picture.importedList.length; j++) 
		{
			var pref = XOCollage.Picture.importedList[j];
			if (picture.url == pref.url)
			{
				picture.name = pref.name;
				picture.enabled = pref.enabled;
			}
		}
	}
};
