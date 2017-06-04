'use strict';

var Game = {};

Game.createDeck = function() {
	var index, cardObj, suit, rank;
	
	for(index = 0; index < TOTAL_CARDS; index++) {
		suit = getSuit(Sltr.deck[index]);
		rank = getRank(Sltr.deck[index]);
		
		cardObj = createCard(suit, rank, index);
		push(HOLDERS.STACK, cardObj);
	}
}

Game.shuffle = function() {
	Sltr.deck.shuffle();
}

Game.placeCards = function() {
	var cardObj, holder, back, left, top;
	
	for(holder = HOLDERS.PILE_ONE; holder <= HOLDERS.PILE_SEVEN; holder++) {
		left = Sltr.coords[holder].left;
		top = Sltr.coords[holder].top;
		
		while(back >= HOLDERS.PILE_ONE) {
			cardObj = pop(HOLDERS.STACK);
			push(holder, cardObj);
			moveCard(cardObj, left, top, null, 1);
			
			top += MARGIN;
			--back;
		}
		cardObj = pop(HOLDERS.STACK);
		
		flipCard(cardObj);
		addCardEvents(cardObj);
		push(holder, cardObj);
		moveCard(cardObj, left, top, null, 1);
		
		back = holder;
	}
}

Game.destroy = function() {
	var card, index, length;
	clearClick();
	// clearDrag();
	Sltr.resetGlobalData();
	Cpu.resetData();
	disableUndo();
	disableRedo();
	
	Sltr.drawCount = userSettings.drawCount || Sltr.drawCount;
	Cpu.speed      = userSettings.cpuSpeed || Cpu.speed;
	
	card = document.getElementsByClassName("card");
	length = card.length;
	
	for(index = 0; index < length; index++) card[0].remove();
}

Game.new = function() {
	Game.destroy();
	Game.shuffle();
	Game.createDeck();
	Game.placeCards();
}

Game.replay = function() {
	Game.destroy();
	Game.createDeck();
	Game.placeCards();
}

Game.deckClick = function(status) {
	var drwCnt, lDrwCnt, stackCount, threeCount, cardObj, left, top;
	clearClick();
	stackCount = Sltr.count[HOLDERS.STACK];
	if(stackCount == 0) return Game.regroup(status);
	
	Game.newHisEntry(status);
	
	left = Sltr.coords[HOLDERS.THREE_CARDS].left;
	top  = Sltr.coords[HOLDERS.THREE_CARDS].top;
	
	lDrwCnt = Sltr.lCount;
	threeCount = Sltr.count[HOLDERS.THREE_CARDS]-1;
	
	cardObj = Sltr.data[HOLDERS.THREE_CARDS].lastKey();
	if(cardObj) {
		removeCardEvents(cardObj, status);
	}
	
	while(lDrwCnt > -1) {
		cardObj = Sltr.data[HOLDERS.THREE_CARDS][threeCount - lDrwCnt];
		moveCard(cardObj, left, top, status, 1);
		--lDrwCnt;
	}
	
	resetLcount(status);
	
	left = Sltr.coords[HOLDERS.THREE_CARDS].left;
	
	for(drwCnt = 0; drwCnt < Sltr.drawCount && stackCount > 0; drwCnt++) {
		cardObj = pop(HOLDERS.STACK, status);
		push(HOLDERS.THREE_CARDS, cardObj, status);
		
		flipCard(cardObj, status);
		moveCard(cardObj, left, top, status);
		highestZIndex(cardObj, status);
		
		left += Sltr.marginLeft;
		--stackCount;
		incLcount(status);
	}
	
	cardObj = Sltr.data[HOLDERS.THREE_CARDS].lastKey();
	addCardEvents(cardObj, status);
	
	Sltr.redoHis[Sltr.hisIndex] = {func: "Game.deckClick", args : null};
	++Sltr.hisIndex;
}

