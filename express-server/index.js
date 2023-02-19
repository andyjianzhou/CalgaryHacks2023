import express from ('express');
const app = express();
const port = 8000;
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  // model_path = 'C://Users//YOLO4\OneDrive\Desktop\CMPUT175\CalgaryHacks2023\server\CropWatch\CropWatch\LivePreds\modelDecisionTreeTest.pkl';
  // model = joblib.load(model_path);
  // The input of a Decision Tree Regressor to predict the crop yield is a list of 5 values, in the following order:
  // 1. Temperature
  // 2. Humidity
  // 3. Soil Moisture
  // 4. Soil pH
  // 5. Rainfall

  // forecast the crop yield for the following values:
  // console.log(model.feature_names);
  // predictions = model.predict([request]);

  const preds = fs.readFileSync(path.join(__dirname, 'CropWatch', 'CropWatch', 'LivePreds', 'preds.json'));
  const json_preds = JSON.parse(preds);
  // create API response and send it to the frontend
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.send(JSON.stringify(json_preds));
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

