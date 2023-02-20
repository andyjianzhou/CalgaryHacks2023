import Globe from "react-globe.gl";
import {
  Modal,
  Row,
  Button,
  Text,
  Col,
  NextUIProvider,
  createTheme,
} from "@nextui-org/react";
import React from "react";
import * as ReactDOM from "react-dom";
import axios from "axios";
// follow the polygon layer example to add data
import * as d3 from "d3";
import { useRef, useEffect } from "react";
import Fade from "../components/fade";

function World() {
  const { useState, useEffect, useMemo } = React;
  const [countries, setCountries] = useState({ features: [] });
  const [hoverD, setHoverD] = useState();
  const [visible, setVisible] = React.useState(false);
  const [exportPartners, setExportPartners] = useState([]);
  const [importPartners, setImportPartners] = useState([]);
  const [predYield, setYield] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [clickD, setClickD] = useState();
  const [col1, setCol1] = useState([]);
  const [col2, setCol2] = useState([]);

  const globeRef = useRef(null);
  useEffect(() => {
    const globe = globeRef.current;

    globe.controls().autoRotate = true;
    globe.controls().autoRotateSpeed = 0.1;
  }, [globeRef]);

  // create a dictionary of country name and yield_predicted
  const dict = {};
  const dictTest = {};

  const handler = (polygon) => {
    setClickD(polygon);
    console.log("CLICKED: ", polygon);
    const wheat = [polygon.properties.Wheat, "Wheat"];
    const rice = [polygon.properties.Rice, "Rice"];
    const soybean = [polygon.properties.Soybean, "Soybean"];
    const potatoes = [polygon.properties.Potatoes, "Potatoes"];
    const sweetPotatoes = [polygon.properties.Sweet, "Sweet Potatoes"];
    const maize = [polygon.properties.Maize, "Maize"];
    const cassava = [polygon.properties.Cassava, "Cassava"];
    const other = [polygon.properties.Other, "Other"];
    const yams = [polygon.properties.Yams, "Yams"];
    const sorghum = [polygon.properties.Sorghum, "Sorghum"];
    console.log("RICE: ", rice);
    //filter
    const visibleProperties = [
      wheat,
      rice,
      soybean,
      potatoes,
      sweetPotatoes,
      maize,
      cassava,
      other,
      yams,
      sorghum,
    ].filter((item) => {
      console.log("DEBUG: ", item[0]);
      console.log("DEBUG: ", item[0] !== undefined);
      return item[0] !== undefined;
    });

    const midIndex = Math.ceil(visibleProperties.length / 2);
    setCol1(visibleProperties.slice(0, midIndex));
    console.log("Properties: ", visibleProperties.slice(0, midIndex));
    console.log("Properties: ", visibleProperties.slice(midIndex))
    setCol2(visibleProperties.slice(midIndex));
    setVisible(true);

    console.log("DICTTEST", dictTest)

    axios
      .get(`http://127.0.0.1:8000/exportPartners/${polygon.properties.ISO_A3}`)
      .then((response) => {
        // handle the response data
        setExportPartners(response?.data);
        console.log(response?.data);
      })
      .catch((error) => {
        // handle any errors
        console.error(error);
      });
    axios
      .get(`http://127.0.0.1:8000/importPartners/${polygon.properties.ISO_A3}`)
      .then((response) => {
        // handle the response data
        setImportPartners(response?.data);
        setIsLoading(false);
      })
      .catch((error) => {
        // handle any errors
        console.error(error);
      });
  };
  const closeHandler = () => {
    setIsLoading(true);
    setVisible(false);
    console.log("closed");
  };

  useEffect(() => {
    // load data
    // fetch('../datasets/ne_110m_admin_0_countries.geojson').then(res => res.json()).then(setCountries);
    // console.log("Globe.jsx running")
    // //fetch the data from the backend
    // fetch('http://127.0.0.1:8000/').then(res => res.json()).then(setYield);
    Promise.all([
      fetch("../datasets/ne_110m_admin_0_countries.geojson").then((res) =>
        res.json()
      ),
      fetch("http://127.0.0.1:8000/").then((res) => res.json()),
    ]).then(([countries, yieldScores]) => {
      setCountries(countries);
      setYield(yieldScores);
    });
  }, []);

  const colorScale = d3.scaleSequentialSqrt(d3.interpolateRdYlGn);

  const theme = createTheme({
    type: "dark", // it could be "light" or "dark"
    theme: {
      colors: {
        // brand colors
        primaryLight: "$green200",
        primaryLightHover: "$green300",
        primaryLightActive: "$green400",
        primaryLightContrast: "$green600",
        primary: "#4ADE7B",
        primaryBorder: "$green500",
        primaryBorderHover: "$green600",
        primarySolidHover: "$green700",
        primarySolidContrast: "$white",
        primaryShadow: "$green500",

        gradient:
          "linear-gradient(112deg, $blue100 -25%, $pink500 -10%, $purple500 80%)",
        link: "#5E1DAD",

        // you can also create your own color
        myColor: "#ff4ecd",

        // ...  more colors
      },
      space: {},
      fonts: {},
    },
  });

  // feat is the country, map, then find it's column data yield_predicted
  // const getVal = feat => feat.properties.yield_predicted;
  // console.log(predYield)
  // create for loop
  // console.log("Pred Yields: " + predYield)

  let labels = [
    "Rice",
    "Wheat",
    "Sorghum",
    "Potatoes",
    "Sweet",
    "Maize",
    "Soybeans",
    "Cassava",
    "Others",
    "Yams",
  ];
  // avgYieldPerItemCountry = {};
  useEffect(() => {
    // make random range of numbers between 10000 - 50000

    for (let i = 0; i < predYield.length; i++) {
      if (predYield[i].yield_predicted != null) {
        dict[predYield[i].Country] = [
          parseFloat(predYield[i].yield_predicted / 10000).toFixed(2),
          parseFloat(predYield[i].average_rain_fall_mm_per_year).toFixed(2),
          predYield[i].pesticides_tonnes,
          parseFloat(predYield[i].avg_temp).toFixed(2),
          parseFloat(predYield[i].yield_actual / 10000),
        ];
        if (predYield[i].Item == "Rice, paddy") {
          predYield[i].Item = predYield[i].Item.split(",")[0];
        }
        if (predYield[i].Item == "Plantains and others") {
          predYield[i].Item = "Others";
        }

        if (predYield[i].Item == "Sweet potatoes") {
          // find index of 'Rice, paddy' in labels
          predYield[i].Item = predYield[i].Item.split(" ")[0];
        }

        dictTest[predYield[i].Country] = {
          ...dictTest[predYield[i].Country],
          [predYield[i].Item]: [parseFloat(predYield[i].average_yield_predicted/10000).toFixed(2)],
        };
      }
    }
    console.log("Dictionary Items: ", dictTest);
    console.log("LABELS: ", labels)
    // if the country name is in the dictionary, add the yield_predicted to the country feature
    for (let i = 0; i < countries.features.length; i++) {
      const random = Math.floor(Math.random() * 50000) + 10000;
      const randomRain = Math.random() * (1 - 0.5) + 0.5;
      const randomPesticides = Math.random() * (0.1 - 0) + 0;
      const randomTemp = Math.random() * (0.2 - 0) + 0;

      if (countries.features[i].properties.ADMIN in dict) {
        countries.features[i].properties.yield_predicted =
          dict[countries.features[i].properties.ADMIN][0];
        countries.features[i].properties.rainfall =
          dict[countries.features[i].properties.ADMIN][1];
        countries.features[i].properties.pesticides =
          dict[countries.features[i].properties.ADMIN][2];
        countries.features[i].properties.temperature =
          dict[countries.features[i].properties.ADMIN][3];
        countries.features[i].properties.yield_actual =
          dict[countries.features[i].properties.ADMIN][4];

        for (let j = 0; j < labels.length; j++) {
          countries.features[i].properties[labels[j]] =
            dictTest[countries.features[i].properties.ADMIN][labels[j]];
        }
      } else {
        countries.features[i].properties.yield_predicted = parseFloat(
          random / 10000
        ).toFixed(2);
        countries.features[i].properties.rainfall =
          parseFloat(randomRain).toFixed(2);
        countries.features[i].properties.pesticides =
          parseFloat(randomPesticides).toFixed(2);
        countries.features[i].properties.temperature =
          parseFloat(randomTemp).toFixed(2);
        countries.features[i].properties.yield_actual = parseFloat(
          random / 10000
        ).toFixed(2);
      }
    }
  }, [predYield]);
  const getVal = (feat) => feat.properties.yield_predicted;

  // loop over countries to find Canada
  for (let i = 0; i < countries.features.length; i++) {
    if (countries.features[i].properties.ADMIN == "Canada") {
      console.log(countries.features[i].properties);
    }
  }
  const maxVal = useMemo(
    () => Math.max(...countries.features.map(getVal)),
    [countries, getVal]
  );
  colorScale.domain([0, maxVal]);
  return (
    <>
      <div className="globe">
        <NextUIProvider theme={theme}>
          <Globe
            globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
            bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
            backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
            lineHoverPrecision={0}
            ref={globeRef}
            polygonsData={countries.features.filter(
              (d) => d.properties.ISO_A2 !== "AQ"
            )}
            polygonAltitude={(d) => (d === hoverD ? 0.12 : 0.06)}
            polygonCapColor={(d) =>
              d === hoverD ? "steelblue" : colorScale(getVal(d))
            }
            polygonSideColor={() => "rgba(0, 100, 0, 0.15)"}
            polygonStrokeColor={() => "#111"}
            polygonLabel={({ properties: d }) => `
          <div style="background: rgba(0, 0, 0, 0.5); color: #fff; padding: 0.5em; border-radius: 10px;"> 
            <b>${d.ADMIN} (${d.ISO_A2}):</b> <br />
            Future Crop Yield: <i>${d.yield_predicted}</i> t/ha 1 Yr Forecast<br/>
            Current Crop Yield: <i>${d.yield_actual}</i> t/ha<br/>
          </div>
        `}
            onPolygonHover={setHoverD}
            onPolygonClick={() => handler(hoverD)}
            polygonsTransitionDuration={300}
          />
          <Fade animationDuration={3000} className="cover" show={true} />
          <Modal
            closeButton
            blur
            aria-labelledby="modal-title"
            open={visible}
            //width="500px"
            onClose={closeHandler}
          >
            <Modal.Header>
              <Text id="modal-title" b size={30}>
                Stats
              </Text>
            </Modal.Header>
            <Modal.Body>
              <Row>
                <Col span={12}>
                  <Text size={18} b>
                    Top Suppliers
                  </Text>
                  {isLoading ? (
                    <div className="h-[12px] mt-3 animate-pulse w-3/4 rounded-full bg-slate-700"></div>
                  ) : (
                    <Text size={16}>{importPartners[0]?.country}</Text>
                  )}
                  {isLoading ? (
                    <div className="h-[12px] mt-3 animate-pulse w-3/4 rounded-full bg-slate-700"></div>
                  ) : (
                    <Text size={16}>{importPartners[1]?.country}</Text>
                  )}
                  {isLoading ? (
                    <div className="h-[12px] mt-3 animate-pulse w-3/4 rounded-full bg-slate-700"></div>
                  ) : (
                    <Text size={16}>{importPartners[2]?.country}</Text>
                  )}
                  <br />
                  {col1.map((value, index) => (
                    <>
                    <br/>
                    <Text size={18} b>
                    {value[1]}
                  </Text>
                    <Text key={index}>
                      {value[0]} (t/ha)
                    </Text>
                    </>
                  ))}
                </Col>
                <Col span={12} align="right">
                  <Text size={18} b>
                    Top Supplied
                  </Text>
                  {isLoading ? (
                    <div className="h-[12px] mt-3 animate-pulse w-3/4 rounded-full bg-slate-700"></div>
                  ) : (
                    <Text size={16}>{exportPartners[0]?.country}</Text>
                  )}
                  {isLoading ? (
                    <div className="h-[12px] mt-3 animate-pulse w-3/4 rounded-full bg-slate-700"></div>
                  ) : (
                    <Text size={16}>{exportPartners[1]?.country}</Text>
                  )}
                  {isLoading ? (
                    <div className="h-[12px] mt-3 animate-pulse w-3/4 rounded-full bg-slate-700"></div>
                  ) : (
                    <Text size={16}>{exportPartners[2]?.country}</Text>
                  )}
                  <br />
                  {col2.map((value, index) => (
                    <>
                    <br/>
                    <Text size={18} b>
                    {value[1]}
                  </Text>
                    <Text key={index}>
                      {value[0]} (t/ha)
                    </Text>
                    </>
                  ))}
                </Col>
              </Row>
              {/* <Row>
               
                {isLoading ? (
                  <div className="h-[12px] mt-3 animate-pulse w-3/4 rounded-full bg-slate-700"></div>
                ) : (
                  <>
                    {/* {clickD?.properties?.Wheat && <Text size={16}>{clickD?.properties?.Wheat[0]}</Text>}
                    {clickD?.properties?.Rice && <Text size={16}>Rice: {clickD?.properties?.Rice[0]}</Text>}
                    {clickD?.properties?.Maize && <Text size={16}>Maize: {clickD?.properties?.Maize[0]}</Text>}
                    {clickD?.properties?.Soybeans && <Text size={16}>Soybeans: {clickD?.properties?.Soybeans[0]}</Text>}
                    {clickD?.properties?.Potatoes && <Text size={16}>Potatoes: {clickD?.properties?.Potatoes[0]}</Text>}
                    {clickD?.properties?.Cassava && <Text size={16}>Cassava: {clickD?.properties?.Cassava[0]}</Text>}
                    {clickD?.properties?.Sweet && <Text size={16}>Sweet Potatoes: {clickD?.properties?.Sweet[0]}</Text>}
                    {clickD?.properties?.Others && <Text size={16}>Others: {clickD?.properties?.Others[0]}</Text>} */}

              {/* </>
                )}
                <Text size={18} b>
                  Avg Temperature (C)
                </Text>
                {isLoading ? (
                  <div className="h-[12px] mt-3 animate-pulse w-3/4 rounded-full bg-slate-700"></div>
                ) : (
                  <Text size={16}>{hoverD?.properties.temperature}</Text>
                )}
                <Text size={18} b>
                  Avg Pesticides (tonnes)
                </Text>
                {isLoading ? (
                  <div className="h-[12px] mt-3 animate-pulse w-3/4 rounded-full bg-slate-700"></div>
                ) : (
                  <Text size={16}>{hoverD?.properties.pesticides}</Text>
                )} */}
              {/* </Col> */}
              {/* /    </Row> */}
            </Modal.Body>
          </Modal>
        </NextUIProvider>
      </div>
    </>
  );
}

export default World;
