'use strict';

function id(id) {
	return document.getElementById(id);
}

function setNewSize() {
	var  width, height, marginTop, marginLeft;
	
	width = window.innerWidth;
	width = (width / 7) - MARGIN;
	
	width < 100 || (width = 100);
	
	height    = width+30;
	marginTop = width/4;
	marginLeft= width/6;
	
	Sltr.width     = width;
	Sltr.height    = height;
	Sltr.marginLeft= marginLeft;
	Sltr.marginTop = marginTop;
}

function changeCoords() {
	var width, height, left, top, index;
	setNewSize();
	
	width = Sltr.width;
	height= Sltr.height;
	left  = MARGIN;
	top   = TOP_START;
	
	Sltr.coords[HOLDERS.STACK].left = left;
	Sltr.coords[HOLDERS.STACK].top = top;
	
	left += width+MARGIN;
	
	Sltr.coords[HOLDERS.THREE_CARDS].left = left;
	Sltr.coords[HOLDERS.THREE_CARDS].top = top;
	
	left += (width+MARGIN)*2;
	
	for(index = HOLDERS.ACE_ONE; index <= HOLDERS.ACE_FOUR; index++) {
		Sltr.coords[index].left = left;
		Sltr.coords[index].top = top;
		
		left += width+MARGIN;
	}
	
	top += height+MARGIN;
	left = MARGIN;
	
	for(index = HOLDERS.PILE_ONE; index <= HOLDERS.PILE_SEVEN; index++) {
		Sltr.coords[index].left = left;
		Sltr.coords[index].top = top;
		
		left += width+MARGIN;
	}
}

function resizeElements() {
	var width, height, top, left, holder, index;
	
	width  = Sltr.width;
	height = Sltr.height;
	
	for(index = 0; index < Sltr.coords.length; index++) {
		holder = id(HOLDERS_NAMES[index]);
		
		holder.style.width = width + "px";
		holder.style.height = height + "px";
		
		holder.style.left = Sltr.coords[index].left + "px";
		holder.style.top = Sltr.coords[index].top + "px";
	}
}

function resize() {
	changeCoords();
	resizeElements();
}

function fillRanksSuits() {
	var rank, suit, index;
	index = 0;
	
	for(suit = 0; suit < 4; suit++) {
		for(rank = 0; rank < 13; rank++) {
			Sltr.ranks[index] = rank;
			Sltr.suits[index] = suit;
			index++;
		}
	}
}

function getSuit(number) {
	return Sltr.suits[number];
}

function getRank(number) {
	return Sltr.ranks[number];
}

function createElement(name, id, className) {
	var elm;

	name = name || "div";
	id = id || "";
	className = className || "";
	
	elm = document.createElement(name);
	elm.id = id;
	elm.className = className;
	
	return elm;
}

function createCard(suit, rank, zIndex) {
	var card, cardObj, face, back, left, top;
	
	cardObj = {};
	
	left = Sltr.coords[HOLDERS.STACK].left*2-MARGIN;
	top  = Sltr.coords[HOLDERS.STACK].top;
	
	card = createElement("div", RANKS_IMG[rank] + SUITS_IMG[suit], "card");
	face = createElement("img", "", "face");
	back = createElement("img", "", "back");
	
	card.style.width = Sltr.width + "px";
	card.style.height = Sltr.height + "px";
	card.style.left = left + "px";
	card.style.top = top + "px";
	card.style.zIndex = zIndex;
	
	card.setAttribute("draggable", "true");
	card.setAttribute("suit", suit);
	card.setAttribute("rank", rank);
	card.setAttribute("type", "back");
	card.setAttribute("hidden_", 1);
	card.setAttribute("holder", HOLDERS.STACK);
	
	face.setAttribute("draggable", "false");
	back.setAttribute("draggable", "false");
	face.src = "png/" + RANKS_IMG[rank] + SUITS_IMG[suit] + ".png";
	face.classList.add("hid");
	back.src = "png/back.png";
	back.classList.add("vis");
	
	card.appendChild(face);
	card.appendChild(back);

	cardObj.id = RANKS_IMG[rank] + SUITS_IMG[suit];
	cardObj.type = "back";
	cardObj.holder = HOLDERS.STACK;
	cardObj.index = Sltr.count[HOLDERS.STACK];
	cardObj.hidden = 1;
	cardObj.rank = rank;
	cardObj.suit = suit;
	cardObj.left = left;
	cardObj.top = top;
	
	document.body.appendChild(card);
	return cardObj;
}

