import { DirectionsRenderer } from "@react-google-maps/api";
import { useContext, useState, useEffect } from "react";
import { AppMode } from "../../types/enums/AppMode";
import { CelsisContext } from "../CelsisGlobalStateProvider";

const Routes = () => {
    const globalState = useContext(CelsisContext);

    const service = new google.maps.DirectionsService();

    const [routes, setRoutes] = useState<google.maps.DirectionsResult | null>(null);

    useEffect(() => {
        if (globalState?.appMode === AppMode.UNDEFINED) {
            setRoutes(null);
            return;
        }
        const start = globalState?.routeModeParams.start as google.maps.LatLngLiteral;
        const finish = globalState?.routeModeParams.finish as google.maps.LatLngLiteral;
        
        if (!start || !finish) return;

        service.route(
        {
            origin: start,
            destination: finish, 
            travelMode: google.maps.TravelMode.WALKING,
            waypoints: globalState?.pointsOfInterest.map(point => { return { location: point } }),
            optimizeWaypoints: true,
            provideRouteAlternatives: false,
        }, 
        (a, b) => setRoutes(a));
    }, [globalState])
    
    if (
        !routes || 
        globalState?.isParamEditingOpen || 
        globalState?.isModeSelectingOpen
    ) return null;

    return (
        <DirectionsRenderer
            directions={routes}
            routeIndex={0}
            options={{
                hideRouteList: true,
                routeIndex: 0
            }}
        />
    );
}

export default Routes;