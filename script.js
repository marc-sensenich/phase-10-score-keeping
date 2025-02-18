const tableBody = document.getElementById("tableBody");
const addRowButton = document.getElementById("addRow");
const newGameButton = document.getElementById("newGame");
const clearButton = document.getElementById("clear");
const tableName = "myTable"; // Unique identifier for the table

function generateUniqueRowId() {
  return Math.random().toString(36).substr(2, 9); // Generates a random 9-character string
}

// Function to create a new row and add it to the table
function createRow(name, phase = 1, score = 0) {
  const row = document.createElement("tr");
  row.id = generateUniqueRowId(); // Assign a unique ID to the row

  const nameCell = document.createElement("td");
  const phaseCell = document.createElement("td");
  const scoreCell = document.createElement("td");
  const removeCell = document.createElement("td");

  nameCell.setAttribute("data-name", name);
  nameCell.textContent = name;
  nameCell.className = "is-size-5";

  const phaseInput = document.createElement("input");
  phaseInput.type = "number";
  phaseInput.value = phase; // Initial phase
  phaseInput.min = 1;
  phaseInput.max = 10;
  phaseInput.pattern = "[0-9]*";
  phaseInput.inputMode = "numeric";
  phaseInput.className = "input";
  phaseInput.addEventListener("change", () => {
    storeTableData();
  });
  phaseCell.appendChild(phaseInput);

  const scoreInput = document.createElement("input");
  scoreInput.type = "number";
  scoreInput.value = score; // Initial score
  scoreInput.min = 0;
  scoreInput.max = 9999;
  scoreInput.pattern = "[0-9]*";
  scoreInput.inputMode = "numeric";
  scoreInput.className = "input";


  scoreInput.addEventListener("change", () => {
    storeTableData();
  });
  scoreCell.appendChild(scoreInput);

  row.appendChild(nameCell);
  row.appendChild(phaseCell);
  row.appendChild(scoreCell);
  row.appendChild(removeCell);

  tableBody.appendChild(row);

  // Store initial data in storage
  storeTableData();
}

// Function to update storage for a given row and key
function updatelocalStorage(row, key, value) {
  const rowId = row.id;
  localStorage.setItem(`${rowId}-${key}`, value);
}

function resetPhaseAndScore() {
  localStorage.removeItem(tableName);
  const rowsData = [];
  const rows = tableBody.getElementsByTagName("tr");

  for (const row of rows) {
    const name = row.querySelector("[data-name]").textContent;
    const inputs = row.getElementsByTagName("input");
    
    const phase = 1;
    const score = 0;
    
    const rowData = {
      name: name,
      phase: phase,
      score: score,
    };
    rowsData.push(rowData);
  }

  localStorage.setItem(tableName, JSON.stringify(rowsData));
}

// Add a row when the button is clicked
addRowButton.addEventListener("click", () => {
  const name = prompt("Enter name:");
  if (name) {
    createRow(name);
  }
});

newGameButton.addEventListener("click", () => {
  resetPhaseAndScore();
  tableBody.replaceChildren();
  restoreTableData();
});

clearButton.addEventListener("click", () => {
  tableBody.replaceChildren();
  storeTableData();
});

function storeTableData() {
  const rowsData = [];
  const rows = tableBody.getElementsByTagName("tr");

  for (const row of rows) {
    const name = row.querySelector("[data-name]").textContent;
    const inputs = row.getElementsByTagName("input");
    
    const phase = inputs[0].value;
    const score = inputs[1].value;
    
    const rowData = {
      name: name,
      phase: phase,
      score: score,
    };
    rowsData.push(rowData);
  }

  localStorage.setItem(tableName, JSON.stringify(rowsData));
}

// Function to retrieve and restore table data from the JSON blob
function restoreTableData() {
  const storedData = localStorage.getItem(tableName);
  if (storedData) {
    const rowsData = JSON.parse(storedData);
    rowsData.forEach((rowData) => {
      createRow(rowData.name, rowData.phase, rowData.score);
    });
  }
}

window.addEventListener("beforeunload", storeTableData);
tableBody.addEventListener("input", storeTableData);

restoreTableData();
