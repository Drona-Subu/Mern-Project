import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
 
import './Map.css';
 
const Map = (props) => {
  return (
    <MapContainer
      className={`map ${props.className}`}
      style={props.style}
      center={props.center}
      zoom={props.zoom}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      />
      <Marker position={props.center}>
        <Popup>{props.text}</Popup>
      </Marker>
    </MapContainer>
  );
};
 
export default Map;