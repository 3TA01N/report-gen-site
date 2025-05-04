import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from "react-router";
import api from "../components/api"
import { Container, Typography, Button, Stack, Box, Link} from '@mui/material';


function AgentPage() {
    const { name } = useParams()
    const [role, setRole] = useState('')
    const [expertise, setExpertise] = useState('')
    const [files, setFiles] = useState<any[]>([]) 
    useEffect(() => {
        const getAgents = async () => {
            try {
                const response = await api.get(`/agents/${name}/`)
                setRole(response.data.role)
                setExpertise(response.data.expertise)
                setFiles(response.data.stored_papers)
            }
            catch (error: any) {
                console.log('Error fetching agents', error.response)
            }
        }
        getAgents()
    }, [])

    const navigate = useNavigate();
    const deleteClicked = async () => {
        try {
            await api.delete(`agents/${name}/`)
            navigate('/agents')
        }
        catch (error: any) {
            console.log("error deleting agent")
        }
    }
    return (
        <Container sx={{ my: 4 }}>
          <Typography variant="h4" gutterBottom>
            {name}
          </Typography>
        
          <Box mb={3}>
            <Typography variant="subtitle1" fontWeight="bold">
              Agent role:
            </Typography>
            <Typography variant="body1">{role}</Typography>
          </Box>

          <Box mb={3}>
            <Typography variant="subtitle1" fontWeight="bold">
              Agent expertise:
            </Typography>
            <Typography variant="body1">{expertise}</Typography>
          </Box>
    
          <Box mb={3}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Files in agent knowledgebase:
            </Typography>
            <Stack spacing={1}>
              {files.map((file) => (
                <Link 
                    key={file.name}
                    href={file.file}
                    target="_blank"
                    rel="noopener noreferrer"
                    color="primary"
                    underline="hover"
                >
                    Download {file.name}
                </Link>
              ))}
            </Stack>
          </Box>
    
          <Stack direction="row" spacing={2}>
            <Button variant="contained" color="error" onClick={deleteClicked}>
              Delete
            </Button>
          </Stack>
        </Container>
        
    )
}

export default AgentPage