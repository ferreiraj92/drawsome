// JavaScript Document
(function() {
	var mobileMsg = document.querySelector("#mobileMsg");
	var cont = document.querySelector("#container");
	//MOBILE CHECK//
	if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
		mobileMsg.style.display = 'block';
		cont.style.display = 'none';
	}else {

	//MENU VAR - CSS/JS purposes
	var menu = document.querySelectorAll("#mainMenu ul li");
	var brushMenu = document.querySelector("#brush");
	var brushPal = document.querySelectorAll("#brush ul li");
	var colorMenu = document.querySelector("#color");
	var colorPal = document.querySelectorAll("#color ul li");
	var stampMenu = document.querySelector("#stamp");
	var stampPal = document.querySelectorAll("#stamp ul li");

	//Icon Indicator Var - CSS/JS Purpose 
	var sprite = document.querySelectorAll(".sprite");
	var navName = document.querySelector("#iconName");

	var opacityRange = document.querySelector("#color input");
	var sizeRange = document.querySelector("#brush input");
	var sizeStampRange = document.querySelector("#stamp input");



	//CANVAS VAR - JS Purposes
	var canvas = document.querySelector("#myCanvas");
	var stage = new createjs.Stage(canvas);
	createjs.Ticker.addEventListener("tick", stage);


	//TOOL IMAGE
	var canvasTool = "images/pencil_cursor.png";
	var pencil = new createjs.Bitmap(canvasTool);
	stage.addChild(pencil);



	//var pencilMark = new createjs.Graphics();
	var color = createjs.Graphics.getRGB(0,0,0);
	var brushType = 0;
	var erase;
	var listener;
	var w = window.innerWidth;
	var h = window.innerHeight;
	canvas.width = w
	canvas.height = h;

	var wrapper = new createjs.Container(); //Create container so items can be cahced then erased
	wrapper.hitArea = new createjs.Shape(new createjs.Graphics().f(color).dr(0,0,w,h));
	wrapper.cache(0,0,w,h);
	stage.addChild(wrapper);

	
	var paper = new createjs.Shape();
	paper.width = w;
	paper.height = h;
	wrapper.addChild(paper);
	//stage.update();
 
	var lastPoint = new createjs.Point();

function resizeC() {
	var w = window.innerWidth;
	var h = window.innerHeight;

	canvas.width = w
	canvas.height = h;

	wrapper.hitArea = new createjs.Shape(new createjs.Graphics().f(color).dr(0,0,w,h));
	wrapper.cache(0,0,w,h);

	paper.width = w;
	paper.height = h;
}


function startDraw(e) { //Star draw function - event handles and cursor coordinates 
	listener = stage.on("stagemousemove", draw, false);
	stage.on("stagemouseup", stopDraw, false);
	lastPoint.x = e.stageX;
	lastPoint.y = e.stageY;
	draw(e);
}


function draw(e){
		paper.graphics.ss(sizeRange.value, brushType).s(color);
        paper.graphics.mt(lastPoint.x, lastPoint.y);
        paper.graphics.lt(e.stageX, e.stageY);
        
        // Update the last position for next move.
        lastPoint.x = e.stageX;
        lastPoint.y = e.stageY;


      
        // Draw onto the canvas, and then update the container cache.
    if(canvasTool === "images/eraser_cursor.png"){
        erase = true;
    }else {
    erase = false;
    }
        wrapper.updateCache(erase?"destination-out":"source-over");
        paper.graphics.clear();
}

function stopDraw(e) {
	console.log("fired");
	stage.off("stagemousemove", listener);
    e.remove();
}

/*Stamp Menu Functions*/
function drawStamp(e) {
		var stampVal = localStorage.getItem('stampVal');

		if(stampVal ==="star" || stampVal ==="") {
			var star = new createjs.Shape();
			star.graphics.beginFill(color).drawPolyStar(pencil.x, pencil.y, sizeStampRange.value, 5, 0.6, -90);
			star.x = (stage.mouseX - pencil.x) * 0.5;
			star.y = (stage.mouseY - pencil.y) * 0.5;
			star.alpha = opacityRange.value;
			stage.addChild(star);
	
		}else if(stampVal === "tri") {
			var tri = new createjs.Shape();
			tri.graphics.beginFill(color).drawPolyStar(pencil.x, pencil.y, sizeStampRange.value, 3, 0.5, -90);
			tri.x = (stage.mouseX - pencil.x) * 0.5;
			tri.y = (stage.mouseY - pencil.y) * 0.5;
			tri.alpha = opacityRange.value;
			stage.addChild(tri);
			
		}else if(stampVal === "ovalTop") {
			var ovalTop = new createjs.Shape();
			ovalTop.graphics.beginFill(color).arc(pencil.x, pencil.y, sizeStampRange.value, 0, Math.PI, true);
			ovalTop.x = (stage.mouseX - pencil.x) * 0.5;
			ovalTop.y = (stage.mouseY - pencil.y) * 0.5;
			ovalTop.alpha = opacityRange.value;
			stage.addChild(ovalTop);

		}else if(stampVal === "ovalBottom") {
			var ovalBottom = new createjs.Shape();
			ovalBottom.graphics.beginFill(color).arc(pencil.x, pencil.y, sizeStampRange.value, 0, Math.PI, false);
			ovalBottom.x = (stage.mouseX - pencil.x) * 0.5;
			ovalBottom.y = (stage.mouseY - pencil.y) * 0.5;
			ovalBottom.alpha = opacityRange.value;
			stage.addChild(ovalBottom);
		}
	}

	/*Listener for what tool is currently in use*/
	function whatTool() {

	if(canvasTool === "images/stamp_cursor.png") {
		//console.log("test");
		wrapper.addEventListener("click", drawStamp, false);
	}else{
		wrapper.addEventListener("mousedown", startDraw, false);
	}
}
	whatTool(); //Run what tool on load


	//Cursor coordinates - how the tool follows the cursor
	function tool() {
		pencil.x += (stage.mouseX - pencil.x) * 0.5;
		pencil.y += (stage.mouseY - pencil.y) * 0.5;
		stage.update();
	}

	//Event handler using Tick to run tool function repeadtedly so the tool  updates and follows the cursor
	stage.on("stagemousemove", function() {
		createjs.Ticker.setFPS(120);
		createjs.Ticker.addEventListener("tick", tool, false);
	});


	
	function toImage() {
		var canvasExport = document.querySelector("#myCanvas");
		var myImage = canvasExport.toDataURL("image/png");
		window.location = myImage;
	}


	//Function to actually change the color variable
	function changeColor() {
		var colorVal = localStorage.getItem('colorVal');

		if(colorVal ==="black") {
			color = createjs.Graphics.getRGB(0,0,0, opacityRange.value);
		}else if(colorVal === "red") {
			color = createjs.Graphics.getRGB(225,0,0, opacityRange.value);
		}else if(colorVal === "green") {
			color = createjs.Graphics.getRGB(0,225,0, opacityRange.value);
		}else if(colorVal === "blue") {
			color = createjs.Graphics.getRGB(0,0,255, opacityRange.value);
		}else if(colorVal === "yellow") {
			color = createjs.Graphics.getRGB(225,225,0, opacityRange.value);
		}else if(colorVal === "orange") {
			color = createjs.Graphics.getRGB(225,127,0, opacityRange.value);
		}else if(colorVal === "purple") {
			color = createjs.Graphics.getRGB(127,0,225, opacityRange.value);
		}
	}

	function changeTool() {
		stage.removeChild(pencil);
		if(this.id ==="pencil" || this.id ==="") {
			canvasTool = "images/pencil_cursor.png";
			brushType = 2; //EasleJs - You can access different stroke shapes by using numbers //Square
		}else if(this.id === "brushOpt") {
			canvasTool = "images/brush_cursor.png";
			brushType = 1; //Round
		}else if(this.id === "marker") {
			canvasTool = "images/marker_cursor.png";
			brushType = 0; //Butt
		}else if(this.id === "pen") {
			canvasTool = "images/pen_cursor.png";
		}

		pencil = new createjs.Bitmap(canvasTool);
		stage.addChild(pencil);
		//console.log(canvasTool);
		wrapper.removeEventListener("click", drawStamp);
		whatTool();
	}

	//Function to store last used color, this will be used later to pull out value to run changeColor()
	function setColor() {
		if(this.id ==="black") {
			localStorage.setItem('colorVal','black');
		}else if(this.id === "red") {
			localStorage.setItem('colorVal','red');
		}else if(this.id === "green") {
			localStorage.setItem('colorVal','green');
		}else if(this.id === "blue") {
			localStorage.setItem('colorVal','blue');
		}else if(this.id === "yellow") {
			localStorage.setItem('colorVal','yellow');
		}else if(this.id === "orange") {
			localStorage.setItem('colorVal','orange');
		}else if(this.id === "purple") {
			localStorage.setItem('colorVal','purple');
		}
		changeColor();
	}


	//Set stamp tool
	function setStamp() {
		if(this.id ==="starstamp") {
			localStorage.setItem('stampVal','star');

		}else if(this.id === "tristamp") {
			localStorage.setItem('stampVal','tri');

		}else if(this.id === "ovalTop") {
			localStorage.setItem('stampVal','ovalTop');
		}else if(this.id === "ovalBottom") {
			localStorage.setItem('stampVal','ovalBottom');
		}
	}

	//Clear canvas function
	function confirmClear() {
		if(confirm("Are you sure you want to clear your canvas?") === true) {
			stage.removeAllChildren(); //Remove all children
			wrapper.updateCache(); //Clear cache
			paper.graphics.clear(); //Clear all graphics
			stage.addChild(pencil); //Readd pencil because we just cleared it
			stage.addChild(wrapper); //Readd new wrapper
		}
	}


	//MAIN MENU CONTROLLER
	function mainMenu() {
		if(this.id ==="new") {
			confirmClear();
		}else if(this.id === "export") {
			toImage();
		}else if(this.id === "brushMenu") {
			colorMenu.style.top ="0px";
			stampMenu.style.top = "0px";
			if(brushMenu.style.top === "60px") {
				brushMenu.style.top = "0px";
			}else{
				brushMenu.style.top = "60px";
			}
		}else if(this.id === "colorPalMenu") {
			brushMenu.style.top = "0px";
			stampMenu.style.top = "0px";
			if(colorMenu.style.top === "60px") {
				colorMenu.style.top = "0px";
			}else{
				colorMenu.style.top = "60px";
			}
		}else if(this.id === "eraser") {
			colorMenu.style.top = "0px";
			stampMenu.style.top = "0px";
			brushMenu.style.top = "0px";
			stage.removeChild(pencil);
			canvasTool = "images/eraser_cursor.png";
			pencil = new createjs.Bitmap(canvasTool);
			stage.addChild(pencil);
			wrapper.removeEventListener("click", drawStamp);
		whatTool();
		}else if(this.id === "stampMenu") {
			brushMenu.style.top ="0px";
			colorMenu.style.top = "0px";
			stage.removeChild(pencil);
			canvasTool = "images/stamp_cursor.png";
			pencil = new createjs.Bitmap(canvasTool);
			stage.addChild(pencil);
			wrapper.removeEventListener("mousedown", startDraw);
			whatTool();
			if(stampMenu.style.top === "60px") {
				stampMenu.style.top = "0px";
			}else{
				stampMenu.style.top = "60px";
			}
		}
	}

	//Current Tool being used indicator
	function changeSprite() {
		//console.log("test");
		if(this.style.backgroundPosition === "0px 50px") {
			this.style.backgroundPosition = "0px 0px";
		}else{
			for(i=0;i<sprite.length;i++) {
				sprite[i].style.backgroundPosition = "0px 0px";
			}
			this.style.backgroundPosition = "0px 50px";
		}
	}

	//display name of menu item hovered over
	function displayName() {
		console.log("test");
		if(this.id ==="new") {
			navName.innerHTML = "Clear";
		}else if(this.id === "export") {
			navName.innerHTML = "Export";
		}else if(this.id === "brushMenu") {
			navName.innerHTML = "Brushes";
		}else if(this.id === "colorPalMenu") {
			navName.innerHTML = "Colors";
		}else if(this.id === "eraser") {
			navName.innerHTML = "Eraser";
		}else if(this.id === "stampMenu") {
			navName.innerHTML = "Stamps";
		}
	}

	//Clear the display name when the cursor isn't on a menu icon
	function clearDisplayName() {
		navName.innerHTML = "";
	}

	//Event Handlers
	for(i=0;i<stampPal.length;i++){
		stampPal[i].addEventListener("click", setStamp, false);
	}

	for(i=0;i<brushPal.length;i++){
		brushPal[i].addEventListener("click", changeTool, false);
	}

	for(i=0;i<colorPal.length;i++){
		colorPal[i].addEventListener("click", setColor, false);
	}

	for(i=0;i<menu.length;i++){
		menu[i].addEventListener("click", mainMenu, false);
	}

	for(i=0;i<menu.length;i++){
		menu[i].addEventListener("mouseover", displayName);
	}

	for(i=0;i<menu.length;i++){
		menu[i].addEventListener("mouseout", clearDisplayName);
	}

	for(i=0;i<sprite.length;i++) {
		sprite[i].addEventListener("click", changeSprite, false);
	}

	window.addEventListener('onresize', resizeC, false);
	window.addEventListener('resize', resizeC, false);
	opacityRange.addEventListener("mouseup", changeColor, false);

	}



	/* OLD JAVASCRIPT THAT I FIRST TRIED - But couldn't make anything erase or set stroke styles
	
	//CANVAS FUNCTIONS
	function draw() {
		//pencil.x = (stage.mouseX);
		//pencil.y = (stage.mouseY);
		pencilMark.lineTo(pencil.x, pencil.y);
		stage.update();
	}

	function drawMarker() {
		var square = new createjs.Shape();
		square.graphics.beginFill(color).drawRect(pencil.x, pencil.y,sizeRange.value,sizeRange.value);

		stage.addChild(square);
		stage.update();
	}

	function tool() {
		pencil.x += (stage.mouseX - pencil.x) * 0.5;
		pencil.y += (stage.mouseY - pencil.y) * 0.5;
		stage.update();
	}

	function toImage() {
		var canvasExport = document.querySelector("#myCanvas");
		var myImage = canvasExport.toDataURL("image/png");
		window.location = myImage;
	}

	stage.on("stagemousemove", function() {
		createjs.Ticker.setFPS(120);
		createjs.Ticker.addEventListener("tick", tool, false);


	if(canvasTool === "images/pencil_cursor.png"){

		stage.on("stagemousedown", function() {
			createjs.Ticker.removeEventListener("tick", drawMarker);
			stage.removeEventListener("click", drawStamp);

			pencilMark.beginStroke(color);
			createjs.Ticker.addEventListener("tick", draw, false);
			console.log(color);
		});

		stage.on("stagemouseup", function() {
			createjs.Ticker.reset();
			pencilMark.endStroke();
		});

	}else if(canvasTool === "images/marker_cursor.png") {

		stage.on("stagemousedown", function() {
			//pencilMark.beginStroke(color);
			createjs.Ticker.removeEventListener("tick", draw);
			stage.removeEventListener("click", drawStamp);

			createjs.Ticker.setFPS(10000);
			createjs.Ticker.addEventListener("tick", drawMarker, false);
			console.log(color);
		});

		stage.on("stagemouseup", function() {
			createjs.Ticker.reset();
			//pencilMark.endStroke();
		});


	}else if(canvasTool === "images/stamp_cursor.png") {
		createjs.Ticker.removeEventListener("tick", draw);
		createjs.Ticker.removeEventListener("tick", drawMarker);

	function drawStamp() {
		var stampVal = localStorage.getItem('stampVal');

		if(stampVal ==="star" || stampVal ==="") {
			var star = new createjs.Shape();
			star.graphics.beginFill(color).drawPolyStar(pencil.x, pencil.y, sizeStampRange.value, 5, 0.6, -90);
			star.x = (stage.mouseX - pencil.x) * 0.5;
			star.y = (stage.mouseY - pencil.y) * 0.5;
			star.alpha = opacityRange.value;
			paper.addChild(star);
			stage.update();

		}else if(stampVal === "tri") {
			var tri = new createjs.Shape();
			tri.graphics.beginFill(color).drawPolyStar(pencil.x, pencil.y, sizeStampRange.value, 3, 0.5, -90);
			tri.x = (stage.mouseX - pencil.x) * 0.5;
			tri.y = (stage.mouseY - pencil.y) * 0.5;
			tri.alpha = opacityRange.value;
			paper.addChild(tri);
			stage.update();
		}
	}
	stage.on("stagemousedown", drawStamp, false);
	}

});*/

})();
