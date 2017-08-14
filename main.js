// Function to erase items array from localStorage for testing
		$('#title').on('click', function(){
			localStorage.removeItem('items');
			// Test Items
			var item1 = new Item('img/camera.jpg', 'Nikon Coolpix L340 20.2 MP Digital Camera with 28x Optical Zoom and 3.0-Inch LCD (Black)');
			var item2 = new Item('img/tv.jpg', 'Element ELEFW195R 19" 720p HDTV (Certified Refurbished)');
			var item3 = new Item('img/coffeemaker.jpg', 'Cuisinart DGB-900BC Grind & Brew Thermal 12-Cup Automatic Coffeemaker');
			var item4 = new Item('img/alarmclock.jpg', 'Peakeep Little Digital FM Radio Dual Alarm Clock with Snooze and Sleep Timer, Large Display with 2 Dimmer');
			var item5 = new Item('img/headphones.jpg', 'FSL Protec Kids Headphones with Adjustable Volume Limiting (Blue)');
			
			// Array of allItems
			allItems = [item1, item2, item3, item4, item5];
			displayItems();
			alert('Items Restored');
		})

		// Constructor Function of the Item
		function Item(picture,description,status){
			this.img = picture;
			this.description = description;
			this.status = (status)?true:false; //true: available items; false: sorted items;
		}
		var auxImg = '';

		// Function to get last items update from localStorage
		var storage = localStorage.items;
		if(storage == null){ //Case of no items sorted

			// Test Items
			var item1 = new Item('img/camera.jpg', 'Nikon Coolpix L340 20.2 MP Digital Camera with 28x Optical Zoom and 3.0-Inch LCD (Black)');
			var item2 = new Item('img/tv.jpg', 'Element ELEFW195R 19" 720p HDTV (Certified Refurbished)');
			var item3 = new Item('img/coffeemaker.jpg', 'Cuisinart DGB-900BC Grind & Brew Thermal 12-Cup Automatic Coffeemaker');
			var item4 = new Item('img/alarmclock.jpg', 'Peakeep Little Digital FM Radio Dual Alarm Clock with Snooze and Sleep Timer, Large Display with 2 Dimmer');
			var item5 = new Item('img/headphones.jpg', 'FSL Protec Kids Headphones with Adjustable Volume Limiting (Blue)');
			
			// Array of allItems
			var allItems = [item1, item2, item3, item4, item5];

		}else{ //Case of items sorted in localStorage
			var arrayString = localStorage.items;
			var allItems = JSON.parse(arrayString);
		}

		// Function to display every Item in each Category
		function displayItems(){
			$('#itemsDiv').html('');
			$('#sortDiv').html('');

			var template = '';
			for(item in allItems){
				template = `
					<li id="item-${item}" class="item col-xs-10 col-xs-offset-1 ui-widget-content">
						<div class="img" style="background: url('${allItems[item].img}') no-repeat center center;background-size: contain;"></div>
						<div class="description">${allItems[item].description}</div>
						<div class="options">`

				if(!allItems[item].status){	// Available Items Options
					template += `<button class="optionBtn" id="erase-${item}" onclick="eraseItem(${item})">
								<i class="fa fa-trash" aria-hidden="true"></i>
							</button> &nbsp;
							<button class="optionBtn" id="edit-${item}" onclick="editItem(${item})">
								<i class="fa fa-pencil" aria-hidden="true"></i>
							</button>`
				}

				template += `</div></li>`;

				if(allItems[item].status == false){
					$('#itemsDiv').append(template);
				}else{
					$('#sortDiv').append(template);
				}
			}
			countItems();
		}
		
		// Function to count the Items of each Category
		function countItems(){
    		var items = $('#itemsDiv').children().length;
    		var sorted = $('#sortDiv').children().length;
    		$('#totalItems').html(items);
    		$('#totalSorted').html(sorted);
	    }

	    // Function to Rearrange the allItems array
	    function reArrange(){
	    	var auxArray = [];

	    	var itemsUl = document.getElementById("itemsDiv");
			var items = itemsUl.getElementsByTagName("li");
	    	for(var n = 0; n < items.length; ++n){
	    		var id = items[n].id;
	    		var item = id.split('-')[1];
	    		allItems[item].status = false;
	    		auxArray.push(allItems[item]);
	    	}
	    	var sortUl = document.getElementById("sortDiv");
			var sorts = sortUl.getElementsByTagName("li");
	    	for(var n = 0; n < sorts.length; ++n){
	    		var id = sorts[n].id;
	    		var item = id.split('-')[1];
	    		allItems[item].status = true;
	    		auxArray.push(allItems[item]);
	    	}

	    	allItems = auxArray;

	    	var arrayString = JSON.stringify(allItems);
	    	localStorage.setItem('items', arrayString);

	    	displayItems();
	    }

	    // Function to delete a specific Item;
		function eraseItem(i){
			$('#deleteItem').html(`<div class="img" style="background: url('${allItems[i].img}') no-repeat center center;background-size: contain;"></div>
								   <div class="description">${allItems[i].description}</div>`);
			$("#dialog-confirm").dialog({
		        resizable: false,
		        height: "auto",
		        width: 400,
		        modal: true,
		        buttons: {
		          	"Yes": function() {
		          		allItems.splice(i, 1);
		          		displayItems();
		          		reArrange();
			            $(this).dialog("close");
		         	},
		          	"No": function() {
		            	$(this).dialog("close");
	                }
	            }
	        });
		};

		// Function to open the modal for Editing Items
		function editItem(item){
			$('.modal-title').html('Edit Item');
			var template = `<div class="internal-modal">
					<h4>Picture</h4>
					<div id="showImg" style="width:100%">
					</div>
					<br>
					<input id="editImg" type="file" name="imgs">
				</div>
				<div class="internal-modal">
					<h4>Description</h4>
					<textarea name="description" id="editDescription" cols="30" rows="10" maxlength="300">${allItems[item].description}</textarea>
				</div>
				`;
			$('.modal-body').html(template);

			var prev = $("<img />");
	        prev.attr("style", "height:160px;width: auto; display: block; margin: 0 auto;");
	        prev.attr("src", allItems[item].img);
	        dvPreview1 = $("#showImg");
	        dvPreview1.html("");
	        dvPreview1.append(prev);
			auxImg = allItems[item].img;

			$('#modal-option').html('<button type="button" id="editBtn" class="btn btn-default">Edit</button>');
			$("#myModal").modal('toggle');

			// Function for validating the uploaded image
			$("#editImg").on('change',function(){
				dvPreview1 = $("#showImg");
            	dvPreview1.html("");
	            var files = document.getElementById('editImg').files;
	            var imgSize = files.length;
	            for(var i=0; i<imgSize; i++){
	                 resizeAndUpload(item, files[i]);
	            }

	            if (typeof(FileReader) != "undefined") {
	                var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.jpg|.jpeg|.gif|.png|.bmp)$/;
	                $($(this)[0].files).each(function () {
	                    var file = $(this);
	                    if (regex.test(file[0].name.toLowerCase())) {
	                        var reader = new FileReader();
	                        reader.onload = function (e) {
	                            var img = $("<img />");
                   		        img.attr("src", e.target.result);
	                        }
	                        reader.readAsDataURL(file[0]);
	                    } else {
	                        alert(file[0].name + " is not a valid format for a Image.");
	                        return false;
	                    }
	                });
	            } else {
	                alert("This navigator does not support the conversion.");
	            }
	        });

			// Function to save the edited Item
			$('#editBtn').on('click', function(){
				allItems[item].description = $('#editDescription').val();
				allItems[item].img = auxImg;
				$('#myModal').modal('toggle');
				displayItems();
				reArrange();
			});
		}

		$('#newItem').on('click', function(){
			$('.modal-title').html('Add New Item');
			var template = `<div class="internal-modal">
					<h4>Picture</h4>
					<div id="showImg" style="width:100%">
						Select item picture
					</div>
					<br>
					<input id="newImg" type="file" name="imgs">
				</div>
				<div class="internal-modal">
					<h4>Description</h4>
					<textarea name="description" id="newDescription" cols="30" rows="10" maxlength="300" placeholder="Insert Item description (max: 300 characters)" > </textarea>
				</div>`;
			$('.modal-body').html(template);

			var prev = $("<img />");
	        prev.attr("style", "height:160px;width: auto; display: block; margin: 0 auto;");
	        dvPreview1 = $("#showImg");
	        // dvPreview1.html("");
	        dvPreview1.append(prev);

			$('#modal-option').html('<button type="button" id="addBtn" class="btn btn-default">Add Item</button>');
			$("#myModal").modal('toggle');

			// Function for validating the uploaded image
			$("#newImg").on('change',function(){
				dvPreview1 = $("#showImg");
            	dvPreview1.html("");
	            var files = document.getElementById('newImg').files;
	            var imgSize = files.length;
	            for(var i=0; i<imgSize; i++){
	                 resizeAndUpload(item, files[i]);
	            }

	            if (typeof(FileReader) != "undefined") {
	                var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.jpg|.jpeg|.gif|.png|.bmp)$/;
	                $($(this)[0].files).each(function () {
	                    var file = $(this);
	                    if (regex.test(file[0].name.toLowerCase())) {
	                        var reader = new FileReader();
	                        reader.onload = function (e) {
	                            var img = $("<img />");
                   		        img.attr("src", e.target.result);
	                        }
	                        reader.readAsDataURL(file[0]);
	                    } else {
	                        alert(file[0].name + " is not a valid format for a Image.");
	                        return false;
	                    }
	                });
	            } else {
	                alert("This navigator does not support the conversion.");
	            }
	        });

			// Function to save the edited Item
			$('#addBtn').on('click', function(){
				var newItem = new Item(auxImg, $('#newDescription').val());
				allItems.push(newItem);
				$('#myModal').modal('toggle');
				displayItems();
				reArrange();
			});
		})



		// Function to transform uploaded image in base64 string
		function resizeAndUpload(index, file){
	        var reader = new FileReader();
	        reader.onloadend = function() {
	            var tempImg = new Image();
	            tempImg.onload = function() {
	               
	                var MAX_WIDTH = 320;
	                var MAX_HEIGHT = 320;
	                var tempW = tempImg.width;
	                var tempH = tempImg.height;
	                if (tempW > tempH) {
	                    if (tempW > MAX_WIDTH) {
	                        tempH *= MAX_WIDTH / tempW;
	                        tempW = MAX_WIDTH;
	                    }
	                } else {
	                    if (tempH > MAX_HEIGHT) {
	                        tempW *= MAX_HEIGHT / tempH;
	                        tempH = MAX_HEIGHT;
	                    }
	                }
	                
	                var resizedCanvas = document.createElement('canvas');
	                resizedCanvas.width = tempW;
	                resizedCanvas.height = tempH;
	                var ctx = resizedCanvas.getContext("2d");
	                ctx.drawImage(this, 0, 0, tempW, tempH);
	                var dataURL = resizedCanvas.toDataURL(file.type);
	                var prev = $("<img />");
	                prev.attr("style", "height:160px;width: auto; display: block; margin: 0 auto;");
	                prev.attr("src", dataURL);
	                dvPreview1.append(prev);
	                auxImg = dataURL;
	            };
	            tempImg.src = reader.result;
	        }
	        reader.readAsDataURL(file);
	    }

		$(document).ready(function(){
			
			displayItems();
		    // Drag and Drop Functionality
			$( "#sortDiv" ).sortable({
		    	connectWith: ".itemSection",
		    	update: function(event, ui){
		    		reArrange();
		    	}
		    }).disableSelection();
		    $( "#itemsDiv").sortable({
		    	connectWith: ".itemSection",
		    	update: function(){
		    		countItems();
		    		// reArrange();
		    	}
		    }).disableSelection();

	        $('[data-toggle="tooltip"]').tooltip(); 
			
		});
