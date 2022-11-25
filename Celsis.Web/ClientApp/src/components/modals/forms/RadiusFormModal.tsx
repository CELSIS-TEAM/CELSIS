import {DistanceMeasure} from "../../../types/enums/DistanceMeasure";
import {Dispatch, SetStateAction, useState} from "react";
import FormModalBase from "./FormModalBase";
import PlaceSelect from "./fields/PlaceSelect";
import DistanceInput from "./fields/DistanceInput";
import {Stack} from "@mui/material";
import {RadiusModeParameters} from "../../../types/modeParameters/RadiusModeParameters";
import { CelsisContext } from "../../CelsisGlobalStateProvider";
import { useContext } from "react";
import { PlaceInfo } from "../../../types/modeParameters/PlaceInfo";
import apiRoutes from "../../../types/common/ApiRoutes";
import axios from "axios";
import { AppMode } from "../../../types/enums/AppMode";

const RadiusFormModal = () => {
    const globalState = useContext(CelsisContext);

    if (!globalState) return null;

    const handleRadiusChange = (value: number) => {
        const newParams = { ...globalState.radiusModeParams };
        newParams.radius = value;
        globalState.setRadiusModeParams(newParams)
    }

    const handleMeasureChange = (value: DistanceMeasure) => {
        const newParams = { ...globalState.radiusModeParams };
        newParams.distanceMeasure = value;
        globalState.setRadiusModeParams(newParams)
    }

    const handleStartChange = (value: PlaceInfo) => {
        const newParams = { ...globalState.radiusModeParams };
        newParams.start = value;
        globalState.setRadiusModeParams(newParams)
    }

    const handleAccept = () => {
        if (globalState.radiusModeParams.radius === 0)
            return;
        if (globalState.radiusModeParams.start === undefined)
            return;

        const location = globalState.radiusModeParams.start;
        const radius = globalState.radiusModeParams.distanceMeasure === DistanceMeasure.METERS 
            ? globalState.radiusModeParams.radius 
            : globalState.radiusModeParams.radius * 1000;

        globalState.placesService?.nearbySearch(
            { 
                location: location, 
                radius: radius,
                rankBy: google.maps.places.RankBy.PROMINENCE,
                openNow: true,
                type: "park",
            },
            (result, b, c) => {
                const pointsOfInterest: PlaceInfo[] = result?.filter(place => place && place.geometry && place.geometry.location)
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
                    placeCount: 10,
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
                globalState.appMode === AppMode.RADIUS && 
                globalState.isParamEditingOpen && 
                !globalState.isModalsHidden
            }
            title="Ievadiet adresi un rādiusu"
            form={
                <Stack spacing={1} sx={{ pb: 0, pt: 1 }}>
                    <PlaceSelect
                        label="Adrese"
                        value={globalState.radiusModeParams.start}
                        onChange={handleStartChange}
                    />
                    <DistanceInput
                        label="Rādiuss"
                        distance={globalState.radiusModeParams.radius ?? 0}
                        measure={globalState.radiusModeParams.distanceMeasure ?? DistanceMeasure.KILOMETERS}
                        onDistanceChange={handleRadiusChange}
                        onMeasureChange={handleMeasureChange}
                    />
                </Stack>
            }
            acceptLabel="Parādi, kas ir interesants apkārtnē"
            onAccept={handleAccept}
            back={globalState.restoreInitialState}
            closable={false}
        />
    );
}

export default RadiusFormModal;