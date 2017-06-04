'use strict';

var buttons = {};
var userSettings = {};

/*
  <div id="my_id"></div> 
  my_id == document.getElementById("my_id") by default ;) 
*/

buttons.new			= new_button;
buttons.replay      = replay_button;
buttons.cpu         = cpu_button;
buttons.undo        = undo_button;
buttons.redo        = redo_button;
buttons.sound       = sound_button;
buttons.hint        = hint_button;
buttons.save        = save_button;
buttons.statistics  = statistics_button;
buttons.settings    = settings_button;
buttons.apply       = apply_button;
buttons.about       = about_button;
buttons.close       = close_button;

buttons.init = function() {
	buttons.new.onclick 	= Game.new;			
	buttons.replay.onclick 	= Game.replay; 
	buttons.cpu.onclick     = function() {Cpu.playOrStop[Cpu.isPlaying ^= 1]()};
	buttons.undo.onclick 	= Game.undo;     
	buttons.redo.onclick 	= Game.redo;      
	buttons.sound;     		
	buttons.hint.onclick 	= Game.hintMove;      
	buttons.save.onclick 	= Game.save;      
	buttons.statistics;
	buttons.settings.onclick= userSettings.toggleMenu;
	buttons.apply.onclick   = userSettings.apply;
	buttons.about;
	buttons.close.onclick  = userSettings.showHideMenu[0];
}

userSettings.cpuSpeed;
userSettings.drawCount;

userSettings.menuIsVisible = 0;

userSettings.toggleMenu = function() {
	userSettings.showHideMenu[userSettings.menuIsVisible^=1]();
}

userSettings.showHideMenu = [
	function hide() {
		userSettings.menuIsVisible = 0;
		settings_menu.style.display = "none";
	},
	
	function show() {
		userSettings.menuIsVisible = 1;
		settings_menu.style.left = buttons.settings.offsetLeft + "px";
		settings_menu.style.display = "block";
	}
];

userSettings.apply = function() {
	userSettings.showHideMenu[0]();
	
	eval(settings_values.value);
	
	settings_values.value = "";
}