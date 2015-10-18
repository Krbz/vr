//change it to sprite
window.onload = function(){
	VR.spr = new Image();
	VR.spr.src = './img/bg.jpg';
}

'use strict';
var VAR, VR, VP;

VAR = {
	W: 0,
	H: 0,
    fps: 60,
    lastTime: 0,
    tmpstate: '',
    movement: 100,
    bg: {
    	W: 5500,
    	H: 1200
    },
	rand: function rand(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	},
	shuffle: function shuffle(arr) {
		var counter = arr.length;
		var tmp;
		var index;
		while (counter > 0) {
			counter--;
			index = Math.floor(Math.random() * counter);
			tmp = arr[counter];
			arr[counter] = arr[index];
			arr[index] = tmp;
		}
		return arr;
	}
}
VP = { //viewport
	x: VAR.bg.W/3, //do poprawy pozycja
	y: VAR.bg.H/5 //do poprawy viewport na starcie
}
VR = {
	init: function() {
		VR.canvas = document.getElementById('vr');
		VR.ctx = VR.canvas.getContext('2d');
		//
		this.layout();
		//
		this.animationLoop();
		//
		window.addEventListener('keydown', VR.onKey, false);
		window.addEventListener('keyup', VR.onKey, false);
		window.addEventListener('mousemove', VR.onMouse, false);
		window.addEventListener('resize', VR.layout);
	},
	toDraw:{},
	layout: function() {
		VAR.W = window.innerWidth;
		VAR.H = window.innerHeight;
		//update canvas
		VR.canvas.width = VAR.W;
		VR.canvas.height = VAR.H;
	},
	viewport: function() {
		//draw 2 eyes views
		//wspolne wartosci x,y

		VR.ctx.drawImage(
			VR.spr,
			0,
			0,
			VAR.bg.W,
			VAR.bg.H,
			-VP.x, //x na canvas
			-VP.y, //y na canvas
			5500,
			1200
		);
		VR.ctx.drawImage(
			VR.spr,
			0,
			0,
			VAR.bg.W,
			VAR.bg.H,
			-VP.x, //x na canvas
			-VP.y, //y na canvas
			5500,
			1200
		);
		//styles for drawing
		VR.ctx.strokeStyle="#fff";
		VR.ctx.lineWidth = 1;
		//draw circle in middle of screen
		VR.ctx.beginPath();
		VR.ctx.arc(VAR.W /2, VAR.H/2, 10, 0, 2*Math.PI);
		VR.ctx.stroke();
		VR.ctx.closePath();
		//draw axis mask
		function drawAxis() {
			VR.ctx.beginPath();
			VR.ctx.moveTo(0, VAR.H / 2	);
			VR.ctx.lineTo(VAR.W, VAR.H / 2);
			VR.ctx.moveTo(VAR.W/2, 0);
			VR.ctx.lineTo(VAR.W/2, VAR.H);
			VR.ctx.stroke();
			VR.ctx.closePath();
		}
	},
	animationLoop: function(time) {
		requestAnimationFrame( VR.animationLoop );

		if( time - VAR.lastTime >= 1000/VAR.fps ) {
			VAR.lastTime = time;
            VR.ctx.clearRect(0, 0, VAR.W, VAR.H);
			//
			VR.viewport();
			// VR.gamepad();
		}
	},
	updateView: function(value) {
		var movement = value || VAR.movement;

		if (VAR.tmpstate.slice(-2) !== 'go') { //poprawa stanu
			//switch case

		   	if (VR.key_37) {
		   		VP.x - movement >= 0 ?
					VP.x -= movement 
					: 
					VP.x;
			} else if(VR.key_38) {
		   		VP.y - movement >= 0 ?
					VP.y -= movement 
					: 
					VP.y;
			} else if(VR.key_39) {
		   		VP.x + movement <= VAR.bg.W - VAR.W?
					VP.x += movement 
					: 
					VP.x;
			} else if(VR.key_40) {
		   		VP.y + movement <= VAR.bg.H - VAR.H ?
					VP.y += movement 
					: 
					VP.y;
			}
		}
	},
	onMouse: function(ev) {
		console.log('down')
		//na mousedown - uruchomienie mousemove, movement, na mouseup - destroy

		var position = {
			x: VAR.W / 2,
			y: VAR.H / 2
		}
		var event = {
			x: ev.clientX / VAR.W, //do poprawy - wartosc % bg W
			y: ev.clientY / VAR.H //do poprawy - wartosc % bg H
		}

		if ( ev.clientX < position.x) {
			//lewo
			//do poprawy - cos przewija za duzo
			for (var i=37; i<=40; i++) {
				if (i!=37) {
					VR['key_'+i] = false;
				}
			}
			VR.key_37 = true;
			VR.updateView(event.x);
		} else {
			//right
			for (var i=37; i<=40; i++) {
				if (i!=39) {
					VR['key_'+i] = false;
				}
			}
			VR.key_39 = true;
			VR.updateView(event.x);
		}

		if ( ev.clientY > position.y) {
			//up
			for (var i=37; i<=40; i++) {
				if (i!=40) {
					VR['key_'+i] = false;
				}
			}
			VR.key_40 = true;
			VR.updateView(event.y);
		} else {
			//down
			for (var i=37; i<=40; i++) {
				if (i!=38) {
					VR['key_'+i] = false;
				}
			}
			VR.key_38 = true;
			VR.updateView(event.y);
		}
	},
	onKey: function(ev) {
		//poprawa stanu
		if ((ev.keyCode>=37 && ev.keyCode<=40) || ev.keyCode==32) {
			if (ev.type=='keydown' && !VR['key_'+ev.keyCode]) {
				VR['key_'+ev.keyCode] = true;
				// 
				if (ev.keyCode>=37 && ev.keyCode<=40) {
					for (var i=37; i<=40; i++) {
						if (i!=ev.keyCode) {
							VR['key_'+i] = false;
						}
					}
					VR.updateView();
				}
			} else if (ev.type=='keyup') {
				VR['key_'+ev.keyCode] = false;
				if(ev.keyCode!=32){
					VR.updateView();
				}
			}
		}
	},
	gamepad: function() {
		//jezeli jest gamepad podlaczony && przegladarka wspiera - sprawdzaj movement - updateView();
		//
		//
		console.log('gamepad');
	}
}

VR.init();





//TODO
// 1. wartosc przycisku
// 2. obrot przy axis
// 3. Stworzenie 3d 
// 4. film typu rollercoster || animacja typu rollercoster - 3d
// 5. Gamepad - initialize
// 6. Device orientation - values as movement
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
