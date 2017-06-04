'use strict';

/*
  this file holds the global variables used
  by the app
*/

var Sltr = {}; // solitaire namespace

Sltr.width; // card width
Sltr.height;
Sltr.marginLeft;
Sltr.marginTop;

Sltr.ranks = [];
Sltr.suits = [];

// the cards holders (13 of them) left and top coordinates absolute position to the document
Sltr.coords = [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}]; // Sltr.coords[HOLDER_NAME].(left || top)

/* 
   this data structure contains all the informations about the cards inside their holder.
   accessed like this:  Sltr.data[HOLDER_NAME][CARD_INDEX].info
*/
Sltr.data = [[], [], [], [], [], [], [], [], [], [], [], [], []];

// how many cards each holder has
Sltr.count = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

Sltr.movesMade  = 0;
Sltr.deck       = Array(52).fillAsc();
Sltr.click 		= 1;
Sltr.clickData  = {from : {}, to : {}};
Sltr.drawCount  = 3;
Sltr.zIndex     = 0;
Sltr.lCount     = -1;
Sltr.history    = [];
Sltr.redoHis    = [];
Sltr.hisIndex   = 0;
Sltr.currentTimeout = 0;
Sltr.lastTimeOut    = 0;

Sltr.resetGlobalData = function() {
	Sltr.data  = [[], [], [], [], [], [], [], [], [], [], [], [], []];
	Sltr.count = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	Sltr.movesMade = 0;
	Sltr.click 	   = 1;
	Sltr.clickData = {from : {}, to : {}};
	Sltr.zIndex     = 0;
	Sltr.lCount     = -1;
	Sltr.history    = [];
	Sltr.redoHis    = [];
	Sltr.hisIndex   = 0;
	
	Sltr.clearTimeouts();
}

// Clears timeouts before they're fired.
Sltr.clearTimeouts = function() {
	for(Sltr.currentTimeout; Sltr.currentTimeout <= Sltr.lastTimeOut; Sltr.currentTimeout++)
		clearTimeout(Sltr.currentTimeout);
}
























