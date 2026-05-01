import express from "express";

const app = express();
const PORT = process.env.PORT || 5000;

// serve frontend
app.use(express.static("public"));

// API for calculation
app.get("/api/calc", (req, res) => {
  const { a, b, op } = req.query;

  const num1 = parseFloat(a);
  const num2 = parseFloat(b);

  let result;

  switch (op) {
    case "add":
      result = num1 + num2;
      break;
    case "sub":
      result = num1 - num2;
      break;
    case "mul":
      result = num1 * num2;
      break;
    case "div":
      result = num2 !== 0 ? num1 / num2 : "Cannot divide by 0";
      break;
    default:
      return res.json({ error: "Invalid operation" });
  }

  res.json({ result });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});