Game.regroup = function(status) {
	var threeCount, cardObj, left, top;
	clearClick();
	threeCount = Sltr.count[HOLDERS.THREE_CARDS];
	
	if(threeCount == 0) return 0;
	
	Game.newHisEntry(status);
	
	cardObj = Sltr.data[HOLDERS.THREE_CARDS].lastKey();
	removeCardEvents(cardObj, status);
	
	left = Sltr.coords[HOLDERS.STACK].left;
    top = Sltr.coords[HOLDERS.STACK].top;
	
	while(threeCount > 0) {
		cardObj = pop(HOLDERS.THREE_CARDS, status);
		highestZIndex(cardObj, status);
		push(HOLDERS.STACK, cardObj, status);
		flipCard(cardObj, status);
		moveCard(cardObj, left, top, status);
		
		--threeCount;
	}
	
	resetLcount(status);
	
	Sltr.redoHis[Sltr.hisIndex] = {func: "Game.regroup", args: null};
	++Sltr.hisIndex;
}

Game.getMoveType = function(from, to) {
	if(from.holder == HOLDERS.THREE_CARDS && (to.holder >= HOLDERS.ACE_ONE && to.holder <= HOLDERS.ACE_FOUR) && 
	from.holder != to.holder) {
		return TYPES.THREE_TO_ACE;
		
	} else if(from.holder == HOLDERS.THREE_CARDS && (to.holder >= HOLDERS.PILE_ONE && to.holder <= HOLDERS.PILE_SEVEN) && 
	from.holder != to.holder) {
		return TYPES.THREE_TO_PILE;
	
	} else if( (from.holder >= HOLDERS.ACE_ONE && from.holder <= HOLDERS.ACE_FOUR) && 
	(to.holder>=HOLDERS.ACE_ONE && to.holder<=HOLDERS.ACE_FOUR) && from.holder != to.holder) {
		return TYPES.ACE_TO_ACE;
		
	} else if( (from.holder >= HOLDERS.ACE_ONE && from.holder <= HOLDERS.ACE_FOUR) && 
	(to.holder >= HOLDERS.PILE_ONE && to.holder <= HOLDERS.PILE_SEVEN) && from.holder != to.holder) {
		return TYPES.ACE_TO_PILE;
		
	} else if( (from.holder >= HOLDERS.PILE_ONE && from.holder <= HOLDERS.PILE_SEVEN) && 
	(to.holder >= HOLDERS.PILE_ONE && to.holder <= HOLDERS.PILE_SEVEN) && from.holder != to.holder) {
		return TYPES.PILE_TO_PILE;
		
	} else if( (from.holder >= HOLDERS.PILE_ONE && from.holder <= HOLDERS.PILE_SEVEN) && 
	(to.holder >= HOLDERS.ACE_ONE && to.holder <= HOLDERS.ACE_FOUR) ) {
		return TYPES.PILE_TO_ACE;
		
	}
	return TYPES.INVALID;
}

