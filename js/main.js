'use strict';

fillRanksSuits();
resize() // resizes the elements to fit (no scroll)

document.onkeydown     = keyboardShortcuts; // capture shortcuts
document.onclick 	   = click;				// detect cards clicks
buttons.init();								// user's buttons
Game.new();
stack.onclick = function() { Game.deckClick(OVERRIDE | RECORD)} ; // draw 3 or 1 card(s) from the stack