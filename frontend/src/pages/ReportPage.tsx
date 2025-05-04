import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from "react-router";
//import { Link } from 'react-router-dom';
import { Link as RouterLink } from 'react-router-dom';
import api from '../components/api'
import { Container, Typography, Button, Stack, Box, CircularProgress, List, ListItem, Link as MuiLink, Alert} from '@mui/material';

function ReportPage() {
    
    const { name } = useParams()
    
    const [chat_log, setChatLog] = useState()
    const [context, setContext] = useState<any[]>([]) 
    //const [cycles, setCycles] = useState() 
    //const [date, setDate] = useState()
    const [engine, setEngine] = useState()
    const [expectations, setExpectation] = useState()
    const [lead_name, setLeadName] = useState()
    //const [method, setMethod] = useState()
    const [model, setModel] = useState()
    const [output, setOutput] = useState()
    //const [potentialAgents, setPotentialAgents] = useState()
    const [task, setTask] = useState()
    //const [temperature, setTemp] = useState()
    const [chosenTeam, setChosenTeam] = useState<any[]>([])
    const [savedToLead, setSavedToLead] = useState<boolean>()
    const [isLoading, setLoadStatus] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null);

    const saveReportMemory = async (reportId:any) => {
        setLoadStatus(true)
        try {
            await api.post(`/save_report_memory/${reportId}/`)
            setSavedToLead(true)
            setLoadStatus(false)
        }
        catch (error:any) {
            console.log('Error fetching agents', error.response)
            setLoadStatus(false)
        }
    }
    useEffect(() => {
        const getReport = async() => {
            try {
                
                const response = await api.get(`/reports/${name}/`)
                console.log(response.data)
                setChatLog(response.data.chat_log)
                setContext(response.data.context)
                //setCycles(response.data.cycles)
                //setTemp(response.data.temperature)
                setTask(response.data.task)
                setOutput(response.data.output)
                setModel(response.data.model)
                setLeadName(response.data.lead_name)
                setExpectation(response.data.expectations)
                //setCycles(response.data.cycles)
                setEngine(response.data.engine)
                //setDate(response.data.date)
                setSavedToLead(response.data.savedToLead)
                setChosenTeam(response.data.chosen_team)
            }
            catch(error:any) {
                console.log('Error fetching agents', error.response)
            }
        }
        getReport()
        
        
    }, [])

    const navigate = useNavigate();
    
    const deleteClicked = async () => {
        try {
            api.delete(`/reports/${name}/`)
            navigate('/reports')
        }
        catch(error:any) {
            console.log("error deleting report")
        }
    }

    return (
        <Container sx={{ my: 4 }}>
            {error && (
                <Alert
                    severity="error"
                    onClose={() => setError(null)}
                    sx={{ mb: 2}}
                >
                    {error}
                </Alert>
            )}
            <Typography variant="h4" gutterBottom>
                {name}
            </Typography>
            
            <Box mb={3}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Links:
                </Typography>
                <List>
                    <ListItem>
                        <MuiLink href={output} target="_blank" rel="noopener noreferrer" color="primary" underline="hover">Report text</MuiLink>
                    </ListItem>
                    <ListItem>
                        <MuiLink href={chat_log} target="_blank" rel="noopener noreferrer" color="primary" underline="hover">Report log</MuiLink>
                    </ListItem>
                </List>
            </Box>
            
            <Box mb={3}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Lead Information:
                </Typography>
                <Typography><strong>Lead name:</strong> {lead_name}</Typography>
                <Typography><strong>Task:</strong> {task}</Typography>
            </Box>
            <Box mb={3}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Chosen Agents:
                </Typography>
                <Stack spacing={1}>
                    {chosenTeam.map((agent) => (
                    <MuiLink
                        key={agent.name}
                        component={RouterLink}
                        to={`/agents/${agent.name}`}
                        color="primary"
                        underline="hover"
                    >
                        {agent.name} (click to navigate to agent page)
                    </MuiLink>
                    ))}
                </Stack>
            </Box>
            <Box mb={3}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Provided Context Files:
                </Typography>
                <List sx={{ pl: 0 }}>
                    {context.map((file, index) => (
                    <ListItem key={index} sx={{ display: 'list-item', listStyleType: 'disc', pl: 2 }}>
                        <MuiLink href={file.file} target="_blank" rel="noopener noreferrer" color="secondary" underline="hover">
                        {file.name}
                        </MuiLink>
                    </ListItem>
                    ))}
                </List>
            </Box>

            <Box mb={3}>
                <Typography><strong>Engine:</strong> {engine}</Typography>
                <Typography><strong>Model:</strong> {model}</Typography>
                <Typography><strong>Expectations:</strong> {expectations}</Typography>
            </Box>

            <Stack direction="row" spacing={2} alignItems="center">
                <Button variant="contained" color="error" onClick={deleteClicked}>
                    Delete
                </Button>
                <Button
                    variant="contained"
                    color="warning"
                    onClick={() => saveReportMemory(name)}
                    disabled={savedToLead}
                >
                    Save report in lead memory
                </Button>
                {isLoading && <CircularProgress size={24} />}
            </Stack>
    </Container>
  )
}

export default ReportPage