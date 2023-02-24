"use strict";

//----------Rooms Database

const allRooms = {
  prisonCell: {
    name: "prisonCell",
    title: "The Prison Cell",
    class: "prisonCell",
    class2: "prisonCellOpen",
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
    class: "theTunnel",
    keyItems: null,
    screenItems: null,
    background: "jailcell.png",
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
    screenItems: null,
    pathsArray: ["theTunnel"],
    paths: {},
    prerequisites: {},
    unlocked: false,
    visited: false,
  },
};

//connecting the rooms via path creation. ⭐turn this into a for-loop later
Object.keys(allRooms).forEach((room) => {
  console.log(room); //just a string
  allRooms[room].pathsArray.forEach((pathString) => {
    allRooms[room].paths[pathString] = allRooms[pathString];
  });
});

console.log(allRooms);

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
  constructor() {
    // this.visitedRooms = {}; //as the rooms change, we will want to overwrite them....⭐ Might not be true if visitedRooms is just pointing at the room classes like {prisonCell, tunnel, }
    this.currentRoom = allRooms.prisonCell; //the current room that the user is in at any given moment
    this.inventory = {}; //the user's inventory at any given moment.
    this.isDead = false;
  }

  begin = () => {
    // this.visitedRooms[this.currentRoom.name] = this.currentRoom; //adding our first room to the visited rooms.
    console.log("Game has begun...");
    console.log(this.currentRoom);
    this.renderRoom(this.currentRoom);
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
  renderRoom = (room) => {
    console.log("rendering room --> ", room);
    roomElement.classList.add(room.class); //adding the class of the currentRoom

    //if the room contains a begining dialog, we go ahead and add that
    if (room.dialog.intro !== undefined) {
      dialogBox.innerText = room.dialog.intro;
    }

    //loop through the screenItems array and create/append to screen
    room.screenItems.forEach((item) => {
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

    console.log(this.currentRoom);
    this.currentRoom = allRooms[pathName];
    console.log(this.currentRoom);
    this.renderRoom(this.currentRoom);
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
  game = new Game();
  game.begin();

  //----------------------------------------------------------Chapter1: the Prison Cell-------------------------------------------------------------------------⛓️⛓️⛓️🚽
  //⭐ In these chapters is where we will create our choice functions and where we will add our event listeners and timers.

  //1. Player finds note which activates toilet tunnel.
  //2. Player can only go through tunnel if note is in inventory && guard is not watching

  //grab shine and add eventlistener that makes a modal pop up with text, then places it in your inventory and removes shine from  screen.
  const shine = document.querySelector(".shine");
  const toilet = document.querySelector(".toilet");

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

  toilet.addEventListener("click", () => {
    console.log(
      "the toilet loosens up and you are able to slide it over to reveal a cave..."
    );

    //remove old class and add new class to prison room
    roomElement.classList.replace(
      game.currentRoom.class,
      game.currentRoom.class2
    );

    //now replace the onclick listener
    toilet.onclick = function () {
      console.log("Going into the tunnel...");
      game.takePath(game.currentRoom.pathsArray[0]);
    };
  });
  // game.currentRoom.takePath(game.currentRoom.paths[0]);
}; //-------------END of StartGame function

//--launch
startButton.addEventListener("click", startGame); //clicking on the start game button will start the game.
