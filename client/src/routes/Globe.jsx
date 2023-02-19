import Globe from 'react-globe.gl';
import { Modal, Row, Button, Text, Col, NextUIProvider, createTheme} from "@nextui-org/react";
import React from 'react'
import * as ReactDOM from 'react-dom';
import axios from 'axios';
// follow the polygon layer example to add data
import * as d3 from "d3";

function World() {
    const { useState, useEffect, useMemo } = React;
    const [countries, setCountries] = useState({ features: []});
    const [hoverD, setHoverD] = useState();
    const [visible, setVisible] = React.useState(false);
    const [exportPartners, setExportPartners] = useState([]);
    const [importPartners, setImportPartners] = useState([]);
    const handler = (polygon) => {
      setVisible(true);
      axios.get(`http://127.0.0.1:8000/exportPartners/${polygon.properties.ISO_A3}`).then(response => {
        // handle the response data
        setExportPartners(response?.data);
        console.log(response?.data)
      })
      .catch(error => {
        // handle any errors
        console.error(error);
      });
      axios.get(`http://127.0.0.1:8000/importPartners/${polygon.properties.ISO_A3}`).then(response => {
        // handle the response data
        setImportPartners(response?.data);
      })
      .catch(error => {
        // handle any errors
        console.error(error);
      });
    };
    const closeHandler = () => {
      setVisible(false);
      console.log("closed");
    };

    useEffect(() => {
        // load data
        fetch('../datasets/ne_110m_admin_0_countries.geojson').then(res => res.json()).then(setCountries);
        console.log("Globe.jsx running")    
    }, []);
    
    const colorScale = d3.scaleSequentialSqrt(d3.interpolateYlOrRd);

    const theme = createTheme({
      type: "dark", // it could be "light" or "dark"
      theme: {
        colors: {
          // brand colors
          primaryLight: '$green200',
          primaryLightHover: '$green300',
          primaryLightActive: '$green400',
          primaryLightContrast: '$green600',
          primary: '#4ADE7B',
          primaryBorder: '$green500',
          primaryBorderHover: '$green600',
          primarySolidHover: '$green700',
          primarySolidContrast: '$white',
          primaryShadow: '$green500',
    
          gradient: 'linear-gradient(112deg, $blue100 -25%, $pink500 -10%, $purple500 80%)',
          link: '#5E1DAD',
    
          // you can also create your own color
          myColor: '#ff4ecd'
    
          // ...  more colors
        },
        space: {},
        fonts: {}
      }
    })

    // GDP per capita (avoiding countries with small pop)
    const getVal = feat => feat.properties.GDP_MD_EST / Math.max(1e5, feat.properties.POP_EST);

    const maxVal = useMemo(
      () => Math.max(...countries.features.map(getVal)),
      [countries]
    );
    colorScale.domain([0, maxVal]);
    return (
    <NextUIProvider theme={theme}>
    <Globe
      globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
      bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
      backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
      lineHoverPrecision={0}
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
        <b>${d.ADMIN} (${d.ISO_A2}):</b> <br />
        GDP: <i>${d.GDP_MD_EST}</i> M$<br/>
        Population: <i>${d.POP_EST}</i>
      `}
      onPolygonHover={setHoverD}
      onPolygonClick={handler}
      polygonsTransitionDuration={300}
    />
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
            <Text size={18} b>Top Suppliers</Text>
            <Text size={16}>{importPartners[0]?.country}</Text>
            <Text size={16}>{importPartners[1]?.country}</Text>
            <Text size={16}>{importPartners[2]?.country}</Text>
          </Col>
          <Col span={12} align="right">
            <Text size={18} b>Top Supplied</Text>
            <Text size={16}>{exportPartners[0]?.country}</Text>
            <Text size={16}>{exportPartners[1]?.country}</Text>
            <Text size={16}>{exportPartners[2]?.country}</Text>
          </Col>
          </Row>
        </Modal.Body>
      </Modal>
    </NextUIProvider>
  );
}

export default World;
