"use strict";

//----------Rooms Database

const roomData = {
  prisonCell: {
    name: "prisonCell",
    title: "The Prison Cell",
    classes: {
      class1: "prisonCell",
      class2: "prisonCellOpen",
    },
    currentClass: "prisonCell",
    background: "jailcell.png",
    dialog: {
      intro: "You awaken in a dark cell. No recolection of how you got there.",
      pickedUpNote: `📜What's this? a note?...[ placed in pocket🎒 ]`,
    },
    screenItems: [
      {
        name: "note",
        screenClass: "shine",
        inventoryClass: "note",
        info: 'It reads: "flush yourself away..."',
      },
      {
        name: "toilet",
        screenClass: "toilet",
        hidden: true,
      },
    ],
    pathsArray: ["theTunnel"], //only one path, the toilet tunnel.
    paths: {},
    prerequisites: {},
    unlocked: true,
    visited: true,
  },
  theTunnel: {
    name: "theTunnel",
    title: "The Tunnel",
    classes: {
      class1: "theTunnel",
    },
    currentClass: "theTunnel",
    dialog: {
      intro:
        "Crawling through the dark wet tunnel for a little while. You are met with 2 paths. Left or right?",
    },
    keyItems: null,
    screenItems: [
      {
        name: "note",
        screenClass: "shine",
        inventoryClass: "note",
        info: 'It reads: "flush yourself away..."',
      },
      {
        name: "toilet",
        screenClass: "toilet",
        hidden: false,
      },
    ],
    background: "tunnel2.webp",
    pathsArray: ["prisonCell", "secretCave"],
    paths: {},
    prerequisites: ["note"],
    unlocked: false,
    visited: false,
  },
  secretCave: {
    name: "secretCave",
    title: "The Secret Cave",
    class: "secretCave",
    background: "background.jpg",
    keyItems: null,
    screenItems: [
      {
        name: "note",
        screenClass: "shine",
        inventoryClass: "note",
        info: 'It reads: "flush yourself away..."',
      },
      {
        name: "toilet",
        screenClass: "toilet",
        hidden: false,
      },
    ],
    pathsArray: ["theTunnel"],
    paths: {},
    prerequisites: {},
    unlocked: false,
    visited: false,
  },
};

//connecting the rooms via path creation. ⭐turn this into a for-loop later
Object.keys(roomData).forEach((room) => {
  console.log(room); //just a string
  roomData[room].pathsArray.forEach((pathString) => {
    roomData[room].paths[pathString] = roomData[pathString];
  });
});

console.log(roomData);

//------------Visual Elements------
const roomElement = document.querySelector(".screen");
const dialogBox = document.querySelector(".petChatBox");
const inventoryIcon = document.querySelector(".inventoryIcon");
const inventoryOpen = document.querySelector(".inventoryOpen");
const inventoryToolTip = document.querySelector(".inventoryToolTip");

const startButton = document.querySelector(".startButton");

//----------------global variables------------------------
let game;

//-----------Room class
class Game {
  constructor(allRooms) {
    this.allRooms = allRooms; //as the rooms change, we will want to overwrite them....⭐ Might not be true if visitedRooms is just pointing at the room classes like {prisonCell, tunnel, }
    this.currentRoom = allRooms.prisonCell; //the current room that the user is in at any given moment
    this.inventory = {}; //the user's inventory at any given moment.
    this.isDead = false;
  }

  begin = () => {
    // this.visitedRooms[this.currentRoom.name] = this.currentRoom; //adding our first room to the visited rooms.
    console.log("Game has begun...");
    // this.allRooms[this.currentRoom.name].currentClass =
    //   this.currentRoom.classes.class1; //setting the currentClass of the currentRoom to thefirst one.
    console.log(this.currentRoom);
    this.renderRoom(true); //passing in true because it's the first render
  };

  //creates the html for the screen item
  createScreenItemHTML = (screenItemData) => {
    let screenItemDiv = document.createElement("div");
    screenItemDiv.classList.add(screenItemData.screenClass);
    if (screenItemData.hidden) {
      screenItemDiv.classList.add("hidden");
    }

    return screenItemDiv;
  }; //-----------end of createScreenItemHTML

  //------⭐-----instead of passing in room, can i just use this.currentRoom inside this function?
  renderRoom = (firstRoom = false, prevClass) => {
    console.log("rendering room --> ", this.currentRoom);
    if (!firstRoom) {
      roomElement.classList.replace(prevClass, this.currentRoom.currentClass); //adding the class of the currentRoom
    } else {
      roomElement.classList.add(this.currentRoom.currentClass);
    }
    //if the room contains a begining dialog, we go ahead and add that
    if (this.currentRoom.dialog.intro !== undefined) {
      dialogBox.innerText = this.currentRoom.dialog.intro;
    }

    //loop through the screenItems array and create/append to screen
    this.currentRoom.screenItems.forEach((item) => {
      let itemDiv = this.createScreenItemHTML(item);
      console.log(itemDiv);
      roomElement.appendChild(itemDiv);
    });
  }; //-----end of renderRoom

