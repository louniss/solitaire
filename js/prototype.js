'use strict';

Audio.prototype.stop = function() {
	this.currentTime = 0;
	this.pause();
}

Array.prototype.shuffle = function() {
	var index, randIndex, currentKey, arr, length;
	
	arr = this;
	length = arr.length;
	index = 0;
	
	for(index = 0; index < length; index++) {
		randIndex = Math.floor(Math.random()*length);
		
		currentKey = arr[index];
		arr[index] = arr[randIndex];
		arr[randIndex] = currentKey;
	}
	
	return arr;
}

Array.prototype.randomize = Array.prototype.shuffle;

// to saticfy internet explorer
Array.prototype.fill = Array.prototype.fill || function(value) {
	var arr, length, index;
	
	arr = this;
	length = arr.length;
	
	for(index = 0; index < length; index++) {
		arr[index] = value;
	}
	
	return arr;
}

// fill the array ascendingly 0, 1, 2...
Array.prototype.fillAsc = function() {
	var index, arr;
	
	arr = this;
	
	for(index = 0; index < this.length; index++)
		arr[index] = index;
	return arr;
}

// returns the last element from an array
Array.prototype.lastKey = function() {
	return this[this.length-1];
}

Element.prototype.remove = Element.prototype.remove || function() {
	var elm, child, index, length;
	
	elm = this;
	child = elm.childNodes;
	length = child.length;
	
	for(index = 0; index < length; index++) {
		elm.childNodes[0].removeNode();
	}
	
	elm.removeNode();
};