Game.validateMove = function(from, to, type) {
	var flag, fromLen, toLen;
	if(!type) return 0;
	
	flag    = 0;
	fromLen = Sltr.count[from.holder];
	toLen   = Sltr.count[to.holder];
	
	if(type == TYPES.PILE_TO_ACE) {
		if(fromLen == 1) { 
			if(from.rank == RANKS.ace && toLen == 0) {
				flag |= MFLAGS.LEFT_TOP;
				flag |= MFLAGS.POP;
				
			} else if(from.rank > RANKS.ace && from.suit == to.suit && (from.rank - to.rank) == 1 ) {
				flag |= MFLAGS.LEFT_TOP;
				flag |= MFLAGS.POP;
			} 
		} else if(fromLen > 1) {
		  	if(from.rank == RANKS.ace &&  from.index == (fromLen-1) && toLen == 0) {
		  		flag |= MFLAGS.LEFT_TOP;
		  		flag |= MFLAGS.POP;
		  		flag |= MFLAGS.FLIP_ADD_EVENTS;
		  		
		  	} else if(from.rank > RANKS.ace && from.index == (fromLen-1) && from.suit == to.suit && (from.rank-to.rank)==1) {
		  		flag |= MFLAGS.LEFT_TOP;
		  		flag |= MFLAGS.POP;
		  		flag |= MFLAGS.FLIP_ADD_EVENTS;
		  	}
		  } 
	} else if(type == TYPES.PILE_TO_PILE) {
		if(fromLen == 1) {
			if(from.rank == RANKS.king && toLen == 0) {
				flag |= MFLAGS.LEFT_TOP;
				flag |= MFLAGS.POP;
				
			} else if((from.suit != to.suit) && (from.rank-to.rank)== -1 &&(from.suit^to.suit)!=2 && to.index ==(toLen-1)) {
				flag |= MFLAGS.LAST_TOP;
				flag |= MFLAGS.POP;
			}
		} else if(fromLen > 1) {
			if(from.rank == RANKS.king && from.index ==(fromLen-1) && toLen == 0 ) {
				flag |= MFLAGS.LEFT_TOP;
				flag |= MFLAGS.POP;
				flag |= MFLAGS.FLIP_ADD_EVENTS;
				
			} else if(from.rank == RANKS.king && from.index < (fromLen-1) && toLen == 0) {
				flag |= MFLAGS.LEFT_TOP;
				flag |= MFLAGS.PORTION;
				flag |= MFLAGS.FLIP_ADD_EVENTS;
				
			} else if( (from.suit != to.suit) && (from.rank-to.rank)== -1&&(from.suit^to.suit) != 2 && from.index==(fromLen-1)) {
				flag |= MFLAGS.LAST_TOP;
				flag |= MFLAGS.POP;
				flag |= MFLAGS.FLIP_ADD_EVENTS;
				
			} else if((from.suit != to.suit)&& fromLen > 1 &&(from.rank-to.rank)==-1&&(from.suit^to.suit) != 2 && from.index < (fromLen-1)) {
				flag |= MFLAGS.LAST_TOP;
				flag |= MFLAGS.PORTION;
				flag |= MFLAGS.FLIP_ADD_EVENTS;
			}
		}
	} else if(type == TYPES.THREE_TO_ACE) {
		if(from.rank == RANKS.ace && toLen == 0 && from.index == (fromLen-1)) { 
			flag |= MFLAGS.LEFT_TOP;
			flag |= MFLAGS.POP;
			flag |= MFLAGS.ADD_EVENTS;
			
		} else if(from.suit == to.suit && (from.rank-to.rank) == 1 && toLen > 0 && from.index == (fromLen-1)) {
			flag |= MFLAGS.LEFT_TOP;
			flag |= MFLAGS.POP;
			flag |= MFLAGS.ADD_EVENTS;
			
		}
	} else if(type == TYPES.THREE_TO_PILE) {
		if(from.rank == RANKS.king && toLen == 0) {
			flag |= MFLAGS.LEFT_TOP;
			flag |= MFLAGS.POP;
			flag |= MFLAGS.ADD_EVENTS;
			
		} else if((from.suit != to.suit) && (from.rank-to.rank) == -1 && (from.suit^to.suit) != 2) {
			flag |= MFLAGS.LAST_TOP;
			flag |= MFLAGS.POP;
			flag |= MFLAGS.ADD_EVENTS;
			
		}
	} else if(type == TYPES.ACE_TO_ACE) {
		if(from.rank == RANKS.ace && toLen == 0) {
			flag |= MFLAGS.LEFT_TOP;
			flag |= MFLAGS.POP;
			
		} else if(from.rank > RANKS.ace && from.suit == to.suit && (from.rank-to.rank) == 1 && toLen > 0) {
			flag |= MFLAGS.LEFT_TOP;
			flag |= MFLAGS.POP;
		}
	} else if(type == TYPES.ACE_TO_PILE) {
		if(from.rank == RANKS.king && toLen == 0) {
			flag |= MFLAGS.LEFT_TOP;
			flag |= MFLAGS.POP;
			
		} else if((from.suit != to.suit) && (from.suit^to.suit) != 2 && (from.rank-to.rank) == -1) {
			flag |= MFLAGS.LAST_TOP;
			flag |= MFLAGS.POP;
		}
	}

	return flag;
}

