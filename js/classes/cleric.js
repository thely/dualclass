clr = {};
clr.class = "Cleric";
clr.subclass = "";
clr.level = 1;
clr.hDie = 8;
clr.magic = [];
clr.magic.spells = [];
clr.features = [];
clr.skills = [];
clr.expertise = [];
clr.proficiencies = {};
clr.proficiencies.weapons = ["Simple"];
clr.proficiencies.armor = ["Light", "Medium", "Shields"];
clr.proficiencies.other = [];
clr.saves = ["Wisdom", "Charisma"];
clr.langMod = 0;

clr.generateClass = function(level, person) {
	clr.level = level;
	clr.addFeatures(level);

	var newSkills = clr.addSkills(level, person.skills.slice(0));
	person.skills = person.skills.concat(newSkills);

	var newSpells = clr.addSpells(level, person.spells.slice(0));
	// person.spells.push(newSpells);
}

clr.printClass = function() {
	// console.log("Level " + clr.level + " Cleric in the " + clr.subclass + " Domain");
	// console.log("Features:");
	// console.log(clr.features);
	// console.log("Skills:");
	// console.log(clr.skills);
	// console.log("Expertise:");
	// console.log(clr.expertise);
	// console.log("Spells:");
	// console.log(clr.magic.spells);
	// console.log("Proficiencies:");
	// console.log(clr.proficiencies);
	$(".basics p").text("Level " + clr.level + " Cleric (" + clr.subclass + " Domain)");
	$("div.feat p").text(clr.features.join(", "));
	$("div.skills p").html(makeSkillText(clr.skills));
	$("div.spells p").html(makeSpellText(clr.magic.spells));
	$("div.profs p").html(makeProfText(clr.proficiencies));
	$("div.slots").html(printSpellSlots(clr.magic.slots));
	$("div.spells .spellnotes").text("All clerics cast from the full cleric spell list. The above are domain spells and cantrips.");
}

// -------------- FEATURES ----------

clr.addFeatures = function(level) {
	clr.features.push("Spellcasting", "Divine Domain");
	x = 1;
	if (level >= 2) {
		if (level >= 6)
			x = 2;
		if (level >= 18)
			x = 3;
		clr.features.push("Channel Divinity " + x + "/rest", "Turn Undead*");
	}

	if (level >= 17)
		clr.features.push("Destroy Undead (CR 4)");
	else if (level >= 14)
		clr.features.push("Destroy Undead (CR 3)");
	else if (level >= 11)
		clr.features.push("Destroy Undead (CR 2)");
	else if (level >= 8)
		clr.features.push("Destroy Undead (CR 1)");
	else if (level >= 5)
		clr.features.push("Destroy Undead (CR 1/2)");

	if (level >= 11)
		clr.features.push("Divine Intervention");

	clr.chooseDomain(level);
}

clr.chooseDomain = function(level) {
	var domains = {};
	// var domains = ["Forge", "Knowledge", "Life", "Light", "Nature", "Order", "Tempest", "Trickery", "War"];
	// doms = [];
	domains["Forge"] = ["Blessing of the Forge", "Artisan's Blessing*", "Soul of the Forge", "Divine Strike", "Saint of Forge and Fire"];
	domains["Knowledge"] = ["Blessing of Knowledge", "Knowledge of the Ages*", "Read Thoughts*", "Potent Spellcasting", "Visions of the Past"];
	domains["Life"] = ["Discipline of Life", "Preserve Life*", "Blessed Healer", "Divine Strike", "Supreme Healing"];
	domains["Light"] = ["Warding Flare", "Radiance of the Dawn*", "Improved Flare", "Potent Spellcasting", "Corona of Light"];
	domains["Nature"] = ["Acolyte of Nature", "Charm Animals and Plants*", "Dampen Elements", "Divine Strike", "Master of Nature"];
	domains["Order"] = ["Voice of Authority", "Order's Demand*", "Embodiment of the Law", "Divine Strike", "Order's Wrath"];
	domains["Tempest"] = ["Wrath of the Storm", "Destructive Wrath*", "Thunderbolt Strike", "Divine Strike", "Stormborn"];
	domains["Trickery"] = ["Blessing of the Trickster", "Invoke Duplicity*", "Cloak of Shadows*", "Divine Strike", "Improved Duplicity"];
	domains["War"] = ["War Priest", "Guided Strike*", "War God's Blessing*", "Divine Strike", "Avatar of Battle"];

	// Pick subclass via key
	var keys = Object.keys(domains);
	clr.subclass = keys[randInt(0, keys.length)];
	// clr.subclass = "Knowledge";
	path = clr.subclass;

	switch (clr.subclass) {
		case "Forge":
			clr.proficiencies.armor.push("Heavy");
			clr.proficiencies.other.push("Smith's tools");
			break;
		case "Knowledge":
			// also gets extra skill junk
			clr.langMod += 2;
			break;
		case "Life":
			clr.features.push("Bonus Proficiency");
			clr.proficiencies.armor.push("Heavy");
			break;
		case "Light":
			clr.features.push("Bonus Cantrip"); // gets light
			break;
		case "Nature":
			// gets a druid cantrip and Animal Handling/Nature/Survival
			break;
		case "Order": //also Intimidation or Persuasion
			clr.features.push("Bonus Proficiency");
			clr.proficiencies.armor.push("Heavy");
			break;
		case "Tempest":
			clr.features.push("Bonus Proficiencies");
			clr.proficiencies.weapons.push("Martial");
			clr.proficiencies.armor.push("Heavy");
			break;
		case "Trickery":
			break;
		case "War":
			clr.features.push("Bonus Proficiencies");
			clr.proficiencies.weapons.push("Martial");
			clr.proficiencies.armor.push("Heavy");
			break;
	}

	// Add all Domain features
	clr.features.push(domains[path][0]);
	clr.langMod += 2;

	if (level >= 2)
		clr.features.push(domains[path][1]);
	if (level >= 6)
		clr.features.push(domains[path][2]);
	if (level >= 8)
		clr.features.push(domains[path][3]);
	if (level >= 17)
		clr.features.push(domains[path][4]);
}

