'use strict';

var Cpu = {};

Cpu.isPlaying  = 0;
Cpu.speed      = 500;
Cpu.playOrStop = [];
Cpu.text       = ["CPU Play", "Human Play"];
Cpu.interval   = null;

Cpu.allMoves    = [];
Cpu.usefulMoves = [];
Cpu.hintMoves   = [];

Cpu.resetData = function() {
	Cpu.allMoves    = [];
	Cpu.usefulMoves = [];
	Cpu.hintMoves   = [];
}

Cpu.generateMoves = function() {
	var move, from, to, fromIndex, toIndex;
	Cpu.resetData();
	move = {};
	
	for(from = HOLDERS.PILE_ONE; from <= HOLDERS.PILE_SEVEN; from++) {
		for(to = HOLDERS.ACE_ONE; to <= HOLDERS.ACE_FOUR; to++) {
			move = {};
			move.from = newInstance(Sltr.data[from].lastKey());
			
			move.to = newInstance(Sltr.data[to].lastKey());
			if(!move.to) {
				move.to = {holder: to};
			}
			
			move.flag = Game.validateMove(move.from, move.to, TYPES.PILE_TO_ACE);
			if(move.flag) {
				Cpu.allMoves.push(move);
			}
		}
	}
	
	for(from = HOLDERS.PILE_ONE; from <= HOLDERS.PILE_SEVEN; from++) {
		for(to = HOLDERS.PILE_ONE; to <= HOLDERS.PILE_SEVEN; to++) {
			if(from == to || Sltr.count[from] == 0) continue;
			move = {};
			
			for(fromIndex = 0; fromIndex < Sltr.count[from]; fromIndex++) {
				move.from = newInstance(Sltr.data[from][fromIndex]);
				if(move.from.type == 'face') break;
			}
			if(move.from.index == 0 && move.from.rank == RANKS.king) continue;
			
			move.to = newInstance(Sltr.data[to].lastKey());
			if(!move.to) {
				move.to = {holder: to};
			}
			
			move.flag = Game.validateMove(move.from, move.to, TYPES.PILE_TO_PILE);
			if(move.flag) {
				Cpu.allMoves.push(move);
			}
		}
	}
	
	for(to = HOLDERS.ACE_ONE; to <= HOLDERS.ACE_FOUR; to++) {
		move = {};
		if(Sltr.count[HOLDERS.THREE_CARDS] == 0) break;
		move.from = newInstance(Sltr.data[HOLDERS.THREE_CARDS].lastKey());
		
		move.to = newInstance(Sltr.data[to].lastKey());
			if(!move.to) {
				move.to = {holder: to};
			}
			move.flag = Game.validateMove(move.from, move.to, TYPES.THREE_TO_ACE);
			if(move.flag) {
				Cpu.allMoves.push(move);
			}
	}
	
	for(to = HOLDERS.PILE_ONE; to <= HOLDERS.PILE_SEVEN; to++) {
		move = {};
		if(Sltr.count[HOLDERS.THREE_CARDS] == 0) break;
		move.from = newInstance(Sltr.data[HOLDERS.THREE_CARDS].lastKey());
		if(move.from.rank == RANKS.ACE) continue;
		
		move.to = newInstance(Sltr.data[to].lastKey());
			if(!move.to) {
				move.to = {holder: to};
			}
			move.flag = Game.validateMove(move.from, move.to, TYPES.THREE_TO_PILE);
			if(move.flag) {
				Cpu.allMoves.push(move);
			}
	}
}

Cpu.filterMoves = function() {
	var move, index, reserved;
	const FROM_HOLDER = 0, TO_HOLDER = 1;
	reserved = [[], []];
	
	for(index = 0; index < Cpu.allMoves.length; index++) {
		move = Cpu.allMoves[index];
		
		if(reserved[FROM_HOLDER].indexOf(move.from.holder) != -1 || 
		   reserved[TO_HOLDER].indexOf(move.to.holder)     != -1 ||
		   
		   reserved[FROM_HOLDER].indexOf(move.to.holder)   != -1 || 
		   reserved[TO_HOLDER].indexOf(move.from.holder)   != -1) continue;
		
		reserved[FROM_HOLDER].push(move.from.holder);
		reserved[TO_HOLDER].push(move.to.holder);
		
		Cpu.usefulMoves.push(move);
	}
}

Cpu.putHintMoves = function() {
	var index, holder, cardIndex, move;
	
	for(index = 0; index < Cpu.usefulMoves.length; index++) {
		move      = Cpu.usefulMoves[index];
		holder    = move.from.holder;
		cardIndex = move.from.index;
		
		Cpu.hintMoves[cardIndex + (MAX_HOLDER_COUNT*holder)] = move;
	}
}

Cpu.makeMove = function() {
	var move;
	if(!Cpu.usefulMoves[0]) {
		Cpu.generateMoves();
		Cpu.filterMoves();
	}
	
	clearClick();
	if(!Cpu.usefulMoves[0]) {
		Game.deckClick(OVERRIDE | RECORD);
		return 0;
	}
	move = Cpu.usefulMoves.shift();
	return Game.makeMove(move.from, move.to, move.flag, OVERRIDE | RECORD);
}

Cpu.playOrStop[0] = function() {
	Cpu.isPlaying = 0;
	clearInterval(Cpu.interval);
	
	cpu_button.innerHTML = Cpu.text[Cpu.isPlaying];
};

Cpu.playOrStop[1] = function() {
	Cpu.isPlaying = 1;
	Cpu.interval = setInterval(Cpu.makeMove, Cpu.speed);
	
	cpu_button.innerHTML = Cpu.text[Cpu.isPlaying];
};