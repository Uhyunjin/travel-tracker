import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// db연결하기
const db = new pg.Client({
  user:"postgres",
  host:"localhost",
  database:"world",
  password:"1234",
  port: 5433,
});
db.connect();

app.get("/", async (req, res) => {
  const result = await db.query("SELECT country_code FROM visited_country");
  //DB와 연결, table name 꼭 확인
  // [&country-code:"FR"]
  let countries = [];
  result.rows.forEach((c) => countries.push(c.country_code));
  //countries = ["FR", "GB", ...]
  console.log(result.rows);
  res.render("index.ejs", { countries: countries, total: countries.length});
  db.end();
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
