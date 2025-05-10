import LeadForm from "../components/LeadForm";
import React, { useState, useEffect } from 'react';
import api from "../components/api"
import { useLocation } from 'react-router-dom'
import { Link as RouterLink } from 'react-router-dom';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

import {
    Alert,
    Box,
    CircularProgress,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Typography,
  } from '@mui/material';
function Leads () {
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [leads, setLeads] = useState<any[]>([])
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setLoadStatus] = useState<boolean>(false)
    const location = useLocation()
    const runEffect = location.state?.runEffect;
    useEffect(() => {
        const getLeads = async() => {
            try {
                const response = await api.get('/leads/')
                setLeads(response.data)
            }
            catch (error: any) {
                console.log('Error fetching team leads', error.response)
            }
        }
        getLeads();
    }, [isLoading, runEffect])
    
    const formSubmit = (event: React.FormEvent) => {
        
        event.preventDefault();
        const lead = {
            name: name,
            description: description
        }

        setError(null);
        const createLead = async() => {
            setLoadStatus(true)
            try {
                const response = await api.post('/leads/', lead)
                console.log('New lead created:', response.data)
                setLeads([...leads, response.data]);
                setLoadStatus(false)
            }
            catch (error: any) {
                if (error.response.data.error == "Lead name already exists.") {
                    setError("Lead name already exists. Choose a different one.")
                    console.error('Error creating new lead');
                    setLoadStatus(false)

                }
                else {
                    setError("Error:" + error.response.data.error)
                    console.error(error.response)
                    setLoadStatus(false)
                }
            }
        }
        createLead();
        
        setName('')
        setDescription('')
    }
    return (
        <Box sx={{ display: 'flex', width: '100%', minHeight: '100vh'}}>
            {error && (
                <Alert
                    severity="error"
                    onClose={() => setError(null)}
                    sx={{ mb: 2}}
                >
                    {error}
                </Alert>
            )}
            <Box sx = {{display: 'flex', width: '100%'}}>
                <Box
                    sx={{
                        flex: 3,
                        px: 4, // Adjust left/right padding here
                        py: 4,
                    }}
                >
                    <Typography variant="h5" color="primary" gutterBottom>Create Lead</Typography>
                    <LeadForm 
                        name={name}
                        description={description}
                        onNameChange={(e) => setName(e.target.value)}
                        onDescriptionChange={(e) => setDescription(e.target.value)}
                        onSubmit={formSubmit}
                    />
                    {isLoading &&
                        <Box sx={{ mt: 3 }}>
                            <CircularProgress />
                        </Box>
                    }
                <Box sx={{ mt: 4 }}>
                    <Typography variant="h5" gutterBottom>
                        Current Leads
                    </Typography>
                    <List>
                        {leads.map((lead) => (
                            <ListItem disablePadding key={lead.name}>
                                <ListItemButton
                                    component={RouterLink}
                                    to={`/leads/${lead.name}/`}
                                    >
                                    <ListItemText primary={lead.name} />
                                    <ChevronRightIcon sx={{ color: 'text.secondary' }} />

                                
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </Box>
            </Box>
            {/*sidebar */}
            <Box
                    sx={{
                        flex: 1, // 25% of total width
                        backgroundColor: '#00000000',
                        p: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                {/* Example: an image */}
                
                </Box>
            </Box>
        </Box>


        

    );
}

export default Leads;