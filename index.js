import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const port = 3000;
const API_URL = "https://real-time-amazon-data.p.rapidapi.com/search";

app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("index.ejs", { product:""}, { error: "" });
});

app.post("/submit", async (req, res) => {
  console.log(req.body);
  const categoriesReq = req.body.search;
  const options = {
    method: 'GET',
    url: API_URL,
    params: {
      query: categoriesReq,
      page: '1',
      country: 'US',
      sort_by: 'RELEVANCE',
      product_condition: 'ALL'
    },
    headers: {
      'x-rapidapi-key': process.env.RAPIDAPI_KEY,
      'x-rapidapi-host': 'real-time-amazon-data.p.rapidapi.com'
    }
  };
  try {
    const result = await axios.request(options);
    const products =result.data.data.products;
    res.render("index.ejs",{product:products  });
  } catch (error) {
    console.error("Failed to make request:", error.message);
    res.render("index.ejs", {
      error: "No products found.",
    });
  }
});
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
