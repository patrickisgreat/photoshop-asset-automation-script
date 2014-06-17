#target photoshop/*Let's define the algorithm: =)for Loop(count) {	1.)While we have assets -- Open Source shadow Asset recursing through list of dirs.	2.)Create a blank Merge document of the same size.	3.)Duplicate single layer from shadow asset into merge document.	4.)Close shadow asset without saving.	5.)Open the source vehicle asset that corresponds to the shadow file.	6.)Duplicate layer from source vehicle asset into merge document.	7.)Close source vehicle asset without saving.	8.)Scale the merge document to 68%;	9.)Resize merge document canvas to 1200x743 with TOPCENTER anchorPosition.	10.)Resize merge document canvas to 1200X651 with BOTTOMCENTER anchorPosition.	11.)Create new directory according to predefined taxonomy.	12.)Save merge document as copy in new sub directory named according to M. Wallace's structure.	13.)Close Merge Document without saving.}*//* Patrick Bennett -- blacQube -- June 2014 *///accepts path parameter where path is the top level -- this has a recursive call that passes 'this' to traverse sub directories. var buildVehicle = function(primaryPath, shadowPath) {          // uncomment the line below to cause Photoshop to start its debugger at this point	// $.level = 1; debugger;        // Create new folder object based on primary asset path string      var primaryFolder = new Folder(primaryPath);        // Get all files in the current primary asset folder      var primaryFiles = primaryFolder.getFiles();    // Create new folder object based on shadow asset path string    var shadowFolder = new Folder(shadowPath);    // Get all files in the current shadow asset folder    var shadowFiles = shadowFolder.getFiles();        // Loop over the files in the files object      for (var i = 0; i < primaryFiles.length; i++)      {          // Convert the file path object to a string for matching purposes (match only works on String objects)          var fileString = String(primaryFiles[i]);       	// set the shadow file variable for this time round the loop       	var shadowFileRef = shadowPath+i+'.png';       	//alert(fileRef);  	    // Check if the file is an instance of a file  	    // else call the traverse folder recursively with the current folder as an argument  	    if (primaryFiles[i] instanceof File)  	    {                                // Check if the file contains the right extension                 if (fileString.match(/.(jpg|tif|psd|bmp|gif|png)$/))                 {                  	// File type is good -- run PS subroutine.                	// open the shadow file                    var shadowFile = open(new File(shadowFileRef));                	// create a merge file that will contain both images.                    var mergedDoc = app.documents.add(shadowFile.width, shadowFile.height,                     	shadowFile.resolution, "Merged_File", NewDocumentMode.RGB, DocumentFill.TRANSPARENT, 1);                    // open the shadow file                    var shadowFile = open(new File(shadowFileRef));                    // Duplicate only layer in shadow file into merge file.                    app.activeDocument.artLayers[0].duplicate(mergedDoc, ElementPlacement.INSIDE);                                        // close the original shadow file saving no changes.                    app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);                    // open the corresponding vehicle image.                     app.open(primaryFiles[i]);                    // duplicate primary layer in vehicle asset file into merged document                    app.activeDocument.artLayers[0].duplicate(mergedDoc, ElementPlacement.INSIDE);                                        //close the original vehicle asset file saving no changes                    app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);                    // resize the entire canvas 68% (1080 x 651 -- Desktop)                    mergedDoc.resizeImage('68%', '68%');                    //do the first crop from first anchor.                    mergedDoc.resizeCanvas(1200, 743, AnchorPosition.TOPCENTER);                    //do the second crop from second anchor.                    mergedDoc.resizeCanvas(1200, 651, AnchorPosition.BOTTOMCENTER);                    // sharpen the image                    mergedDoc.artLayers[0].applySharpen();                    // save image with correct file name in new directory (this one may be broken up into several subroutines)                                        //strip all the crap out of the original file path string                    finalFolder = fileString.replace('222178_', '');                    finalFolder = finalFolder.replace(app.originPrimPath, '');                    finalFolder = finalFolder.substring(0, finalFolder.length - 14);                                        //use the count var but give it one zero if less than 10 -- this is for the final png file name.                    iProc = ('0' + i).slice(-2);                                        //set up the path for the new folder                    var outputFolder = new Folder(app.originPrimPath+'processed_assets/'+finalFolder);                                        	//create the new folder                    	outputFolder.create();                                        	// set the full path                    	saveFile = new File(outputFolder+'/'+iProc+'.png');                                          	mergedDoc.saveAs(saveFile, PNGSaveOptions, true, Extension.LOWERCASE);                    //close the final File                    app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);               } else {                      // It's not a good file type PS can't deal with it                    //alert(fileString + 'bad file type');                 }            } else {                 //alert('passing folder: ' + primaryFiles[i]);               	                  //do not perform the actions on the shadow files                  if (primaryFiles[i] == primaryPath+'_shadows') {               		   return;                	}                 // Call method recursively with the current folder as an argument               // This will go back to top level if no further directories are found.                  buildVehicle(primaryFiles[i], shadowPath);            }       }  }   // init run the function -- these paths should be updated based on the specific machine that is running this.app.originPrimPath = '~/Desktop/forHadi/amg_source_assets/s63_v222/RENDERS/s63/EXTERIOR/';app.originShadowPath = '~/Desktop/forHadi/amg_source_assets/s63_v222/RENDERS/s63/EXTERIOR/_shadows/';buildVehicle(app.originPrimPath, app.originShadowPath);