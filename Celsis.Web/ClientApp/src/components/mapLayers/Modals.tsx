import SelectModeModal from "../modals/SelectModeModal";
import { AppMode } from "../../types/enums/AppMode";
import RadiusFormModal from "../modals/forms/RadiusFormModal";
import RouteFormModal from "../modals/forms/RouteFormModal";
import RatePlaceModal from "../modals/rate/RatePlaceModal";
import RateRouteModal from "../modals/rate/RateRouteModal";
import { useContext } from "react";
import ChangeParams from "../ChangeParams";
import { CelsisContext } from "../CelsisGlobalStateProvider";

const Modals = () => {
    const globalState = useContext(CelsisContext);

    if (!globalState) return null;

    return (
        <>
            <SelectModeModal />

            <RadiusFormModal />
            <RouteFormModal />
            
            <RatePlaceModal />
            
            {
                !globalState.isModeSelectingOpen &&
                !globalState.isParamEditingOpen &&
                <ChangeParams onClick={globalState.restoreInitialState}/>
            }
        </>
    );
}

export default Modals;