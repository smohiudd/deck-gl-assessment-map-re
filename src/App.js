import React from 'react';
import DeckGL from '@deck.gl/react';
import {MapboxLayer} from "@deck.gl/mapbox";
import {StaticMap} from 'react-map-gl';
import {TileLayer} from '@deck.gl/geo-layers';
import {VectorTile} from '@mapbox/vector-tile';
import Protobuf from 'pbf';
import EnhancedHexagonLayer from './hexagon-layer/enhanced-hexagon-layer';

import SelectionContainer from "./SelectionContainer"

const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1Ijoic2FhZGlxbSIsImEiOiJjamJpMXcxa3AyMG9zMzNyNmdxNDlneGRvIn0.wjlI8r1S_-xxtq2d-W5qPA';


const initialView = {
  longitude: -114.062019,
  latitude: 51.044270,
  zoom:10.5,
};

const COLOR_RANGE = [[68, 1, 84],
 [65, 68, 135],
 [42, 120, 142],
 [34, 168, 132],
 [122, 209, 81],
 [253, 231, 37]]

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      zoom:initialView.zoom,
    };
    this._onViewStateChange = this._onViewStateChange.bind(this);
  }

  _onWebGLInitialized = (gl) => {
    this.setState({gl});
  }

  _onMapLoad = () => {
    const map = this._map;
    const deck = this._deck;

    let name = "assessment-RE"
    map.addLayer(new MapboxLayer({id: name, deck}),'waterway-label');
  }

  _onViewStateChange({viewState}) {
    this.setState({zoom:viewState.zoom});
  }

  _renderLayers() {

    const hex_layer =  new TileLayer({
      id: "assessment-RE",
      type: TileLayer,
      getTileData: ({x, y, z}) => {
        const mapSource = `https://a.tiles.mapbox.com/v4/saadiqm.azk20mv4/${z}/${x}/${y}.vector.pbf?access_token=${MAPBOX_ACCESS_TOKEN}`;
        return fetch(mapSource)
          .then(response => response.arrayBuffer())
          .then(buffer => {
            const tile = new VectorTile(new Protobuf(buffer));

            const features = [];
            let vectorTileLayer = tile.layers["RE"]

            for (let i = 0; i < vectorTileLayer.length; i++) {
              const vectorTileFeature = vectorTileLayer.feature(i);
              const feature = vectorTileFeature.toGeoJSON(x, y, z);
              features.push(feature);
            }
            return features;
          });
      },
      onTileError:(e) => console.error(e),
      maxZoom:10,
      renderSubLayers: props => {

        function getWeight(point) {
          return point.properties.RE_ASSESSED_VALUE;
        }
        return new EnhancedHexagonLayer(props,{
          opacity:0.9,
          pickable: false,
          extruded: false,
          radius:80,
          coverage:0.8,
          colorAggregation:"MEAN",
          getColorWeight: getWeight,
          colorRange:COLOR_RANGE,
          colorScale:"quantile",
          getPosition: d => d.geometry.coordinates,
          });
        }
      })

    return [hex_layer]
  }


  render() {

    const {gl} = this.state;

    return (
      <div>
      <DeckGL
        ref={ref => {
          this._deck = ref && ref.deck;
        }}
        layers={this._renderLayers()}
        initialViewState={initialView}
        controller={true}
        onWebGLInitialized={this._onWebGLInitialized}
        onViewStateChange={this._onViewStateChange}

      >
      {gl && (
        <StaticMap
          ref={ref => {
            this._map = ref && ref.getMap();
          }}
          gl={gl}
          mapStyle="mapbox://styles/saadiqm/cjxbd493m05cc1cl29jntlb1w?optimize=true"
          mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN}
          onLoad={this._onMapLoad}
        />
      )}
      </DeckGL>
        <SelectionContainer/>
      </div>


    );
  }
}

export default App;