  createInventoryItemHTML = (item) => {
    const li = document.createElement("li");
    li.classList.add("inventoryItem", item.inventoryClass);

    //move hover over evernt
    li.addEventListener("mouseover", () => {
      inventoryToolTip.innerText = item.info;
      inventoryToolTip.classList.toggle("hidden");
    });
    //now need a mouse NOT hovering over event
    li.addEventListener("mouseout", () => {
      inventoryToolTip.classList.toggle("hidden");
    });
    return li;
  };

  addItemToInventory = (item) => {
    game.inventory[item.name] = item; //adding to game.inventory obj

    inventoryOpen.appendChild(this.createInventoryItemHTML(item));
    document.querySelector(`.${item.screenClass}`).remove();
  };

  //accepts a path string from the room's pathsArray which is just a pointer
  takePath(pathName) {
    console.log(pathName);
    console.log(`Current room: ${this.currentRoom.title}`);
    console.log(`You are taking ${pathName} path.`);
    let oldClass = this.currentRoom.currentClass; //capturing the old class

    console.log(this.currentRoom); //logs prison
    this.currentRoom = this.allRooms[pathName];
    console.log(this.currentRoom); //logs theTunnel
    this.renderRoom(this.currentRoom, false, oldClass); //passing in the new room/theTunnel
  }
} //----------------------------end of game class

//-----start the game!!!! This is where you tell your story
const startGame = () => {
  //hide start button, add click toggle listener to backpack icon that toggles
  startButton.classList.toggle("hidden");

  inventoryIcon.addEventListener("click", () => {
    inventoryOpen.classList.toggle("hidden");
  });

  //setup the game objects
  game = new Game(roomData);
  game.begin();

  //----------------------------------------------------------Chapter1: the Prison Cell-------------------------------------------------------------------------⛓️⛓️⛓️🚽
  //⭐ In these chapters is where we will create our choice functions and where we will add our event listeners and timers.

  //1. Player finds note which activates toilet tunnel.
  //2. Player can only go through tunnel if note is in inventory && guard is not watching

  //grab shine and add eventlistener that makes a modal pop up with text, then places it in your inventory and removes shine from  screen.
  const shine = document.querySelector(".shine");
  const toilet = document.querySelector(".toilet");

  const stoneGrindingSound = new Audio(); // create the audio
  stoneGrindingSound.src = "./music/stone_sliding.mp3"; // set the resource location
  stoneGrindingSound.oncanplaythrough = function () {
    // When the stoneGrindingSound has completely loaded
    stoneGrindingSound.readyToRock = true; // flag stoneGrindingSound is ready to play
  };

  function playStoneGrindingSound() {
    if (stoneGrindingSound && stoneGrindingSound.readyToRock) {
      // check for the stoneGrindingSound and if it has loaded
      stoneGrindingSound.currentTime = 0; // seek to the start
      stoneGrindingSound.play(); // play it till it ends
    }
    toilet.removeEventListener("click", playStoneGrindingSound);
  }

  shine.addEventListener("click", () => {
    console.log("Whats this? A note? ...");

    //call a function that loads some text to infoBox
    dialogBox.innerText = game.currentRoom.dialog.pickedUpNote;

    //adding the note object to inventory 🎒
    //now append it to the inventoryOpen's html
    game.addItemToInventory(game.currentRoom.screenItems[0]);

    //toilet is now active
    toilet.classList.toggle("hidden");
  });

  toilet.addEventListener("click", playStoneGrindingSound);

  toilet.addEventListener("click", () => {
    // playStoneGrindingSound();
    console.log(
      "the toilet loosens up and you are able to slide it over to reveal a cave..."
    );

    console.log(game.currentRoom.currentClass);
    console.log(game.currentRoom.classes.class2);
    //remove old prison class and add new prisonOpen class to prison room
    roomElement.classList.replace(
      game.currentRoom.currentClass,
      game.currentRoom.classes.class2
    );

    toilet.classList.replace("toilet", "toiletOpen");

    game.currentRoom.currentClass = "potatoes";
    console.log(game.allRooms[game.currentRoom.name].currentClass); //any modifications made to game.currentRoom will affect original roomData⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐Consider placing roomData as part of the game property

    //now replace the onclick listener again with one that takes you to the next room✨✨✨
    toilet.onclick = function () {
      console.log("Going into the tunnel...");
      game.takePath(game.currentRoom.pathsArray[0]);
    };
  });
  // game.currentRoom.takePath(game.currentRoom.paths[0]);
}; //-------------END of StartGame function

//--launch
startButton.addEventListener("click", startGame); //clicking on the start game button will start the game.
