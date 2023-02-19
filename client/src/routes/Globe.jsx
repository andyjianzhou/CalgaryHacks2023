import Globe from 'react-globe.gl';
import { Modal, Row, Button, Text, Checkbox, Input } from "@nextui-org/react";
import React from 'react'
import * as ReactDOM from 'react-dom';
// follow the polygon layer example to add data
import * as d3 from 'd3';

function World() {

    const { useState, useEffect, useMemo } = React;
    const [countries, setCountries] = useState({ features: []});
    const [hoverD, setHoverD] = useState();
    const [visible, setVisible] = React.useState(false);
    const handler = () => setVisible(true);
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

    // GDP per capita (avoiding countries with small pop)
    const getVal = feat => feat.properties.GDP_MD_EST / Math.max(1e5, feat.properties.POP_EST);

    const maxVal = useMemo(
      () => Math.max(...countries.features.map(getVal)),
      [countries]
    );
    colorScale.domain([0, maxVal]);
    return (
    <div>
    <Globe
      globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
      bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
      backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
      lineHoverPrecision={0}
      polygonsData={countries.features.filter(d => d.properties.ISO_A2 !== 'AQ')}
      polygonAltitude={d => d === hoverD ? 0.12 : 0.06}
      polygonCapColor={d => d === hoverD ? 'steelblue' : colorScale(getVal(d))}
      polygonSideColor={() => 'rgba(0, 100, 0, 0.15)'}
      polygonStrokeColor={() => '#111'}
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
        onClose={closeHandler}
      >
        <Modal.Header>
          <Text id="modal-title" size={18}>
            Welcome to
            <Text b size={18}>
              NextUI
            </Text>
          </Text>
        </Modal.Header>
        <Modal.Body>
          <Row justify="space-between">
            <Text size={14}>Forgot password?</Text>
          </Row>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default World