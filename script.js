const recordRoundModal = document.getElementById('recordRoundModal');
const scoreTableBody = document.getElementById("scoreTableBody");
const addPlayerButton = document.getElementById("addPlayerButton");
const newGameButton = document.getElementById("newGameButton");
const recordRoundButton = document.getElementById("recordRoundButton");
const removeAllPlayersButton = document.getElementById("removeAllPlayersButton");

const GAME_LOCAL_STORAGE_KEY = "currentGame";

class Game {
  constructor(players = []) {
    this.players = players;
  }

  addPlayer(name) {
    this.players.push(new Player(self.crypto.randomUUID(), name));
  }
}

class Player {
  constructor(id, name) {
    this.id = id;
    this.name = name;
    this.phase = 1,
      this.score = 0
  }
}

function storeGame(game) {
  localStorage.setItem(GAME_LOCAL_STORAGE_KEY, JSON.stringify(game));
}

function addPlayerToGame(name) {
  let game = getCurrentGame();
  game.addPlayer(name);
  storeGame(game);
}

function createPlayerScoreTableRow(player) {
  const row = document.createElement("tr");
  row.id = `score-table-row-${player.id}`;

  const nameCell = document.createElement("td");
  const phaseCell = document.createElement("td");
  const scoreCell = document.createElement("td");

  const nameSpan = document.createElement("span");
  nameSpan.textContent = player.name;

  nameCell.appendChild(nameSpan);

  const phaseSpan = document.createElement("span");
  phaseSpan.textContent = player.phase;

  phaseCell.appendChild(phaseSpan);

  const scoreSpan = document.createElement("span");
  scoreSpan.textContent = player.score;

  scoreCell.appendChild(scoreSpan);

  row.appendChild(nameCell);
  row.appendChild(phaseCell);
  row.appendChild(scoreCell);

  scoreTableBody.appendChild(row);
}

function createPlayerRecordRoundTableRow(player) {
  let playerRow = document.createElement("tr");
  playerRow.id = `record-round-table-row-${player.id}`;

  let playerHeader = document.createElement("th");
  playerHeader.scope = "row";
  playerHeader.textContent = player.name;

  let phaseCompleteCell = document.createElement("td");

  let phaseInput = document.createElement("input");
  phaseInput.className = "form-check-input";
  phaseInput.type = "checkbox";
  phaseInput.checked = false;
  phaseInput.id = `${player.id}-check-completed-phase`;

  phaseCompleteCell.appendChild(phaseInput);

  let scoreCell = document.createElement("td");

  let scoreInput = document.createElement("input");
  scoreInput.type = "number";
  scoreInput.className = "form-number-input";
  scoreInput.value = 0;
  scoreInput.min = 0;
  scoreInput.max = 999;
  scoreInput.pattern = "[0-9]*";
  scoreInput.inputMode = "numeric";
  scoreInput.id = `${player.id}-score`;

  scoreCell.appendChild(scoreInput);

  playerRow.appendChild(playerHeader);
  playerRow.appendChild(phaseCompleteCell);
  playerRow.appendChild(scoreCell);

  return playerRow;
}

function resetPhaseAndScoreForPlayers() {
  const game = getCurrentGame();

  game.players.forEach((player) => {
    player.score = 0;
    player.phase = 1;
  });

  storeGame(game);
}

function getCurrentGame() {
  let storageGame = localStorage.getItem(GAME_LOCAL_STORAGE_KEY);
  if (storageGame) {
    storageGame = Object.assign(new Game, JSON.parse(storageGame));
  } else {
    storageGame = new Game();
  }

  return storageGame;
}

function renderScoreTableBody() {
  scoreTableBody.replaceChildren();

  const game = getCurrentGame();

  game.players.forEach((player) => {
    createPlayerScoreTableRow(player);
  })
}

function recordRound() {
  const game = getCurrentGame();

  game.players.forEach((player) => {
    const phaseCompleted = document.getElementById(`${player.id}-check-completed-phase`).checked;
    const roundScore = parseInt(document.getElementById(`${player.id}-score`).value);

    player.score += roundScore;
    if (phaseCompleted && player.phase < 10) {
      player.phase += 1;
    }
  });

  storeGame(game);
  renderScoreTableBody();
}

addPlayerButton.addEventListener("click", () => {
  const name = prompt("Enter name:");
  if (name) {
    addPlayerToGame(name);
  }

  renderScoreTableBody();
});

newGameButton.addEventListener("click", () => {
  resetPhaseAndScoreForPlayers();
  renderScoreTableBody();
});

removeAllPlayersButton.addEventListener("click", () => {
  storeGame(new Game());
  renderScoreTableBody();
});

recordRoundButton.addEventListener("click", () => {
  recordRound();
});

recordRoundModal.addEventListener('hidden.bs.modal', () => {
  const recordRoundTableBody = recordRoundModal.querySelector('#recordRoundTableBody')
  recordRoundTableBody.replaceChildren();
});

recordRoundModal.addEventListener('show.bs.modal', () => {
  const recordRoundTableBody = recordRoundModal.querySelector('#recordRoundTableBody')
  const game = getCurrentGame();

  game.players.forEach((player) => {
    recordRoundTableBody.appendChild(createPlayerRecordRoundTableRow(player));
  });
});

window.addEventListener("beforeunload", storeGame(getCurrentGame()));

renderScoreTableBody();
