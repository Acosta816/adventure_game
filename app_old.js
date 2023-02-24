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
      ],
      //   keyItems: [{ name: "note", img: "foldednote.png" }], //found under the bed
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
    roomElement.classList.add("prisonCell");

    //loop through the screenItems array and create/append to screen
    this.currentRoom.screenItems.forEach((item) => {
      let itemDiv = room.createHTML(item);
      console.log(itemDiv);
      itemDiv.addEventListener("click", () => {
        console.log("clicked!!!");
      });
      roomElement.appendChild(itemDiv);
    });
    // roomElement.style.background = `url(images/${room.background}) no-repeat contain center`; // alternatively you could also just create a class for every room. might be easier actually.
    // roomElement.style.backgroundSize = "contain";
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
    screenItemDiv.style.top = screenItemData.top;
    screenItemDiv.style.left = screenItemData.left;
    screenItemDiv.style.width = screenItemData.width;
    screenItemDiv.style.height = screenItemData.height;
    console.log(screenItemData.img);
    screenItemDiv.style.background = `url(images/${screenItemData.img}) no-repeat center`;
    screenItemDiv.classList.add(screenItemData.class);
    screenItemDiv.style.backgroundSize = "contain";
    screenItemDiv.style.position = "absolute";
    return screenItemDiv;
  }; //end of createHTML

  //accepts a path which is just a pointer
  takePath(path) {
    console.log(`Current room: ${this.name}`);
    console.log(`You are taking ${path} path.`);

    //if this room has already been visited, then we have it in our visitedRooms object, and we'll just go there.
    if (game.visitedRooms[path]) {
      const goTo = game.visitedRooms[path]; //capturing in variable for ease.
      console.log(`Going back to ${goTo.name}`);
      game.renderRoom(goTo);
    } else {
      const [path] = new Room(gameLevels[path]);
    }
  }
} //-------------------------------end of room class

//-----start the game!!!!
const startGame = () => {
  //setup the game objects
  const game = new Game();

  game.begin();
};

startButton.addEventListener("click", startGame); //clicking on the start game button will start the game.

//-------------------------------------------OLD ROOM DATA------------------------------------
// const gameLevels = {
//     prisonCell: {
//       properties: {
//         name: "prisonCell",
//         title: "The Prison Cell",
//         background: "jailcell.png",
//         screenItems: [
//           {
//             name: "note",
//             img: "shine.gif",
//             top: "482px",
//             left: "211px",
//             width: "20px",
//             height: "20px",
//             class: "shine",
//           },
//         ],
//         //   keyItems: [{ name: "note", img: "foldednote.png" }], //found under the bed
//         paths: ["theTunnel"], //only one path, the toilet tunnel.
//         prerequisites: {},
//       },
//     },
//     theTunnel: {
//       properties: {
//         name: "theTunnel",
//         title: "The Tunnel",
//         keyItems: null,
//         screenItems: null,
//         background: "jailcell.png",
//         paths: ["secretCave", "prisonCell"],
//         prerequisites: ["note"],
//       },
//     },
//     secretCave: {
//       properties: {
//         name: "secretCave",
//         title: "The Secret Cave",
//         background: "background.jpg",
//         keyItems: null,
//         screenItems: null,
//         paths: null,
//         prerequisites: {},
//       },
//     },
//   };

//-------------------------------------------OLD ROOM DATA------------------------------------
