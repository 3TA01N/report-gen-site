import { useParams } from "react-router";
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../components/api'
import { Container, Typography, Button, Stack, Box, Link as MuiLink } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';


function LeadPage() {
    const navigate = useNavigate();
    const deleteClicked = async () => {
        try {
            await api.delete(`/leads/${name}/`)
            navigate('/leads', { state: { runEffect: true}});
        }
        catch (error: any) {
            console.log("error deleting lead")
        }
    }

    const { name } = useParams()

    console.log(name)
    const [description, setDescription] = useState('')
    const [reports, setReports] = useState<any[]>([])
    useEffect(() => {
        const getLead = async() => {
            try {
                const response = await api.get(`/leads/${name}/`)
                console.log(response)
                setDescription(response.data.description)
                setReports(response.data.reports)
            }
            catch (error:any)  {
                console.log('Error fetching team lead', error.response)
            }
        }
        getLead()
        
    }, [])
    return (
        <Container sx={{ my: 4 }}>
          <Typography variant="h4" gutterBottom>
            {name}
          </Typography>
    
          <Box mb={3}>
            <Typography variant="subtitle1" fontWeight="bold">
              Lead description:
            </Typography>
            <Typography variant="body1">{description}</Typography>
          </Box>
    
          <Box mb={3}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Reports generated with this lead:
            </Typography>
            <Stack spacing={1}>
              {reports.map((report) => (
                <MuiLink 
                  key={report.name} 
                  component={RouterLink} 
                  to={`/reports/${report.name}`} 
                  color="primary"
                  underline="hover"
                >
                  {report.name} (click to navigate to report page)
                </MuiLink>
              ))}
            </Stack>
          </Box>
    
          <Stack direction="row" spacing={2}>
            <Button variant="contained" color="error" onClick={deleteClicked}>
              Delete
            </Button>
          </Stack>
        </Container>
      );
}

export default LeadPage