// -------------- SKILLS ------------

clr.addSkills = function(level, knownSkills) {
	domainSkills = [];
	if (typeof knownSkills == undefined)
		knownSkills = [];

	if (clr.subclass == "Knowledge"){
		domainSkills = skillChunk([2,5,10,14], 2, knownSkills);
		clr.expertise = domainSkills;
	}
	else if (clr.subclass == "Nature"){
		domainSkills = skillChunk([1, 10, 17], 1, knownSkills);
	}
	else if (clr.subclass == "Order") {
		domainSkills = skillChunk([7, 13], 1, knownSkills);	
	}

	// clr.skills.push(domainSkills);
	toCheck = domainSkills.concat(knownSkills);

	newSkills = skillChunk([5,6,9,13,14], 2, toCheck).concat(domainSkills);
	clr.skills = newSkills;
	return newSkills.slice(0);
}

// -------------- SPELLS ------------

clr.addSpells = function(level, personSpells) {
	clr.magic.slots = clr.getSpellSlots(level);
	var cantripsKnown = clr.getNumSpellsKnown(level);
	clr.magic.spells = clr.getSpells(cantripsKnown, clr.magic.slots, personSpells);
	return clr.magic.spells;
}

clr.getSpellSlots = function(level) {
	var slots = [10];
	slots[1] = 2;
	if (level >= 2)
		slots[1] = 3;
	if (level >= 3) {
		slots[1] = 4;
		slots[2] = 2;
	}
	if (level >= 4)
		slots[2] = 3;
	if (level >= 5) {
		slots[3] = 2;
	}
	if (level >= 6)
		slots[3] = 3;
	if (level >= 7)
		slots[4] = 1;
	if (level >= 8)
		slots[4] = 2;
	if (level >= 9) {
		slots[4] = 3;
		slots[5] = 1;
	}
	if (level >= 10)
		slots[5] = 2;
	if (level >= 11)
		slots[6] = 1;

	return slots;
}

clr.getNumSpellsKnown = function(level) {
	var cant = 3;
	if (level >= 4)
		cant = 4;
	if (level >= 10)
		cant = 5;
	return cant;
}

clr.magic.list = [];
clr.magic.list[0] = ["Guidance","Light","Mending","Resistance","Sacred Flame","Spare the Dying","Thaumaturgy"];
clr.magic.list[1] = ["Bane","Bless","Command","Create or Destroy Water","Cure Wounds","Detect Evil and Good","Detect Magic","Detect Poison and Disease","Guiding Bolt","Healing Word","Inflict Wounds","Protection from Evil and Good","Purify Food and Drink","Sanctuary","Shield of Faith"];
clr.magic.list[2] = ["Aid","Augury","Blindness/Deafness","Calm Emotions","Continual Flame","Enhance Ability","Find Traps","Gentle Repose","Hold Person","Lesser Restoration","Locate Object","Prayer of Healing","Protection from Poison","Silence","Spiritual Weapon","Warding Bond","Zone of Truth"];
clr.magic.list[3] = ["Animate Dead","Beacon of Hope","Bestow Curse","Clairvoyance","Create Food and Water","Daylight","Dispel Magic","Feign Death","Glyph of Warding","Magic Circle","Mass Healing Word","Meld into Stone","Protection from Energy","Remove Curse","Revivify","Sending","Speak with Dead","Spirit Guardians","Tongues","Water Walk"];
clr.magic.list[4] = ["Banishment","Control Water","Death Ward","Divination","Freedom of Movement","Guardian of Faith","Locate Creature","Stone Shape"];
clr.magic.list[5] = ["Commune","Contagion","Dispel Evil and Good","Flame Strike","Geas","Greater Restoration","Hallow","Insect Plague","Legend Lore","Mass Cure Wounds","Planar Binding","Raise Dead","Scrying"];

