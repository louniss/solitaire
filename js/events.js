'use strict';

function preventDefault(event){
	event.preventDefault();
}

function dragCardStart(event) {
	event.preventDefault();
	clearClick();
	
	console.log("drag start");
	
}

function dragCard(event) {
	
}

function dragCardChilds() {
	
}

function dropCard(event) {
	
}

function allowDrop(event) {
	
}

function denyDrop(event) {
	
}

function click(event) {
	var functions = [firstClick, secondClick];
	
	functions[Sltr.click^=1](event);
}

function firstClick(event) {
	var clicked = get(event);
	var elm;
	
	if(clicked == null || clicked.rank == undefined) return clearClick();
	
	Sltr.clickData.from = clicked;
	elm = id(Sltr.data[clicked.holder][clicked.index].id);
	
	elm.classList.add("selected");
}

function secondClick(event) {
	var clicked, from, to, moveType, flag;
	
	clicked  = get(event);
	if(clicked == null) return clearClick();
	
	Sltr.clickData.to = clicked;
	from     = Sltr.clickData.from;
	to       = clicked;
	moveType = Game.getMoveType(from, to);
	flag     = Game.validateMove(from, to, moveType);

	clearClick();
	
	if(flag != MFLAGS.INVALID) 
		return Game.makeMove(from, to, flag, OVERRIDE | RECORD);
	
	return 0;
}

function get(event) {
	var clicked, name, type, returnObj;
	
	returnObj = {};
	
	clicked = event.target;
	name = clicked.tagName;
	
	if(name == "IMG") clicked = event.target.parentElement;
	type = clicked.getAttribute("type");
	
	switch(type) {
		case "face":
			returnObj.holder = Number(clicked.getAttribute("holder") );
			returnObj.suit   = Number(clicked.getAttribute("suit") );
			returnObj.rank   = Number(clicked.getAttribute("rank") );
			returnObj.index  = Number(clicked.getAttribute("index") );
		break;
		
		case "back":
			return null;
		break;
		
		case "holder":
			returnObj.holder = Number(clicked.getAttribute("parent") );
		break;
		
		default:
			return null;
	}
	
	return returnObj;
}

function clearClick() {
	var selected = document.getElementsByClassName("selected");
	var index;
	
	for(index = 0; index < selected.length; index++)
		selected[index].classList.remove("selected");
	
	Sltr.click = 1;
	Sltr.clickData = {from : {}, to : {}};
}

function autoMoveCard(event) {
	var card, holder, cardIndex, move;
	
	event.preventDefault();
	clearClick();
	
	card = this;
	holder = Number(card.getAttribute("holder"));
	cardIndex = Number(card.getAttribute("index"));
	
	Cpu.generateMoves();
	Cpu.filterMoves();
	Cpu.putHintMoves();
	
	move = Cpu.hintMoves[cardIndex + (MAX_HOLDER_COUNT*holder)];
	if(!move) return 0;
	
	Cpu.hintMoves = [];
	return Game.makeMove(move.from, move.to, move.flag, OVERRIDE | RECORD);
}

function keyboardShortcuts(event) {
	var F2   = 113, 
		Z    = 90, 
		Y    = 89, 
		CTRL = event.ctrlKey, 
		H    = 72,
		ESC  = 27;
	
	switch(event.keyCode) {
		
		case F2:
			Game.new();
			event.preventDefault();
		break;
		
		case CTRL && Z:
			Game.undo();
			event.preventDefault();
		break;
		
		case CTRL && Y:
			Game.redo();
			event.preventDefault();
		break;
		
		case H:
			Game.hintMove();
			event.preventDefault();
		break;
	}
}