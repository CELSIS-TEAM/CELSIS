import {
    Stack,
} from "@mui/material";
import { useContext } from "react";
import FormModalBase from "./FormModalBase";
import PlaceSelect from "./fields/PlaceSelect";
import { CelsisContext } from "../../CelsisGlobalStateProvider";
import { PlaceInfo } from "../../../types/modeParameters/PlaceInfo";
import apiRoutes from "../../../types/common/ApiRoutes";
import axios from "axios";
import { AppMode } from "../../../types/enums/AppMode";

const RouteFormModal = () => {
    const globalState = useContext(CelsisContext);
   
    if (!globalState) return null;

    const handleStartChange = (value: PlaceInfo) => {
        const newParams = { ...globalState.routeModeParams };
        newParams.start = value;
        globalState.setRouteModeParams(newParams)
    }

    const handleFinishChange = (value: PlaceInfo) => {
        const newParams = { ...globalState.routeModeParams };
        newParams.finish = value;
        globalState.setRouteModeParams(newParams)
    }

    const handleAccept = () => {
        if (globalState.routeModeParams.start === undefined)
            return;
        if (globalState.routeModeParams.finish === undefined)
            return;

        const startLocation = globalState.routeModeParams.start;
        const finishLocation = globalState.routeModeParams.finish;

        const centerLocation: google.maps.LatLngLiteral = {
            lat: (finishLocation.lat + startLocation.lat) / 2,
            lng: (finishLocation.lng + startLocation.lng) / 2
        } 

        var dLat = finishLocation.lat * Math.PI / 180 - startLocation.lat * Math.PI / 180;
        var dLon = finishLocation.lng * Math.PI / 180 - startLocation.lng * Math.PI / 180;
        var a = 
            Math.sin(dLat/2) * 
            Math.sin(dLat/2) +
            Math.cos(startLocation.lat * Math.PI / 180) * 
            Math.cos(finishLocation.lat * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        const radius = 6378137 * c / 2 * 1.1;

        globalState.placesService?.nearbySearch(
            { 
                location: centerLocation, 
                radius: radius,
                rankBy: google.maps.places.RankBy.PROMINENCE,
                openNow: true,
                type: "park",
            },
            (result, b, c) => {
                const pointsOfInterest: PlaceInfo[] = result
                    ?.filter(place => place && place.geometry && place.geometry.location)
                    .map(place => {
                        return {
                            lat: place.geometry!.location!.lat(),
                            lng: place.geometry!.location!.lng(),
                            rating: place.rating,
                            formattedAddress: place.formatted_address,
                            placeId: place.place_id
                        } 
                    }) ?? [];

                const buildRouteModel = {
                    placeCount: 3,
                    places: pointsOfInterest.map(point => {
                        return {
                            googlePlaceId: point.placeId,
                            googleRating: point.rating
                        }
                    })
                };

                axios
                    .post(apiRoutes.buildRoute(), buildRouteModel)
                    .then((result) => {
                        const filteredPointsOfInterest: PlaceInfo[] = [];

                        (result.data.places as any[]).forEach(place => {
                            const point = pointsOfInterest
                                .find(x => x.placeId === place.googlePlaceId);
                            if (point)
                                filteredPointsOfInterest.push(point)
                        })

                        globalState.setPointsOfInterest(filteredPointsOfInterest);
                        globalState.closeParamEditingModal();
                    });
            }
        )
    }

    return (
        <FormModalBase
            open={
                globalState.appMode === AppMode.ROUTE && 
                globalState.isParamEditingOpen &&
                !globalState.isModalsHidden
            }
            title="Ievadiet sākuma un beigu punktus"
            form={
                <Stack spacing={1} sx={{ pb: 0, pt: 1 }}>
                    <PlaceSelect
                        label="Sākumpunkts"
                        value={globalState.routeModeParams?.start}
                        onChange={handleStartChange} 
                    />
                    <PlaceSelect
                        label="Galapunkts"
                        value={globalState.routeModeParams?.finish}
                        onChange={handleFinishChange}  
                    />
                </Stack>
            }
            acceptLabel="Izveido maršrutu cauri apskates objektiem"
            onAccept={handleAccept}
            back={globalState.restoreInitialState}
            closable={false}
        />
    );
}

export default RouteFormModal;