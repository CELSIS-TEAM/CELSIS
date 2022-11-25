import {Box, IconButton, MenuItem, Select, SelectChangeEvent, TextField} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import {DistanceMeasure} from "../../../../types/enums/DistanceMeasure";
import {useState, ChangeEvent } from "react";

interface DistanceInputProps {
    label: string;
    distance: number;
    measure: DistanceMeasure;
    onDistanceChange: (value: number) => void;
    onMeasureChange: (value: DistanceMeasure) => void;
}

const DistanceInput = ({ 
    label, 
    distance, 
    measure, 
    onMeasureChange, 
    onDistanceChange 
}: DistanceInputProps) => {
    const handleMeasureChange = (event: SelectChangeEvent) => {
        onMeasureChange(Number(event.target.value) as DistanceMeasure);
    };

    const handleDistanceChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        onDistanceChange(Number(event.target.value));
    };

    return (
        <Box display="flex" flexDirection="row">
            <TextField 
                type="number" 
                label={label} 
                variant="outlined" 
                fullWidth 
                sx={{ width: "70%", pr: 1 }}
                value={distance}
                onChange={handleDistanceChange}
            />
            <Select 
                sx={{ width: "30%" }}
                value={measure.toString()} 
                onChange={handleMeasureChange}
            >
                <MenuItem value={DistanceMeasure.KILOMETERS}>KM</MenuItem>
                <MenuItem value={DistanceMeasure.METERS}>M</MenuItem>
            </Select>
        </Box>
    );
}

export default DistanceInput;
