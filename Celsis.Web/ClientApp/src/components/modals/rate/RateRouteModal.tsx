import {Typography} from "@mui/material";
import RateModalBase from "./RateModalBase";

interface RateRouteModalProps {
    open: boolean;
    onClose: () => void;
    routeHash: string;
    placeNames: string[];
}

const RateRouteModal = ({
    open,
    onClose,
    routeHash,
    placeNames
}: RateRouteModalProps) => {
    const rateAndClose = (rating: number) => {
        // TODO: axios
        onClose();
    }

    return (
        <RateModalBase
            open={open}
            title="Ievadiet sākuma un beigu punktus"
            content={(
                <Typography>
                    {placeNames.join(" > ")}
                </Typography>
            )}
            onClose={onClose}
            onAccept={rateAndClose}
        />
    );
}

export default RateRouteModal;