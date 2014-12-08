var AUDIO_DATA_DIR = 'data';
function readImageDirectory (callback)
{
	console.log("readImageDirectory");
	webkitRequestFileSystem(PERSISTENT, 1024*1024, function(fileSystem)
	{
		fileSystem.root.getDirectory(AUDIO_DATA_DIR, {create:true}, function(directory)
		{
			directory.createReader().readEntries (function(files) 
			{
				var pictures = [];
				if (files.length)
				{
					for (var i=0; i<files.length; i++)
					{
						var file = files[i];
						console.log("File found. " + file.toURL());
						var picture = new XOCollage.Picture({
							url: file.toURL(),
							name: file.name,
							date: new Date(),
							enabled: true,
							fileName: file.name
						});
						
						pictures.push(picture);
						
					}
				}
				XOCollage.Picture.applySavedPreferences(pictures);
				if (callback) callback(pictures);
			},
			onFileError)
		},
		onFileError)
	});
}


function onFileError (error)
{
	console.log("Error occured. " + error);
	for (var key in error)
	{
		console.log(key + "=" + error[key]);
	}
}