import Fab from "@mui/material/Fab";
import EditIcon from "@mui/icons-material/Edit";
import React from "react";

const ChangeParams = ({onClick}: {onClick: () => void}) => {
    return(
        <Fab
            variant="extended"
            color="primary"
            aria-label="add"
            sx={{
                position: 'absolute',
                bottom: 16,
                left: 16
            }}
            onClick={onClick}
        >
            <EditIcon sx={{ mr: 1 }} />
            Mainīt iestatījumus
        </Fab>
    );
}

export default ChangeParams;