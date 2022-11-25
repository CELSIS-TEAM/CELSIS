import { Marker } from "@react-google-maps/api";
import { useContext, useState, useEffect } from "react";
import { AppMode } from "../../types/enums/AppMode";
import { CelsisContext } from "../CelsisGlobalStateProvider";

const Markers = () => {
    const globalState = useContext(CelsisContext);

    const [markers, setMarkers] = useState<google.maps.LatLngLiteral[]>([]);

    useEffect(() => {
        const coordinates: google.maps.LatLngLiteral[] = [];
        
        const radiusModeStart = globalState?.radiusModeParams.start;
        if (radiusModeStart)
            coordinates.push({ lat: radiusModeStart.lat, lng: radiusModeStart.lng });

        const routeModeStart = globalState?.routeModeParams.start;
        if (routeModeStart)
            coordinates.push({ lat: routeModeStart.lat, lng: routeModeStart.lng });
        
        const routeModeFinish = globalState?.routeModeParams.finish;
        if (routeModeFinish)
            coordinates.push({ lat: routeModeFinish.lat, lng: routeModeFinish.lng });

        globalState?.pointsOfInterest.forEach(point => {
            coordinates.push(point);
        })

        setMarkers(coordinates);
    }, [globalState]);

    if (globalState?.appMode !== AppMode.RADIUS) return null;
    
    return (
        <>
            {markers.map(coord => <Marker position={coord} />)}
        </>
    );
}

export default Markers;