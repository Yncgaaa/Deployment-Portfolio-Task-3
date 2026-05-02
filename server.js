let display = document.getElementById("display");
let historyList = document.getElementById("history");

function append(value) {
  if (display.value === "0") {
    display.value = value;
  } else {
    display.value += value;
  }
}

function clearDisplay() {
  display.value = "";
}

async function calculate() {
  try {
    let expression = display.value;

    // prevent empty input
    if (!expression) return;

    let result = eval(expression);

    display.value = result;

    // SAVE to database
    await fetch("/api/save", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        expression: expression,
        result: result
      })
    });

    // reload history
    loadHistory();

  } catch (err) {
    display.value = "Error";
  }
}

async function loadHistory() {
  try {
    const res = await fetch("/api/history");
    const data = await res.json();

    if (!historyList) return;

    if (data.length === 0) {
      historyList.innerHTML = "<li>No history yet</li>";
      return;
    }

    historyList.innerHTML = data.map(item =>
      `<li onclick="reuse('${item.result}')">
        ${item.expression} = <b>${item.result}</b>
      </li>`
    ).join("");

  } catch (err) {
    console.error("History load error:", err);
  }
}

function reuse(value) {
  display.value = value;
}

window.onload = () => {
  display.value = "0";
  loadHistory();
};