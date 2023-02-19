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

app.get('/exportPartners/:countryCode', async (req, res) => {
    const countryCode = req.params.countryCode;
    try {
      const response = await axios.get(`http://wits.worldbank.org/API/V1/SDMX/V21/datasource/tradestats-trade/reporter/${countryCode}/year/2018/partner/all/product/food/indicator/XPRT-TRD-VL`);
      parseString(response.data, async (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).send('An error occurred');
        } else {
          let resultingData = [];
          result['message:StructureSpecificData']['message:DataSet'][0].Series.forEach(element => {
            if (!regionCodes.includes(element.$.PARTNER)) {
              resultingData.push({ country: element.$.PARTNER, value: element['Obs'][0]['$']['OBS_VALUE'] });
            }
          });
          resultingData.sort((a, b) => b.value - a.value);
          resultingData = resultingData.slice(0, 3);
          for (const element of resultingData) {
            const response = await axios.get(`http://wits.worldbank.org/API/V1/wits/datasource/tradestats-trade/country/${element.country}`);
            parseString(response.data, (err, result) => {
              element.country = result['wits:datasource']['wits:countries'][0]['wits:country'][0]['wits:name'][0];
            });
          };
          res.send(resultingData);
        }
      });
    } catch (error) {
      console.error(error);
      res.status(500).send('An error occurred');
    }
  });

  app.get('/importPartners/:countryCode', async (req, res) => {
    const countryCode = req.params.countryCode;
    try {
      const response = await axios.get(`http://wits.worldbank.org/API/V1/SDMX/V21/datasource/tradestats-trade/reporter/${countryCode}/year/2018/partner/all/product/food/indicator/MPRT-TRD-VL`);
      parseString(response.data, async (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).send('An error occurred');
        } else {
          let resultingData = [];
          result['message:StructureSpecificData']['message:DataSet'][0].Series.forEach(element => {
            if (!regionCodes.includes(element.$.PARTNER)) {
              resultingData.push({ country: element.$.PARTNER, value: element['Obs'][0]['$']['OBS_VALUE'] });
            }
          });
          resultingData.sort((a, b) => b.value - a.value);
          resultingData = resultingData.slice(0, 3);
          for (const element of resultingData) {
            const response = await axios.get(`http://wits.worldbank.org/API/V1/wits/datasource/tradestats-trade/country/${element.country}`);
            parseString(response.data, (err, result) => {
              element.country = result['wits:datasource']['wits:countries'][0]['wits:country'][0]['wits:name'][0];
            });
          };
          res.send(resultingData);
        }
      });
    } catch (error) {
      console.error(error);
      res.status(500).send('An error occurred');
    }
  });
  