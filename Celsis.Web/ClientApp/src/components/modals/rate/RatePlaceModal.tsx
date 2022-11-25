import { useContext, useState, useEffect } from "react";
import { Typography } from "@mui/material";
import RateModalBase from "./RateModalBase";
import { CelsisContext } from "../../CelsisGlobalStateProvider";
import axios from "axios";
import apiRoutes from "../../../types/common/ApiRoutes";

const RatePlaceModal = () => {
    const globalState = useContext(CelsisContext);

    const [placeName, setPlaceName] = useState<string>();
    const [placeRating, setPlaceRating] = useState<number>();

    const rateAndClose = (rating: number) => {
        if (
            !globalState || 
            !globalState.clickedPlaceId
        ) return;

        const rateModel = {
            googlePlaceId: globalState.clickedPlaceId,
            rating: rating
        };

        axios
            .post(apiRoutes.ratePlace(), rateModel)
            .then(result => console.log(result));

        globalState?.closePlaceRatingModal();
    }

    useEffect(() => {
        if (
            !globalState || 
            !globalState.placesService || 
            !globalState.clickedPlaceId
        ) return;

        globalState.placesService.getDetails(
            { placeId: globalState.clickedPlaceId },
            (result, b) => {
                setPlaceName(result?.formatted_address);

                axios
                    .get<number>(apiRoutes.getPlaceRating(globalState!.clickedPlaceId!))
                    .then(response => {
                        if (result?.rating)
                            setPlaceRating((result?.rating + response.data) / 2);
                        else
                            setPlaceRating(response.data);
                    })
                    .catch(err => {
                        console.log(err);
                        setPlaceRating(result?.rating);
                    });
            }
        );
    }, [globalState])

    if (!globalState) return null;

    return (
        <RateModalBase
            open={globalState.isPlaceRatingOpen}
            title="Novērtēt vietu"
            content={(
                <>
                    <Typography variant="subtitle1">{placeName}</Typography>
                    <Typography variant="body2">Pašreizējais vērtējums: {placeRating}</Typography>
                </>
            )}
            onClose={globalState.closePlaceRatingModal}
            onAccept={rateAndClose}
        />
    );
}

export default RatePlaceModal;