function setCardLeftTop(card, left, top) {
	card.style.left = left + "px";
	card.style.top = top + "px";
}

function moveCard(cardObj, left, top, status, zIndex) {
	var card = id(cardObj.id), action = {};
	
	if(zIndex)
		card.style.zIndex = cardObj.index;
	
	if(status & RECORD) {
		action.func = "moveCard";
		
		action.args = {};
		action.args.cardObj = cardObj;
		action.args.left = cardObj.left;
		action.args.top = cardObj.top;
		action.args.zIndex = zIndex;
		
		Game.recordHistory(action, status);
	}
	
	cardObj.left = left;
	cardObj.top = top;

	setCardLeftTop(card, left, top);
}

function moveCards(portion, left, topStart, status) {
	var cardObj, index, top, action = {};
	
	if(status & RECORD) {
		cardObj = portion[0];
		
		action.func = "moveCards";
		
		action.args = {};
		action.args.portion = portion;
		action.args.left = cardObj.left;
		action.args.top = cardObj.top;
		
		Game.recordHistory(action, status);
	}
	
	top = topStart;
	
	for(index = 0; index < portion.length; index++) {
		cardObj = portion[index];
		moveCard(cardObj, left, top, null, null);
		highestZIndex(cardObj);
		
		top += Sltr.marginTop;
	}
}

function flipCard(cardObj, status) {
	var card, face, back, hidden, action;
	card = id(cardObj.id);
	hidden = Number( card.getAttribute("hidden_") );
	action = {};
	
	if(status & RECORD) {
		action.func = "flipCard";
		
		action.args = {};
		action.args.cardObj = cardObj;
		
		Game.recordHistory(action, status);
	}
	
	cardObj.hidden = hidden ^ 1;
	card.setAttribute("hidden_", hidden ^ 1);
	
	face = card.getElementsByClassName("face")[0];
	back = card.getElementsByClassName("back")[0];
	
	face.classList.toggle("vis");
	face.classList.toggle("hid");
	
	back.classList.toggle("vis");
	return back.classList.toggle("hid");
}

function addCardEvents(cardObj, status) {
	var card = id(cardObj.id), action = {};
	
	if(status & RECORD) {
		action.func = "removeCardEvents";
		
		action.args = {};
		action.args.cardObj = cardObj;
		
		Game.recordHistory(action, status);
	}
	
	cardObj.type = "face";
	
	card.setAttribute("type", "face");
	card.addEventListener("dragstart", dragCardStart);
	card.addEventListener("contextmenu", autoMoveCard);
}

function removeCardEvents(cardObj, status) {
	var card = id(cardObj.id), action = {};
	
	if(status & RECORD) {
		action.func = "addCardEvents";
		
		action.args = {};
		action.args.cardObj = cardObj;
		
		Game.recordHistory(action, status);
	};
	
	cardObj.type = "back";
	
	card.setAttribute("type", "back");
	card.removeEventListener("dragstart", dragCardStart);
	card.removeEventListener("contextmenu", autoMoveCard);
}

function highestZIndex(cardObj, status) {
	var card, zIndex, action = {};
	
	if(status & RECORD) {
		action.func = "highestZIndex";
		
		action.args = {};
		action.args.cardObj = cardObj;
		
		Game.recordHistory(action, status);
	};
	card = id(cardObj.id);
	zIndex = cardObj.index;
	
	if(card.getAttribute("timeout_cleared") == "not_yet") {
		cancelZIndex(card);
	}
	
	card.style.zIndex = (52 + zIndex + Sltr.zIndex);
	Sltr.lastTimeOut = setTimeout(function (){ resetZIndex(card) }, 500);
	
	card.setAttribute("timeout_id", Sltr.lastTimeOut);
	card.setAttribute("timeout_cleared", "not_yet");
	
	Sltr.zIndex += 2;
}

