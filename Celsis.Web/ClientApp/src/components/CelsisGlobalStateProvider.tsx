import { useState, useEffect } from 'react';
import { createContext } from "react";
import { AppMode } from "../types/enums/AppMode";
import { DistanceMeasure } from '../types/enums/DistanceMeasure';
import { RadiusModeParameters } from "../types/modeParameters/RadiusModeParameters";
import { RouteModeParameters } from "../types/modeParameters/RouteModeParameters";

interface CelsisGlobalState {
    appMode: AppMode;
    isModeSelectingOpen: boolean;
    isParamEditingOpen: boolean;
    isPlaceRatingOpen: boolean;
    isModalsHidden: boolean;
    radiusModeParams: RadiusModeParameters;
    routeModeParams: RouteModeParameters;
    pointsOfInterest: google.maps.LatLngLiteral[];
    clickedPlaceId: string | null;
    onPlaceClickCallback: ((e: google.maps.MapMouseEvent) => void);
    placesService?: google.maps.places.PlacesService;

    setAppMode: React.Dispatch<React.SetStateAction<AppMode>>;
    openModeSelectingModal: () => void;
    closeModeSelectingModal: () => void;
    openParamEditingModal: () => void;
    closeParamEditingModal: () => void;
    openPlaceRatingModal: () => void;
    closePlaceRatingModal: () => void;
    hideAllModals: () => void;
    showModals: () => void;
    setRadiusModeParams: React.Dispatch<React.SetStateAction<RadiusModeParameters | undefined>>;
    setRouteModeParams: React.Dispatch<React.SetStateAction<RouteModeParameters | undefined>>;
    setPointsOfInterest: React.Dispatch<React.SetStateAction<google.maps.LatLngLiteral[]>>;
    setClickedPlaceId: React.Dispatch<React.SetStateAction<string | null>>;
    setOnPlaceClickCallback: React.Dispatch<React.SetStateAction<((e: google.maps.MapMouseEvent) => void) | undefined>>;
    setPlacesService: React.Dispatch<React.SetStateAction<google.maps.places.PlacesService | undefined>>;
    restoreInitialState: () => void;
}

export const CelsisContext = createContext<CelsisGlobalState | null>(null);

const CelsisGlobalStateProvider: React.FC<{children: JSX.Element}> = ({children}) => {
    const [appMode, setAppMode] = useState(AppMode.UNDEFINED);

    // Modals
    const [isModeSelectingOpen, setModeSelectingOpen] = useState(true);
    const [isParamEditingOpen, setParamEditingOpen] = useState(false);
    const [isPlaceRatingOpen, setPlaceRatingOpen] = useState(false);
    const [isModalsHidden, setModalsHidden] = useState(false);

    // Mode params
    const [radiusModeParams, setRadiusModeParams] = useState<RadiusModeParameters>();
    const [routeModeParams, setRouteModeParams] = useState<RouteModeParameters>();

    const [clickedPlaceId, setClickedPlaceId] = useState<string | null>(null);
    const [pointsOfInterest, setPointsOfInterest] = useState<google.maps.LatLngLiteral[]>([]);
    const [onPlaceClickCallback, setOnPlaceClickCallback] = useState<(event: google.maps.MapMouseEvent) => void>();

    const [placesService, setPlacesService] = useState<google.maps.places.PlacesService>();

    const defaultRadiusModeParams: RadiusModeParameters = {
        radius: 0,
        distanceMeasure: DistanceMeasure.KILOMETERS,
        start: undefined
    }
    
    const defaultRouteModeParams: RouteModeParameters = {
        start: undefined,
        finish: undefined
    }
    
    const defaultOnPlaceClickCallback = () => (event: google.maps.MapMouseEvent) => {
        const iconMouseEvent = (event as google.maps.IconMouseEvent);
        if (!iconMouseEvent) return;
    
        const placeId = iconMouseEvent.placeId;
        if (!placeId) return;
    
        setClickedPlaceId(placeId);
        openPlaceRatingModal();
    }

    const openModeSelectingModal = () => {
        setModeSelectingOpen(true);
    }

    const closeModeSelectingModal = () => {
        setModeSelectingOpen(false);
    }

    const openParamEditingModal = () => {
        setParamEditingOpen(true);
    }

    const closeParamEditingModal = () => {
        setParamEditingOpen(false);
        setOnPlaceClickCallback(defaultOnPlaceClickCallback);
    }

    const openPlaceRatingModal = () => {
        setPlaceRatingOpen(true);
    }

    const closePlaceRatingModal = () => {
        setPlaceRatingOpen(false);
        setClickedPlaceId(null);
    }

    const hideAllModals = () => {
        setModalsHidden(true);
    }

    const showModals = () => {
        setModalsHidden(false);
    }

    const restoreInitialState = () => {
        setAppMode(AppMode.UNDEFINED);

        openModeSelectingModal();
        closeParamEditingModal();
        closePlaceRatingModal();
        showModals();

        setRadiusModeParams(defaultRadiusModeParams);
        setRouteModeParams(defaultRouteModeParams);
    
        setClickedPlaceId(null);
        setPointsOfInterest([]);
        setOnPlaceClickCallback(defaultOnPlaceClickCallback);
    }

    useEffect(() => {
        restoreInitialState();
    }, [])

    if (
        !radiusModeParams ||
        !routeModeParams ||
        !onPlaceClickCallback
    ) return null;

    return (
        <CelsisContext.Provider value={{
            appMode: appMode,
            isModeSelectingOpen: isModeSelectingOpen,
            isParamEditingOpen: isParamEditingOpen,
            isPlaceRatingOpen: isPlaceRatingOpen,
            isModalsHidden: isModalsHidden,
            radiusModeParams: radiusModeParams,
            routeModeParams: routeModeParams,
            pointsOfInterest: pointsOfInterest,
            clickedPlaceId: clickedPlaceId,
            onPlaceClickCallback: onPlaceClickCallback,
            placesService: placesService,
        
            setAppMode: setAppMode,
            openModeSelectingModal: openModeSelectingModal,
            closeModeSelectingModal: closeModeSelectingModal,
            openParamEditingModal: openParamEditingModal,
            closeParamEditingModal: closeParamEditingModal,
            openPlaceRatingModal: openPlaceRatingModal,
            closePlaceRatingModal: closePlaceRatingModal,
            hideAllModals: hideAllModals,
            showModals: showModals,
            setRadiusModeParams: setRadiusModeParams,
            setRouteModeParams: setRouteModeParams,
            setPointsOfInterest: setPointsOfInterest,
            setClickedPlaceId: setClickedPlaceId,
            setOnPlaceClickCallback: setOnPlaceClickCallback,
            setPlacesService: setPlacesService,
            restoreInitialState: restoreInitialState
        }}>
            {children}
        </CelsisContext.Provider>
    );
}

export default CelsisGlobalStateProvider;