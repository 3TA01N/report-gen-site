import { useState, useEffect } from 'react';
import { useLocation } from "react-router-dom"
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../components/api'
import {
    Alert,
    Box,
    Stack, 
    Paper,
    Link,
    Button,
    Divider,
    Container,
    Typography,
  } from '@mui/material';

function ReportOutputPage () {
    const navigate = useNavigate();
    const bottomRef = useRef<HTMLDivElement>(null)
    const [curGenerating, setCurGenerating] = useState<string>("")
    const [moveOn, setMoveOn] = useState<boolean>(false)
    const [chosenTeam, setChosenTeam] = useState([])
    const [guidingQ, setGuidingQ] = useState([])
    const [chatLog, setChatLog] = useState<{ speaker: string; text: string }[]>([]);
    const [agentGoals, setAgentGoals] = useState<{ agent: string; goal: string }[]>([]);
    const [cycle, setCycle] = useState("0");
    const [deleteDisabled, setDeleteDisabled] = useState(false);
    const [savedToLead, setSavedToLead] = useState<boolean>(false)
    const location = useLocation();
    const subData = location.state || {};
    const [name, setName] = useState(subData.name || '')
    const [task] = useState(subData.task || '')
    const [description] = useState(subData.description || '')
    const [expectations] = useState(subData.expectations || '')
    const [model] = useState(subData.model || '')
    const [context] = useState<File[]>(subData.context || []);
    const [cycles] = useState(subData.cycles || '');
    const [reportGuidelines] = useState(subData.reportGuidelines || '');
    const [method] = useState('2');
    const [temp] = useState(subData.temp || '');
    const [engine] = useState(subData.engine || '')
    const [lead] = useState(subData.lead || '');
    const [selectedInDBFiles] = useState<string[]>(subData.selectedInDBFiles || [])
    const [selectedAgents] = useState<string[]>(subData.selectedAgents || [])
    


    const hasFetched = useRef(false);
    const [isLoading, setLoadStatus] = useState<boolean>(false)
    const [report, setReport] = useState<any>(null)
    const [error, setError] = useState<string | null>(null);

    const scrollToBottom = () => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    };
    const checkLoggedInUser = async () => {
        try {
            const token = localStorage.getItem("accessToken");
            if (!token) {
                if (location.pathname !== "/register") {
                    navigate("/login");
                }
                return
            }

            await api.get("/user/");
            //navigate("/")
        }
        catch(error) {
            if (location.pathname !== "/register") {
                navigate("/login");
            }

        }
    };
    
    const deleteReport = async(id:any) => {
        try {
            await api.delete(`/reports/${id}`)
            setDeleteDisabled(true)
            console.log("navigating")
            navigate("/", 
                { state: { 
                    name:name,
                    task: task,
                    description: description,
                    expectation: expectations,
                    model: model,
                    context: context,
                    selectedInDBFiles: selectedInDBFiles,
                    selectedAgents: selectedAgents,
                    cycles: cycles,
                    reportGuidelines: reportGuidelines,
                    method: method,
                    temp: temp,
                    engine: engine,
                    lead: lead,
                } 
            });
        }
        catch (error: any) {
            console.log("errror deleting report")
        }
        
    }
    const getNewReport = async () => {
        
        //report should have been created in backend after done, so now fetch it
        try {
            const reportResponse = await api.get(`/reports/${name}/`)
            console.log('New report generated:', reportResponse.data)
            setReport(reportResponse.data)
        }
        catch (error:any) {
            console.log("error fetching newly created report")
        }
        setMoveOn(true)
    }
    const saveReportMemory = async (reportId:any) => {
        setLoadStatus(true)
        try {
            await api.post(`save_report_memory/${reportId}/`)
            setSavedToLead(true)
            setLoadStatus(false)
        }
        catch (error: any) {
            console.log('Error fetching agents', error.response)
            setLoadStatus(false)
        }
    }
    if (!subData) return <p>No formdata</p>;
    useEffect(() => {    
        checkLoggedInUser()   
        setName(subData?.name)
        //guard to make sure axios is only called once
        if (hasFetched.current) return;
        hasFetched.current = true;
        console.log("About to run an axios call")
        const formData = new FormData();
        formData.append("name", name)
        formData.append("task", task)
        formData.append("description", description)
        formData.append("expectations", expectations)
        formData.append("model", model || "gpt-4o");
        for (let i=0; i < context.length; i++) {
            formData.append("context_files", context[i])
        }
        for (let i=0; i < selectedInDBFiles.length; i++) {
            formData.append("selFiles", selectedInDBFiles[i])
        }
        if (selectedAgents.length == 0) {
            formData.append("selAgents", "all")
        }
        else {
            for (let i=0; i < selectedAgents.length; i++) {
                formData.append("selAgents", selectedAgents[i])
            }
        }
        selectedAgents
        formData.append("cycles", cycles || '1')
        formData.append("reportGuidelines", reportGuidelines)
        formData.append("method", method)
        formData.append("temperature", temp || '0.8')
        formData.append("engine", engine || 'openai')
        formData.append("lead", lead)
        console.log("FORM DATA")
        console.log([...formData.entries()])
        setLoadStatus(true)
        const postReport = async() => {
            try {
                const token = localStorage.getItem("accessToken");
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/reports/`, {
                    method: "POST",
                    headers: {
                      "Authorization": `Bearer ${token}`,
                    },
                    body: formData
                });
                console.log("RETURNED RESPONSE")
                console.log(response)
                if (!response.ok) {
                    const err_msg = await response.text()
                    console.error("Error generating the report:", err_msg);
                    setError(err_msg)
                            navigate("/", 
                                { state: { 
                                    name:name,
                                    task: task,
                                    description: description,
                                    expectations: expectations,
                                    model: model,
                                    context: context,
                                    selectedInDBFiles: selectedInDBFiles,
                                    selectedAgents: selectedAgents,
                                    cycles: cycles,
                                    reportGuidelines: reportGuidelines,
                                    method: method,
                                    temp: temp,
                                    engine: engine,
                                    lead: lead,
                                    error: err_msg
                                } 
                            });
                    return
                }
                if (!response.body) {
                    setError("No response body")
                            navigate("/", 
                                { state: { 
                                    name:name,
                                    task: task,
                                    description: description,
                                    expectations: expectations,
                                    model: model,
                                    context: context,
                                    selectedInDBFiles: selectedInDBFiles,
                                    selectedAgents: selectedAgents,
                                    cycles: cycles,
                                    reportGuidelines: reportGuidelines,
                                    method: method,
                                    temp: temp,
                                    engine: engine,
                                    lead: lead,
                                    error: "No response body"
                                } 
                            });
                        
                    throw new Error("No response body found.");
                    return
                    
                }

                const reader = response.body.getReader();
                const decoder = new TextDecoder();
                let done = false;

                while (!done) {
                    const { done: chunkDone, value: chunk } = await reader.read();
                    done = chunkDone;
                    
                    const decodedChunk = decoder.decode(chunk, { stream: true }).trim();
                    
                    try {
                        console.log(`decoded chunk: ${decodedChunk}`)
                        const parsedChunk = JSON.parse(decodedChunk)
                        console.log(parsedChunk)
                        if (parsedChunk.status == "error") {
                            setError(parsedChunk.message)
                            navigate("/", 
                                { state: { 
                                    name:name,
                                    task: task,
                                    description: description,
                                    expectations: expectations,
                                    model: model,
                                    context: context,
                                    selectedInDBFiles: selectedInDBFiles,
                                    selectedAgents: selectedAgents,
                                    cycles: cycles,
                                    reportGuidelines: reportGuidelines,
                                    method: method,
                                    temp: temp,
                                    engine: engine,
                                    lead: lead,
                                    error: parsedChunk.message
                                } 
                            });
                            break;
                        }

                        if (parsedChunk === "END") {
                            setCurGenerating("END")
                            break;
                            
                        }
                        if (Array.isArray(parsedChunk)) {
                            //display logic
                            const responseType = parsedChunk[0]
                            if (responseType === "PROGRESS") {
                                if (parsedChunk[1] === "GENGOAL") {
                                    setCurGenerating(parsedChunk[2])
                                }
                                else {
                                    setCurGenerating(parsedChunk[1])
                                }
                            }
                            if (responseType === "CYCLE") {
                                setCycle(parsedChunk[1])
                            }
                            if (responseType === "TEAM") {

                                setChosenTeam(parsedChunk[1])
                            }
                            if (responseType === "GOAL") {
                                setAgentGoals((prevGoal) => [...prevGoal, { agent: parsedChunk[1], goal: parsedChunk[2] }])
                            }
                            if (responseType === "RESPONSE") {
                                setChatLog((prevLog) => [...prevLog, { speaker:parsedChunk[1], text:parsedChunk[2] }]);
                            }
                            if (responseType === "GUIDINGQ") {
                                const questions = parsedChunk[1].split(/\d+\.+/)
                                                                .map((q:string) => q.trim())
                                                                .filter((q:string) => q.length > 0);
                                setGuidingQ(questions)
                            }
                        }
                    }
                    catch (error:any){
                        console.error("Error generating the report:", error);
                        console.log("error catching")
                        console.error(Error)
                        setLoadStatus(false)
                        navigate("/", 
                            { state: { 
                                name:name,
                                task: task,
                                description: description,
                                expectations: expectations,
                                model: model,
                                context: context,
                                selectedInDBFiles: selectedInDBFiles,
                                selectedAgents: selectedAgents,
                                cycles: cycles,
                                reportGuidelines: reportGuidelines,
                                method: method,
                                temp: temp,
                                engine: engine,
                                lead: lead,
                                error: error.response.data.error
                            } 
                        });
                        return
                    }
                }
                console.log(curGenerating)
                setLoadStatus(false)
                scrollToBottom()
            } 
            catch (error:any) {
                console.error("Error generating the report:", error);
                console.log("error catching")
                console.error(Error)
                setLoadStatus(false)
                navigate("/", 
                    { state: { 
                        name:name,
                        task: task,
                        description: description,
                        expectations: expectations,
                        model: model,
                        context: context,
                        selectedInDBFiles: selectedInDBFiles,
                        selectedAgents: selectedAgents,
                        cycles: cycles,
                        reportGuidelines: reportGuidelines,
                        method: method,
                        temp: temp,
                        engine: engine,
                        lead: lead,
                        error: error.response.data.error
                    } 
                });
                return
            }
        }
        postReport();
    }, []);
    //what to do for report saving:
    //if not want to be saved, then delete the obj
    return (
        <Container maxWidth="md" sx = {{py:4}}>

            <Alert
                severity="error"
                onClose={() => setError(null)}
                sx={{ mb: 2}}
            >
                {error}
            </Alert>

            {(moveOn !== true) && (

                <Stack spacing={4} alignItems="center" justifyContent="center" sx={{ minHeight: '100vh', p: 3 }}>
                    <Paper elevation={3} sx = {{ p: 4, borderRadius: 4, width: '100%'}}>
                    <Typography variant="h6" gutterBottom>
                        Report status
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Typography variant="h6" gutterBottom>
                        <strong>Chosen Team:</strong> 
                    </Typography>
                    <Box sx = {{ mt: 1}}>
                        {(curGenerating === "CHOOSETEAM" || curGenerating === "" || curGenerating === "SETUP") && (
                            <span className="loading">Generating</span>
                        )}
                        {chosenTeam.map((teamMember, idx) => {
                            const goal = agentGoals.find((entry) => entry.agent === teamMember)?.goal;
                            return (
                                <Box key={idx}>
                                    <Typography variant="body2">
                                        {teamMember}
                                        {goal && (
                                            <span style={{ marginLeft: '0.5rem'}}>({goal})</span>
                                        )}
                                        {(curGenerating === teamMember) && (
                                            <span className="loading">Generating</span>
                                        )}
                                    </Typography>
                                </Box>
                            )
                        })}
                        
                    </Box>
                    <Box sx = {{ mt: 2}}>
                        <Typography variant="body1" gutterBottom>
                            <strong>Guiding Questions:</strong> 
                                {(curGenerating === "GUIDINGQ") && (
                                    <span className="loading">Generating</span>
                                )}
                                {guidingQ.map((question, ind) => (
                                    <Typography key={ind}>{question}</Typography>
                                ))}
                        </Typography>
                    </Box>
                    </Paper>

                    <Paper elevation={3} sx = {{ p: 4, borderRadius: 4, width : '100%'}}>
                        <Typography variant="h6" gutterBottom>
                            Chat Log    
                        </Typography>
                        <Divider sx = {{ mb: 2}} />
                        <Box sx={{ maxHeight: 400, overflowY: 'auto', p: 2, backgroundColor: '#f3f3f3', borderRadius: 2 }}>
                            <Typography variant="body2" gutterBottom>
                            <strong>Cycle:</strong> {cycle}
                            </Typography>

                            {chatLog.map((entry, index) => (
                            <Box
                                key={index}
                                sx={{
                                alignSelf: entry.speaker === "l" ? 'flex-end' : 'flex-start',
                                backgroundColor: entry.speaker === "l" ? '#1976d2' : '#e0e0e0',
                                color: entry.speaker === "l" ? '#fff' : '#000',
                                p: 2,
                                borderRadius: 2,
                                maxWidth: '80%',
                                mb: 1,
                                }}
                            >
                                <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                                {entry.speaker}:
                                </Typography>
                                <Typography variant="body2">{entry.text}</Typography>
                            </Box>
                            ))}

                            {curGenerating === "STARTCONVO" && <span className="loading">Generating</span>}

                            
                            <div ref={bottomRef}></div>
                        </Box>
                        {isLoading !== true && (
                            <Button variant="contained" color="error" onClick={getNewReport} sx={{ mt: 2 }}>
                                View final report
                            </Button>
                        )}
                    </Paper>
                </Stack>
            )}
            {report != null && moveOn === true && (
                <Stack spacing={2} alignItems="flex-start">
                    <Link href={report.output} target="_blank" underline="hover" color="primary">
                    View report
                    </Link>
                    <Link href={report.chat_log} target="_blank" underline="hover" color="primary">
                    View chatlog
                    </Link>
                    <Button variant="contained" color="error" onClick={() => deleteReport(name)} disabled={deleteDisabled}>
                    Discard report
                    </Button>
                    <Button variant="contained" color="success" onClick={() => saveReportMemory(name)} disabled={savedToLead}>
                    Save report in lead memory
                    </Button>
                </Stack>
            )}
        </Container>
    );
    //const [selectedFile, setSelectedFile] = useState<File | null>(null);
    
}
export default ReportOutputPage;