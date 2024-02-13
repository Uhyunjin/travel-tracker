import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;


// db연결하기
const db = new pg.Client({
  user:"postgres",
  host:"localhost",
  database:"world",
  password:"1234",
  port: 5433,
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

async function checkVisisted() {
  const result = await db.query("SELECT country_code FROM visited_country");
  //DB와 연결, table name 꼭 확인
  // [&country-code:"FR"]
  let countries = [];
  result.rows.forEach((c) => {countries.push(c.country_code)});
  //countries = ["FR", "GB", ...]
  console.log(`function : ${countries}`);

  return countries;
};

app.get("/", async (req, res) => {
  const countries = await checkVisisted();
  console.log(`get : ${countries}`);
  res.render("index.ejs", { countries: countries, total: countries.length});
  // db.end();
});

app.post("/add", async (req, res) => {
  const input = req.body["country"]
  const result = await db.query(
    "SELECT country_code FROM countries WHERE country_name = $1",
   [input]);
  // 입력된 나라의 코드 가져오기
  // let countries = [];
  // countries.push(inputName);
  // const result = await db.query(
  //   "SELECT country_code FROM countried WHERE country_name = $1",
  // [input]
  // );
  console.log(`post : ${input}`);
  // console.log(result);
  // console.log(input);
  if (result.rows.length !== 0) {
    const data = result.rows[0];
    const countryCode = data.country_code;

    await db.query(
      "INSERT INTO visited_country (country_code) VALUES ($1)",
      [countryCode]);
    res.redirect("/");
  } else{
    console.log("no such country")
    res.redirect("/");

  }

});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

// sql
