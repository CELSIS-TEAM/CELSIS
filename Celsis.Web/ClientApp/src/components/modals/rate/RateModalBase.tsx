import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle, IconButton, Rating,
} from "@mui/material";
import {useState} from "react";
import CloseIcon from '@mui/icons-material/Close';

interface RateModalBaseProps {
    open: boolean;
    title: string;
    content: JSX.Element;
    onClose: () => void;
    onAccept: (value: number) => void;
}

const RateModalBase = ({
    open,
    title,
    content,
    onClose,
    onAccept
}: RateModalBaseProps) => {
    const [rating, setRating] = useState(0);

    return (
        <Dialog
            open={open}
            sx={{ maxWidth: "50%", ml: "25%", mr: "25%" }}
        >
            <DialogTitle sx={{ pl: 2, pr: 2 }}>
                <Box display="flex" flexDirection="row" alignItems="center" sx={{ justifyContent: 'space-between' }}>
                    {title}
                    <IconButton onClick={onClose} sx={{ ml: 1 }}>
                        <CloseIcon />
                    </IconButton>
                </Box>
            </DialogTitle>
            <DialogContent sx={{ pl: 2, pr: 2 }}>
                {content}
                <Box textAlign="center">
                    <Rating
                        value={rating}
                        onChange={(event, value) => {
                            if (value) setRating(value);
                        }}
                        size="large"
                        sx={{ mt: 2 }}
                    />
                </Box>
            </DialogContent>
            <DialogActions sx={{ pl: "12px", pr: "12px" }}>
                <Button size="large" variant="contained" fullWidth onClick={() => onAccept(rating)}>
                    Apstiprināt
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default RateModalBase;