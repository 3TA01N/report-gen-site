import React from "react";
import {
    TextField,
    Button,
    Box,
    IconButton,
    Typography,
    Tooltip,
  } from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
  
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
            <Box position="relative" width="100%" display="flex" gap={1}>
                <Typography variant="h5" color="primary" gutterBottom sx={{ paddingBottom: 0 }}>Create lead</Typography>
                <Tooltip title={
                    <Box>
                    <Typography variant="subtitle2" gutterBottom>
                        Leads keep meetings on track, choose agents, generate goals, and generates the final report. 
                        Each lead keeps track of the reports it's been assigned to generate, and can (optionally) use past report information when generating new reports.
                    </Typography>
                  </Box>
                }>
                        <IconButton
                        size="small"
                        sx={{
                            //position: 'absolute',
                            top: '50%',
                            right: 8,
                            marginTop: '17.5px',
                            transform: 'translateY(-50%)',
                            backgroundColor: 'transparent',
                            color: 'gray',
                            '&:hover': {
                            backgroundColor: 'transparent',
                            color: 'black',
                            },
                        }}
                        disableRipple
                        >
                        <HelpOutlineIcon />
                        </IconButton>
                    </Tooltip>
            </Box>
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