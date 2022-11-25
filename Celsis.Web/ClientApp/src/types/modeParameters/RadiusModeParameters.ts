import {DistanceMeasure} from "../enums/DistanceMeasure";
import { PlaceInfo } from "./PlaceInfo";

export interface RadiusModeParameters {
    radius: number;
    start?: PlaceInfo;
    distanceMeasure: DistanceMeasure;
}