function resetZIndex(card) {
	var holder, cardIndex, originzIndex;
	holder    = Number(card.getAttribute("holder"));
	cardIndex = Number(card.getAttribute("index")); 
	
	originzIndex = Sltr.data[holder][cardIndex].index;
	card.style.zIndex = originzIndex;
	card.removeAttribute("timeout_cleared");
	++Sltr.currentTimeout;
	Sltr.zIndex -= 2;
}

function cancelZIndex(card) {
	var timeoutID;
	
	timeoutID = Number ( card.getAttribute("timeout_id") );
	clearTimeout(timeoutID);
	card.removeAttribute("timeout_cleared");
	Sltr.zIndex -= 2;
}

function push(holder, cardObj, status) {
	var card = id(cardObj.id), action = {};
	
	if(status & RECORD) {
		action.func = "pop";
		
		action.args = {};
		action.args.holder = holder;
		
		Game.recordHistory(action, status);
	}
	
	card.setAttribute("holder", holder);
	card.setAttribute("index", Sltr.count[holder]);
	
	cardObj.holder = holder;
	cardObj.index  = Sltr.count[holder];
	
	Sltr.data[holder].push(cardObj);
	++Sltr.count[holder];
}

function pop(holder, status) {
	var action = {}, cardObj;
	
	if(status & RECORD) {
		action.func = "push";
		
		action.args = {};
		action.args.holder = holder;
		action.args.cardObj = {};
		
		cardObj = Sltr.data[holder].lastKey();
		action.args.cardObj = cardObj;
		
		Game.recordHistory(action, status);
	}
	
	--Sltr.count[holder];
	return Sltr.data[holder].pop();
}

function truncate(holder, start, status) {
	var holderLength, portion, action = {};
	
	holderLength = Sltr.count[holder];
	
	if(status & RECORD) {
		portion = Sltr.data[holder].slice(start, holderLength);
		
		action.func = "appendPortion";
		
		action.args = {};
		action.args.portion = portion;
		action.args.holder = holder;
		
		Game.recordHistory(action, status);
	}
	
	portion = Sltr.data[holder].splice(start, holderLength);
	Sltr.count[holder] -= (holderLength-start);
	
	return portion;
}

function appendPortion(portion, holder, status) {
	var cardObj, holderLength, portionLen, index, action = {};
	
	holderLength = Sltr.count[holder];
	portionLen   = portion.length;
	
	if(status & RECORD) {
		action.func = "truncate";
		
		action.args = {};
		action.args.holder = holder;
		action.args.start = holderLength;
		
		Game.recordHistory(action, status);
	}
	
	for(index = 0; index < portionLen; index++) {
		cardObj = portion[index];
		push(holder, cardObj, null);
	}
}

function enableUndo() {
	buttons.undo.disabled = false;
}

function disableUndo() {
	buttons.undo.disabled = true;
}

function enableRedo() {
	buttons.redo.disabled = false;
}

function disableRedo() {
	buttons.redo.disabled = true;
}

function incLcount(status) {
	var action = {};
	
	if(status & RECORD) {
		action.func = "decLcount";
		
		Game.recordHistory(action, status);
	}
	
	++Sltr.lCount;
}

function decLcount(status) {
	var action = {};
	
	if(status & RECORD) {
		action.func = "incLcount";
		
		Game.recordHistory(action, status);
	}
	--Sltr.lCount;
}

function resetLcount(status) {
	var action = {};
	
	if(status & RECORD) {
		action.func = "resetLcount";
		action.lCount = Sltr.lCount;
		
		Game.recordHistory(action, status);
	}
	
	Sltr.lCount = -1;
}

function newInstance(srcObj) {
	var newObj, key;
	if(!srcObj) return 0;
	
	newObj = {};
	
	for(key in srcObj) 
		newObj[key] = srcObj[key];
	
	return newObj;
}


