Game.makeMove = function(from, to, flag, status) {
	var cardObj, portion, left, top, fromLen, toLen;
	
	if(!from || !to || !flag) return 0;
	
	Game.newHisEntry(status);
	
	fromLen  = Sltr.count[from.holder];
	toLen    = Sltr.count[to.holder];
	left  	 = Sltr.coords[to.holder].left;
	top 	 = Sltr.coords[to.holder].top;
	
	if(flag & MFLAGS.LAST_TOP) {
		cardObj = Sltr.data[to.holder].lastKey();
		if(cardObj) {
			top = cardObj.top;
			top += Sltr.marginTop;
		}
	}
	
	if(flag & MFLAGS.POP) {
		cardObj = pop(from.holder, status);
		push(to.holder, cardObj, status);
		moveCard(cardObj, left, top, status);
		highestZIndex(cardObj, status);
		
	} else if(flag & MFLAGS.PORTION) {
		portion = truncate(from.holder, from.index, status);
		appendPortion(portion, to.holder, status);
		moveCards(portion, left, top, status);
		
	} if(flag & MFLAGS.FLIP_ADD_EVENTS) {
		cardObj = Sltr.data[from.holder].lastKey();
		if(cardObj && cardObj.hidden) {
			flipCard(cardObj, status);
			addCardEvents(cardObj, status);
		}
		
	} if(flag & MFLAGS.ADD_EVENTS) {
		cardObj = Sltr.data[from.holder].lastKey();
		if(cardObj) {
			addCardEvents(cardObj, status);
		}
		decLcount(status);
	}
	
	Sltr.redoHis[Sltr.hisIndex] = {func: "Game.makeMove", "from": from, "to": to, "flag": flag};
	++Sltr.hisIndex;
	
	return flag;
}

Game.newHisEntry = function(status) {
	if(status & OVERRIDE) {
		Sltr.history[Sltr.hisIndex+1] = [];
		Sltr.redoHis[Sltr.hisIndex+1] = 0;
		disableRedo();
	}
	
	Sltr.history[Sltr.hisIndex] = [];
	Sltr.redoHis[Sltr.hisIndex] = 0;
}

Game.recordHistory = function(action, status) {
	enableUndo();
	
	if(status & RECORD) {
		Sltr.history[Sltr.hisIndex].unshift(action);
	}
	
}

Game.undo = function() {
	var entry, action, index;
	
	if(Sltr.hisIndex-1 == -1) return 0;
	--Sltr.hisIndex;
	clearClick();
	
	entry = Sltr.history[Sltr.hisIndex];
	
	for(index = 0; index < entry.length; index++) {
		action = entry[index];
		
		switch(action.func) {
			case "push":
				push(action.args.holder, action.args.cardObj);
			break;
			
			case "pop":
				pop(action.args.holder);
			break;
			
			case "truncate":
				truncate(action.args.holder, action.args.start);
			break;
			
			case "appendPortion":
				appendPortion(action.args.portion, action.args.holder);
			break;
			
			case "moveCard":
				moveCard(action.args.cardObj, action.args.left, action.args.top);
			break;
			
			case "moveCards":
				moveCards(action.args.portion, action.args.left, action.args.top);
			break;
			
			case "highestZIndex":
				highestZIndex(action.args.cardObj);
			break;
			
			case "addCardEvents":
				addCardEvents(action.args.cardObj)
			break;
			
			case "removeCardEvents":
				removeCardEvents(action.args.cardObj);
			break;
			
			case "flipCard":
				flipCard(action.args.cardObj);
			break;
			
			case "incLcount":
				incLcount();
			break;
			
			case "decLcount":
				decLcount();
			break;
			
			case "resetLcount":
				Sltr.lCount = action.lCount;
			break;
		}
	}
	
	Sltr.history[Sltr.hisIndex] = [];
	enableRedo();
	if(Sltr.hisIndex == 0) disableUndo();
	
}

Game.redo = function() {
	var action;
	action = Sltr.redoHis[Sltr.hisIndex];
	
	if(!action) {return 0};
	clearClick();
	
	switch(action.func) {
		case "Game.deckClick":
			Game.deckClick(RECORD);
		break;
		
		case "Game.regroup":
			Game.regroup(RECORD);
		break;
		
		case "Game.makeMove":
			Game.makeMove(action.from, action.to, action.flag, RECORD);
		break;
	}

	enableUndo();
	action = Sltr.redoHis[Sltr.hisIndex];
	if(!action) disableRedo();
}

Game.hintMove = function() {
	console.log("hintMove()");
}

Game.save = function() {
	
}

Game.load = function() {
	
}

Game.timer = function() {
	console.log("timer is ticking..");
}

Game.collectStatictics = function() {
	console.log("collectStatictics()");
}






























