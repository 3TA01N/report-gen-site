import React from "react";
import {
    TextField,
    Button,
    Box,
  } from '@mui/material';
interface LeadFormProps {
    name: string;
    description: string;
    onNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onDescriptionChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSubmit: (e: React.FormEvent) => void;
}
function LeadForm({name, description, onNameChange, onDescriptionChange, onSubmit}: LeadFormProps) {
    return (
        <Box>
            <Box component="form" onSubmit={onSubmit} display="flex" flexDirection="column" gap={3}>
                <TextField
                    label="Name"
                    variant="outlined"
                    value={name}
                    onChange={onNameChange}
                    required
                    fullWidth
                />
                <TextField
                    label="Description"
                    variant="outlined"
                    value={description}
                    onChange={onDescriptionChange}
                    required
                    fullWidth
                />
                
                <Button variant="contained" color="primary" type="submit">
                    Submit
                </Button>
            </Box>
        </Box>
    )
}

export default LeadForm; 