import { useContext } from 'react';
import { GoogleMap, LoadScript } from '@react-google-maps/api';
import Modals from "../components/mapLayers/Modals";
import { CelsisContext } from './CelsisGlobalStateProvider';
import Markers from './mapLayers/Markers';
import Routes from './mapLayers/Routes';
import RadiusFigure from './mapLayers/RadiusFigure';
import axios from "axios";
import apiRoutes from '../types/common/ApiRoutes';
import { AppMode } from '../types/enums/AppMode';

const CustomMap = () => {
    const globalState = useContext(CelsisContext);

    if (!globalState) return null;

    return (
        <LoadScript
            googleMapsApiKey="AIzaSyBjvAqJvfY5fpShEsN48edBKd5AHOWgOPo"
            libraries={['places']}
        >
            <GoogleMap
                zoom={12}
                center={{
                    lat: 56.95364,
                    lng: 24.08221
                }}
                mapContainerStyle={{
                    width: '100%',
                    height: '100vh'
                }}
                onClick={(event) => {
                    globalState.onPlaceClickCallback(event);
                }}
                onLoad={map => {
                    globalState.setPlacesService(new google.maps.places.PlacesService(map));
                }}
            >
                <Modals />
                <Markers />
                <Routes />
                <RadiusFigure />
            </GoogleMap>
        </LoadScript>
    );
}

export default CustomMap;