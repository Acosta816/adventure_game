"use strict";

//----------Rooms Database
const gameLevels = {
  prisonCell: {
    properties: {
      name: "prisonCell",
      title: "The Prison Cell",
      background: "jailcell.png",
      screenItems: [
        {
          name: "note",
          class: "shine",
        },
        {
          name: "toilet",
          class: "toilet",
        },
      ],
      paths: ["theTunnel"], //only one path, the toilet tunnel.
      prerequisites: {},
    },
  },
  theTunnel: {
    properties: {
      name: "theTunnel",
      title: "The Tunnel",
      keyItems: null,
      screenItems: null,
      background: "jailcell.png",
      paths: ["secretCave", "prisonCell"],
      prerequisites: ["note"],
    },
  },
  secretCave: {
    properties: {
      name: "secretCave",
      title: "The Secret Cave",
      background: "background.jpg",
      keyItems: null,
      screenItems: null,
      paths: null,
      prerequisites: {},
    },
  },
};

//------------Visual Elements------
const roomElement = document.querySelector(".screen");
const startButton = document.querySelector(".startButton");

//----------------global variables------------------------
let game;

//-----------Room class
class Game {
  constructor() {
    this.visitedRooms = {}; //as the rooms change, we will want to overwrite them....⭐ Might not be true if visitedRooms is just pointing at the room classes like {prisonCell, tunnel, }
    this.currentRoom = null; //the current room that the user is in at any given moment
    this.inventory = {}; //the user's inventory at any given moment.
    this.isDead = false;
  }

  begin = () => {
    const prisonCell = new Room(gameLevels.prisonCell.properties);
    prisonCell.isCurrentRoom = true;
    console.log(prisonCell);
    this.currentRoom = prisonCell; //starting the game off with prison as first room.

    this.visitedRooms[this.currentRoom.name] = this.currentRoom; //adding our first room to the visited rooms.
    console.log(this.visitedRooms);
    console.log("Game has begun...");
    console.log(this.currentRoom);
    this.renderRoom(this.currentRoom);
  };

  renderRoom = (room) => {
    console.log("rendering room --> ", room);
    console.log(roomElement);
    roomElement.classList.add(room.class);

    //loop through the screenItems array and create/append to screen
    this.currentRoom.screenItems.forEach((item) => {
      let itemDiv = room.createHTML(item);
      console.log(itemDiv);
      itemDiv.addEventListener("click", () => {
        console.log("clicked!!!");
      });
      roomElement.appendChild(itemDiv);
    });
  };
} //----------------------------end of game class

class Room {
  constructor(properties) {
    this.name = properties.name;
    this.title = properties.title;
    this.screenItems = properties.screenItems;
    // this.keyItems = properties.keyItems;
    this.isCurrentRoom = false;
    this.prerequisites = properties.prerequisites;
    this.paths = properties.paths;
  }

  createHTML = (screenItemData) => {
    let screenItemDiv = document.createElement("div");
    screenItemDiv.classList.add(screenItemData.class);
    return screenItemDiv;
  }; //end of createHTML

  //accepts a path which is just a pointer
  takePath(pathName) {
    console.log(pathName);
    console.log(`Current room: ${this.name}`);
    console.log(`You are taking ${pathName} path.`);

    //if this room has already been visited, then we have it in our visitedRooms object, and we'll just go there.
    if (game.visitedRooms[pathName]) {
      const goTo = game.visitedRooms[pathName]; //capturing in variable for ease.
      console.log(`Going back to ${goTo.name}`);
      game.renderRoom(goTo);
    } else {
      console.log(pathName);
      console.log(gameLevels[pathName].properties.name);
      const goTo = new Room(gameLevels[pathName].properties);

      game.currentRoom =
        // const pathVariable = gameLevels[pathName].properties.name;
        // const [gameLevels[pathName].properties.name'] = new Room(gameLevels[pathName].properties);
        game.renderRoom(new Room(gameLevels[pathName]));
    }
  }
} //-------------------------------end of room class

//-----start the game!!!! This is where you tell your story
const startGame = () => {
  startButton.classList.toggle("hidden");

  //setup the game objects
  game = new Game();
  game.begin();

  //----Chapter1: the Prison Cell------------
  //1. Player finds note which activates toilet tunnel.
  //2. Player can only go through tunnel if note is in inventory && guard is not watching

  game.currentRoom.takePath(game.currentRoom.paths[0]);
};

startButton.addEventListener("click", startGame); //clicking on the start game button will start the game.
