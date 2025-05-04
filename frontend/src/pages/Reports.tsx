import { useState, useEffect } from 'react';
import api from "../components/api"
import { Link as RouterLink } from 'react-router-dom';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';


import {
    Alert,
    Box,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Typography,
} from '@mui/material';

function Reports () {
    const [reports, setReports] = useState<any[]>([])
    const [error, setError] = useState<string | null>(null);
    
    useEffect(() => {
        const getReports = async() => {
            try {
                const response = await api.get('/reports/')
                setReports(response.data)
                console.log(reports)
            }
            catch (error: any) {
                console.log('Error fetching reports', error.response)
            }
        }
        getReports();
    }, [])

    
    return (
        <Box sx={{ display: 'flex', width: '100%', minHeight: '100vh',}}>
                
        
            {error && (
                <Alert
                    severity="error"
                    onClose={() => setError(null)}
                    sx={{ mb: 2}}
                >
                    {error}
                </Alert>
            )}
            <Box sx={{ mt: 4,width: '100%'}}>
                <Typography variant="h5" gutterBottom>
                    Current Reports
                </Typography>
                
                <List>
                    {reports.map((report) => (
                        <ListItem disablePadding key={report.name}>
                            <ListItemButton
                                component={RouterLink}
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    px: 3,
                                    py: 2,
                                    width: '100%',
                                    borderRadius: 1,
                                    '&:hover': {
                                      backgroundColor: 'action.hover',
                                      boxShadow: 1,
                                    },
                                }}

                                to={`/reports/${report.name}/`}
                            >
                                <ListItemText primary={report.name} />
                                <Typography variant="body2" color="text.secondary">
                                    {new Date(report.date).toLocaleDateString(undefined, {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                    })}
                                </Typography>
                                <ChevronRightIcon sx={{ color: 'text.secondary' }} />

                            
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Box>

        </Box>
        

    );
}

export default Reports;