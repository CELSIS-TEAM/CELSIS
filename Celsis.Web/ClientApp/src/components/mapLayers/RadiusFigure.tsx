import { useContext } from "react";
import { Circle } from "@react-google-maps/api";
import { CelsisContext } from "../CelsisGlobalStateProvider";
import { DistanceMeasure } from "../../types/enums/DistanceMeasure";

const RadiusFigure = () => {
    const globalState = useContext(CelsisContext);

    if (!globalState || !globalState.radiusModeParams || !globalState.radiusModeParams.start) return null;

    const params = globalState.radiusModeParams;

    const center = params.start;
    const radius = params.distanceMeasure === DistanceMeasure.METERS 
        ? params.radius 
        : params.radius * 1000;

    const options = {
        strokeWeight: 2,
        clickable: false,
        draggable: false,
        editable: false,
        visible: true,
        strokeColor: "#005551",
        fillColor: "#005551",
    } 

    return(
        <Circle 
            center={center} 
            radius={radius}
            options={options}
        />
    );
}

export default RadiusFigure;