bbn = {};
bbn.class = "Barbarian";
bbn.level = 1;
bbn.hDie = 12;
bbn.features = [];
bbn.skills = [];
bbn.proficiencies = {};
bbn.proficiencies.weapons = ["Simple", "Martial"];
bbn.proficiencies.armor = ["Light", "Medium", "Shields"];
bbn.proficiencies.other = [];
bbn.saves = ["Strength", "Constitution"];
bbn.stipulations = ["no heavy armor"];
bbn.subclass = "";
bbn.speedMod = 0;

// -------------- FEATURES ----------

bbn.generateClass = function(level, person) {
	bbn.level = level;
	bbn.addFeatures(level);

	newSkills = bbn.addSkills(level, person.skills.slice(0));
	person.skills = person.skills.concat(newSkills);

	// newSpells = addSpells(level, person.spells);
	// person.spells.push(newSpells);
}

bbn.printClass = function() {
	// console.log("Welcome to bbn! Let's be random.");
	// console.log("Level " + bbn.level + " Barbarian in the " + bbn.subclass);
	// console.log("Features:");
	// console.log(bbn.features);
	// console.log("Skills:");
	// console.log(bbn.skills);
	// // console.log("Spells:");
	// // console.log(bbn.magic.spells);
	// console.log("Proficiencies:");
	// console.log(bbn.proficiencies);
	$(".basics p").text("Level " + bbn.level + " Barbarian (" + bbn.subclass + ")");
	$("div.feat p").text(bbn.features.join(", "));
	$("div.skills p").html(makeSkillText(bbn.skills));
	$("div.profs p").html(makeProfText(bbn.proficiencies));
	// $("div.spells p").text(bbn.magic.spells + "");
}

bbn.addFeatures = function(level) {	
	bbn.features.push(bbn.rages(level), "Unarmored Defense");

	if (level >= 2)
		bbn.features.push("Reckless Attack", "Danger Sense");
	if (level >= 3) {
		bbn.chooseSubclass(level);
	}
	if (level >= 5) {
		bbn.features.push("Extra Attack", "Fast Movement");
		bbn.speedMod += 10;
	}
	if (level >= 7)
		bbn.features.push("Feral Instinct");
	if (level >= 9)
		bbn.features.push("Brutal Critical");
	if (level >= 11) 
		bbn.features.push("Relentless Rage");
	if (level >= 15)
		bbn.features.push("Persistent Rage");
	if (level >= 18)
		bbn.features.push("Indomitable Might");
	if (level >= 20)
		bbn.features.push("Primal Champion");
}

bbn.rages = function(level) {
	var x = 2;
	
	if (level >= 3)
		x = 3;
	if (level >= 6)
		x = 4;
	if (level >= 12)
		x = 5;
	if (level >= 17)
		x = 6;

	y = 2;

	if (level >= 9)
		y = 3;
	if (level >= 16)
		y = 4;

	return "Rage " + x + "/day, +" + y + " Rage Damage";
}

bbn.chooseSubclass = function(level) {
	var paths = {};
	paths = ["Ancestral Guardian","Berzerker","Storm Herald","Totem Warrior","Zealot"];
	var x = paths[randInt(0, paths.length)];
	bbn.subclass = x;

	paths["Ancestral Guardian"] = ["Ancestral Protectors", "Spirit Shield", "Consult the Spirits", "Vengeful Ancestors"];
	paths["Berzerker"] = ["Frenzy", "Mindless Rage", "Intimidating Presence", "Retaliation"];
	paths["Storm Herald"] = ["Storm Aura", "Storm Soul", "Shielding Storm", "Raging Storm"];
	paths["Totem Warrior"] = [["Spirit Seeker", "Totem Spirit"], "Aspect of the Beast", "Spirit Walker", "Totemic Attunement"];
	paths["Zealot"] = [["Divine Fury", "Warrior of the Gods"], "Fanatical Focus", "Zealous Presence", "Rage Beyond Death"];
	
	if (paths[x][1]) {
		if (paths[x][1] instanceof Array) {
			bbn.features.push(paths[x][0][0], paths[x][0][1]);
		}
		else {
			bbn.features.push(paths[x][0]);
		}
	}

	if (level >= 6)
		bbn.features.push(paths[x][1]);
	if (level >= 10)
		bbn.features.push(paths[x][2]);
	if (level >= 14)
		bbn.features.push(paths[x][3]);

	if (x == "Totem Warrior") {
		x = randInt(0, 3);
		path = "";
		
		if (x == 0)
			path = "Bear";
		if (x == 1)
			path = "Eagle";
		if (x == 2)
			path = "Wolf";

		bbn.totem = path;
		bbn.subclass = "Path of the Totem Warrior - " + bbn.totem;
	}
}

// skills
bbn.addSkills = function(level, knownSkills) {
	var newSkills = skillChunk([1,3,7,10,11,17], 2, knownSkills);

	bbn.skills = newSkills;
	return newSkills;
}

