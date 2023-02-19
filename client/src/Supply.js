import axios from 'axios';
import { parseString } from 'xml2js';
const regionCodes = ["WLD", "NAC", "ECS", "EAS", "LCN", "SSF", "SAS", "MEA"]
const Supply = {
  getExportPartners: async (countryCode) => {
    try {
      axios.get(`http://wits.worldbank.org/API/V1/SDMX/V21/datasource/tradestats-trade/reporter/${countryCode}/year/2018/partner/all/product/food/indicator/XPRT-TRD-VL`).then(response => {
        parseString(response.data, async (err, result) => {
            if (err) {
              console.error(err);
            } else {
              let resultingData = [];
              result['message:StructureSpecificData']['message:DataSet'][0].Series.forEach(element => {
                if(!regionCodes.includes(element.$.PARTNER)) {
                    resultingData.push({country: element.$.PARTNER, value: element['Obs'][0]['$']['OBS_VALUE']});
                }
              });
              resultingData.sort((a, b) => b.value - a.value)
              resultingData = resultingData.slice(0,3);
              for (const element of resultingData) {
                let response = await axios.get(`http://wits.worldbank.org/API/V1/wits/datasource/tradestats-trade/country/${element.country}`)
                parseString(response.data, (err, result) => {
                    element.country = result['wits:datasource']['wits:countries'][0]['wits:country'][0]['wits:name'][0]
                });
              };
              console.log(resultingData)
              return resultingData;
            }
          });
      });
    } catch (error) {
      console.error(error);
    }
  },
  getImportPartners: async (countryCode) => {
    try {
        axios.get(`http://wits.worldbank.org/API/V1/SDMX/V21/datasource/tradestats-trade/reporter/${countryCode}/year/2018/partner/all/product/food/indicator/MPRT-TRD-VL`).then(response => {
          parseString(response.data, async (err, result) => {
              if (err) {
                console.error(err);
              } else {
                let resultingData = [];
                result['message:StructureSpecificData']['message:DataSet'][0].Series.forEach(element => {
                  if(!regionCodes.includes(element.$.PARTNER)) {
                      resultingData.push({country: element.$.PARTNER, value: element['Obs'][0]['$']['OBS_VALUE']});
                  }
                });
                resultingData.sort((a, b) => b.value - a.value)
                resultingData = resultingData.slice(0,3);
                for (const element of resultingData) {
                  let response = await axios.get(`http://wits.worldbank.org/API/V1/wits/datasource/tradestats-trade/country/${element.country}`)
                  parseString(response.data, (err, result) => {
                      element.country = result['wits:datasource']['wits:countries'][0]['wits:country'][0]['wits:name'][0]
                  });
                };
                console.log(resultingData)
                return resultingData;
              }
            });
        });
      } catch (error) {
        console.error(error);
      }
  }
};

export default Supply;