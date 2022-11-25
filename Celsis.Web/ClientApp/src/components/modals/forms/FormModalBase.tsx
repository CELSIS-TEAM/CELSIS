import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle, IconButton,
} from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloseIcon from '@mui/icons-material/Close';

interface FormModalBaseProps {
    open: boolean;
    title: string;
    form: JSX.Element;
    acceptLabel: string;
    onAccept: () => void;
    back: () => void;
    closable?: boolean;
}

const FormModalBase = ({
    open,
    title,
    form,
    acceptLabel,
    onAccept,
    back,
    closable
}: FormModalBaseProps) => {
    return (
        <Dialog
            open={open}
            sx={{ maxWidth: "50%", ml: "25%", mr: "25%" }}
        >
            <DialogTitle sx={{ pl: "12px", pr: "12px" }}>
                <Box display="flex" flexDirection="row" alignItems="center">
                    <IconButton onClick={() => back()} sx={{ mr: 1 }}>
                        <ArrowBackIcon />
                    </IconButton>
                    {title}

                    {closable ?
                        <IconButton onClick={() => back()} sx={{ ml: 3, mr: 0 }}>
                            <CloseIcon />
                        </IconButton>
                        : null
                    }
                </Box>
            </DialogTitle>
            <DialogContent sx={{ pl: "12px", pr: "12px" }}>
                {form}
            </DialogContent>
            <DialogActions sx={{ pl: "12px", pr: "12px" }}>
                <Button size="large" variant="contained" fullWidth onClick={onAccept}>
                    {acceptLabel}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default FormModalBase;