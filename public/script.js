let display = document.getElementById("display");

// append value
function append(value) {
  display.value += value;
}

// clear
function clearDisplay() {
  display.value = "";
}

// calculate + save
async function calculate() {
  try {
    let expression = display.value;
    let result = eval(expression);

    display.value = result;

    // SAVE to DB
    await fetch("/api/save", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ expression, result })
    });

    loadHistory();

  } catch {
    display.value = "Error";
  }
}

// load history
async function loadHistory() {
  const res = await fetch("/api/history");
  const data = await res.json();

  let list = document.getElementById("history");

  list.innerHTML = data.map(item =>
    `<li>${item.expression} = ${item.result}</li>`
  ).join("");
}

// load when page open
loadHistory();