clr.getSpells = function(cantripsKnown, slots, knownSpells) {
	var newSpells = [];
	noKnownSpells = false;
	if (typeof knownSpells == 'undefined') // if we know nothing
		noKnownSpells = true;

	if (clr.subclass == "Nature") {
		newSpells = [pickUnique(drd.magic.list[0], [])];
	}
	else if (clr.subclass == "Light") {
		newSpells = ["Light"];
	}
	
	var cantos = skillChunk(clr.magic.list[0], cantripsKnown, newSpells.slice(0));
	newSpells = newSpells.concat(cantos);

	var domSpells = {};
	domSpells["Forge"] = [[],["Searing Smite", "Identify"], ["Heat Metal", "Magic Weapon"], ["Elemental Weapon", "Protection from Energy"], ["Fabricate", "Wall of Fire"], ["Animate Objects", "Creation"]];
	domSpells["Knowledge"] = [[],["Command", "Identify"], ["Augury", "Suggestion"], ["Nondetection", "Speak with Dead"],["Arcane Eye", "Confusion"],["Legend Lore", "Scrying"]];
	domSpells["Life"] = [[],["Bless", "Cure Wounds"],["Lesser Restoration","Spiritual Weapon"],["Beacon of Hope", "Revivify"],["Death Ward", "Guardian of Faith"],["Mass Cure Wounds", "Raise Dead"]];
	domSpells["Light"] = [[],["Burning Hands", "Faerie Fire"], ["Flaming Sphere", "Scorching Ray"], ["Daylight", "Fireball"], ["Guardian of Faith", "Wall of Fire"], ["Flame Strike", "Scrying"]];
	domSpells["Nature"] = [[],["Animal Friendship", "Speak with Animals"], ["Barkskin", "Spike Growth"], ["Plant Growth", "Wind Wall"], ["Dominate Beast", "Grasping Vine"], ["Insect Plague", "Tree Stride"]];
	domSpells["Order"] = [[],["Command", "Heroism"], ["Hold Person", "Zone of Truth"], ["Mass Healing Word", "Slow"], ["Compulsion", "Locate Creature"],["Commune", "Dominate Person"]];
	domSpells["Tempest"] = [[],["Fog Cloud","Thunderwave"],["Gust of Wind","Shatter"],["Call Lightning","Sleet Storm"],["Control Water","Ice Storm"],["Destructive Wave","Insect Plague"]];
	domSpells["Trickery"] = [[],["Charm Person", "Disguise Self"],["Mirror Image","Pass without Trace"],["Blink","Dispel Magic"],["Dimension Door","Polymorph"],["Dominate Person","Modify Memory"]];
	domSpells["War"] = [[],["Divine Favor","Shield of Faith"],["Magic Weapon","Spiritual Weapon"],["Crusader's Mantle","Spirit Guardians"],["Freedom of Movement","Stoneskin"],["Flame Strike","Hold Monster"]];

	// clr.magic.spells = clr.magic.list;
	clr.magic.spells[0] = newSpells;
	clr.magic.domainspells = clr.myDomSpells(domSpells[clr.subclass], slots);
	var allSpells = world.combineSpellLists(clr.magic.spells.slice(0), clr.magic.domainspells.slice(0));
	
	console.log("NEW SPELLS?");
	console.log(clr.magic.spells);
	console.log(allSpells);

	return allSpells;
}

clr.myDomSpells = function(spells, slots) {
	var mySpells = [];

	for (var i = 0; i < slots.length; i++) {
		if (slots[i])
			mySpells[i] = spells[i];
	}

	return mySpells;
}

// old number of spells known dump:
	/*
	sp = level + mod[4];	
	sp1=0;
	sp2=0;
	sp3=0;
	sp4=0;
	sp5=0;
	if (level <3) {
		sp1 = sp;
		sp2 =0;
	} else if (level <5) {
		x= 	Math.floor(sp * .7);
		sp1 = x;
		sp2 = (sp -x);
	} else if (level < 7) {
		x = Math.ceil(sp * .35);
		y = Math.floor(sp * .35);

		sp1 = x;
		z = sp-x-y;
		sp2 = y;
		sp3 = z;

	} else if (level < 9) {
		x = Math.floor(sp * .28);
		y = Math.floor(sp * .28);
		z = Math.floor(sp * .28);

		sum = sp - x-y-z;
		sp1 = sum;
		sp2 = y;
		sp3 = z;
		sp4 = x;

	} else if (level > 8) {
		x = Math.floor(sp * .21);
		y = Math.ceil(sp * .18);
		z = Math.ceil(sp * .18);
		xx = Math.floor(sp * .21);

		sum = sp - x-y-z-xx;
		sp1 = sum;
		sp2 = y;
		sp3 = z;
		sp4 = xx;
		sp5 = x;


	}
	console.log("Spells known:  "+sp1 +"/ " + sp2+"/ " + sp3 +"/ " + sp4+"/ " + sp5+" / Total = "+sp);
	
	if ((sp1+sp2+sp3+sp4+sp5) != sp)
		console.log("not the right number of spells known");
*/

