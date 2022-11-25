import {Box, Button, Dialog, DialogActions, DialogTitle,} from "@mui/material";
import {AppMode} from "../../types/enums/AppMode";
import { CelsisContext } from "../CelsisGlobalStateProvider";
import { useContext } from "react";

const SelectModeModal = () => {
    const globalState = useContext(CelsisContext);

    if (!globalState) return null;

    const handleModeSelect = (mode: AppMode) => {
        globalState.setAppMode(mode);
        globalState.closeModeSelectingModal();
        globalState.openParamEditingModal();
    }

    return (
        <Dialog
            open={globalState.isModeSelectingOpen}
            sx={{ maxWidth: "50%", ml: "25%", mr: "25%" }}
        >
            <DialogTitle>
                Ko Jūs vēlaties šodien?
            </DialogTitle>
            <DialogActions sx={{ pl: "12px", pr: "12px" }}>
                <Box display="flex" flexDirection="column">
                    <Button
                        size="large"
                        variant="contained"
                        fullWidth
                        onClick={() => handleModeSelect(AppMode.ROUTE)}
                        sx={{ mb: 1 }}
                    >
                        Izveido maršrutu cauri apskates objektiem
                    </Button>
                    <Button 
                        size="large" 
                        variant="contained" 
                        fullWidth 
                        onClick={() => handleModeSelect(AppMode.RADIUS)}
                    >
                        Parādi, kas ir interesants apkārtnē
                    </Button>
                </Box>
            </DialogActions>
        </Dialog>
    );
}

export default SelectModeModal;