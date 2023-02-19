import Globe from 'react-globe.gl';

import React from 'react'
import * as ReactDOM from 'react-dom';


// const myData = {
//     polygonsData: [
//         polygonLabel: "name",
//         polygonCapColor: () => '#ffffaa',
//         polygonSideColor: () => '#fff',
//         polygonCapCurvatureResolution: () => 5,
//         polygonsTransitionDuration: () => 2000,
//     ]
// }


    ReactDOM.render(
        <Globe
            pointsData={myData}
        />,
        myDOMElement
    );


export default Globe