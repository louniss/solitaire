/* 
Solitare uses the standard 52 deck cards. 

it includes 4 suits in the following order:
diamonds (♦), clubs (♣), hearts (♥) and spades (♠),
and 13 ranks for each suit. named as:
ace, 2, 3 .. 10, jack, queen, and king

https://en.wikipedia.org/wiki/Standard_52-card_deck
*/

const MARGIN	  = 10;
const TOP_START   = 50;

const SUITS 	= {diamonds:0, clubs:1,hearts:2,spades:3};
const RANKS		= {ace:0,two:1,three:2,four:3,five:4,six:5,seven:6,eight:7,nine:8,ten:9,jack:10,queen:11,king:12};

const SUITS_IMG = ["diamonds", "clubs", "hearts", "spades"];

const RANKS_IMG = [
	"ace_of_",
	"2_of_",
	"3_of_",
	"4_of_",
	"5_of_",
	"6_of_",
	"7_of_",
	"8_of_",
	"9_of_",
	"10_of_",
	"jack_of_",
	"queen_of_",
	"king_of_"
];
	  
const HOLDERS_NAMES = [
	"stack", 
	"three_cards",
	"ace_one",
	"ace_two",
	"ace_three",
	"ace_four",
	"pile_one",
	"pile_two",
	"pile_three",
	"pile_four",
	"pile_five",
	"pile_six",
	"pile_seven"
];

const HOLDERS = {
	"STACK":0,
	"THREE_CARDS":1,
	"ACE_ONE":2,
	"ACE_TWO":3,
	"ACE_THREE":4,
	"ACE_FOUR":5,
	"PILE_ONE":6,
	"PILE_TWO":7,
	"PILE_THREE":8,
	"PILE_FOUR":9,
	"PILE_FIVE":10,
	"PILE_SIX":11,
	"PILE_SEVEN":12
};

const TOTAL_CARDS = 52;

const DELAY_TIME  = 100;//ms

const TYPES = {INVALID:0,PILE_TO_ACE:1, PILE_TO_PILE:2, ACE_TO_ACE: 3, ACE_TO_PILE:4, THREE_TO_ACE:5, THREE_TO_PILE:6};

const RECORD = 2;

const OVERRIDE = 1;

const MFLAGS = { 
	INVALID: 					    (0<<0),
	LAST_TOP: 						(1<<0),
	LEFT_TOP:						(1<<1),
	POP:							(1<<2),
	FLIP_ADD_EVENTS: 				(1<<3),
	PORTION: 						(1<<4),
	ADD_EVENTS: 					(1<<5)
};

const MAX_HOLDER_COUNT = 24;