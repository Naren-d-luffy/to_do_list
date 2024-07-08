import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import env from "dotenv";

env.config();
const app = express();
const port = 3000;
const db = new pg.Client({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT,
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

db.connect();

let items = [];

app.get("/", async (req, res) => {
  const result = await db.query ("SELECT * FROM items")
  const items = result.rows;
  res.render("index.ejs", {
    listTitle: "To-Do List",
    listItems: items,
  });
});

app.post("/add", async (req, res) => {
  const item = req.body.newItem;
  await db.query("INSERT INTO items (title) VALUES ($1)",[item]);
  res.redirect("/");
});

app.post("/edit", async (req, res) => {
  const update = req.body.updatedItemTitle;
  const id = req.body.updatedItemId;
  await db.query("UPDATE items SET title = ($1) WHERE id = ($2)",[update,id]);
  res.redirect("/");
});

app.post("/delete", async (req, res) => {
  const id = req.body.deleteItemId;
  await db.query("DELETE FROM items WHERE id = ($1)",[id]);
  res.redirect("/");
});
  

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
