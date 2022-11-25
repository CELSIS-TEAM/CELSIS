import {Box, IconButton, TextField} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { PlaceInfo } from "../../../../types/modeParameters/PlaceInfo";
import { useContext } from "react";
import { CelsisContext } from "../../../CelsisGlobalStateProvider";

interface PlaceSelectProps {
    label: string;
    value?: PlaceInfo;
    onChange: (value: PlaceInfo) => void;
}

const PlaceSelect = ({label, value, onChange}: PlaceSelectProps) => {
    const globalState = useContext(CelsisContext);

    if (!globalState) return null;

    const getValue = () => {
        if (!value) 
            return "";
        if (!value.formattedAddress)
            return `Lat: ${value.lat}, Lng: ${value.lng}`;
        return value.formattedAddress;
    }

    const handleIconClick = () => {
        if (!globalState.setOnPlaceClickCallback) return;

        globalState.hideAllModals();

        globalState.setOnPlaceClickCallback(handlePlaceSelect);
    }

    const handlePlaceSelect = () => (event: google.maps.MapMouseEvent) => {
        const iconMouseEvent = (event as google.maps.IconMouseEvent);
        if (!iconMouseEvent) return;
        const placeId = iconMouseEvent.placeId;
        if (!placeId || !globalState.placesService ) return;

        globalState.placesService.getDetails(
            { placeId: placeId },
            (result, b) => {
                if (!event.latLng) return; 

                const placeCoord: PlaceInfo = {
                    formattedAddress: result?.formatted_address,
                    placeId: placeId,
                    lat: event.latLng.lat(),
                    lng: event.latLng.lng()
                }

                onChange(placeCoord);

                globalState.showModals();
            }
        );
    }

    return (
        <Box display="flex" flexDirection="row">
            <TextField 
                label={label} 
                value={getValue()} 
                variant="outlined" 
                fullWidth 
                disabled 
                sx={{ pr: 1 }} 
            />
            <IconButton onClick={handleIconClick}>
                <LocationOnIcon color="error" fontSize="large"/>
            </IconButton>
        </Box>
    );
}

export default PlaceSelect;
