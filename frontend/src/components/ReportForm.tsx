import React, { useState, useEffect } from 'react';
import MultiselectPapers from './MultiselectPapers';
import MultiselectAgents from './MultiselectAgents';
import api from '../components/api'

import {
    List,
    ListItem,
    ListItemText,
    FormControl,
    Select,
    MenuItem,
    Tooltip,
    IconButton,
    TextField,
    Button,
    SelectChangeEvent,
    Box,
    Typography,
    InputLabel,
  } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';


interface ReportFormProps {
    
    name: string;//char field
    task: string;//char field
    expectations: string;// char field
    reportGuidelines: string;//char field
    description : string;
    uploadedFiles : File[]//for context
    cycles: string;
    method: string; //from dropdown
    temperature: string; //bounded
    engine: string; //dropdown
    model: string; //dropdown
    lead: string; //dropdown
    
    onSelectFileChange: (names: string[]) => void;
    onSelectAgentChange: (names: string[]) => void;
    onNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onTaskChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onExpectationsChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onReportGuidelinesChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onDescriptionChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onFilesChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onCyclesChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onMethodChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    onTemperatureChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onEngineChange: (e: SelectChangeEvent<string>) => void;
    onModelChange: (e: SelectChangeEvent<string>) => void;
    onLeadChange: (e: SelectChangeEvent<string>) => void;
    onSubmit: (e: React.FormEvent) => void;
    onRemoveFile: (index: number) => void;
}
function ReportForm({name, task, onSelectFileChange, onRemoveFile, onSelectAgentChange, expectations, description,reportGuidelines, uploadedFiles, cycles, temperature, onFilesChange,onNameChange, onTaskChange, onLeadChange,onCyclesChange, onExpectationsChange, onEngineChange, onReportGuidelinesChange, onModelChange, onDescriptionChange, onTemperatureChange,onSubmit}: ReportFormProps) {
    const [leadsList, setLeadsList] = useState<any[]>([])
    useEffect(() => {
        const getLeads = async() => {
            try {
                const response = await api.get('/leads/');
                setLeadsList(response.data)
            }
            catch(error: any) {
                console.log('Error fetching team leads', error.response)
            }
        }
        getLeads()
        
    },[])
    
    
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
                <Box position="relative" width="100%">
                    <TextField
                        label="Description"
                        variant="outlined"
                        value={description}
                        onChange={onDescriptionChange}
                        required
                        fullWidth
                    />
                    <Tooltip title="Description for this report(only for your convenience, not passed in to the report generation convo)">
                        <IconButton
                        size="small"
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            right: 8,
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
                <Box position="relative" width="100%">
                    <TextField
                        label="Task"
                        variant="outlined"
                        value={task}
                        onChange={onTaskChange}
                        required
                        fullWidth
                    />
                    <Tooltip title="The main task that will be answered in the report. Be as specific as possible.">
                        <IconButton
                        size="small"
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            right: 8,
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

                <Box position="relative" width="100%">
                    <TextField
                        label="Expectations"
                        variant="outlined"
                        value={expectations}
                        onChange={onExpectationsChange}
                        
                        fullWidth
                    />
                    <Tooltip title="Expectations for the final report. Ie, 'Must discuss BLANK', or 'Must mention BLANK'">
                        <IconButton
                        size="small"
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            right: 8,
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
                
                <Box position="relative" width="100%">
                    <TextField
                        label="Report Guidelines"
                        variant="outlined"
                        value={reportGuidelines}
                        onChange={onReportGuidelinesChange}
                        
                        fullWidth
                    />
                    <Tooltip title="Guidelines for the report. For example, 'Report must be titled BLANK', or 'Report must be BLANK words long'.">
                        <IconButton
                        size="small"
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            right: 8,
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
                <Box>
                <Box position="relative" width="100%" display="flex" gap={1}>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                        Choose Potential Agents(or leave empty to allow choosing all)
                    </Typography>
                    <Tooltip title={
                        <Box>
                        <Typography variant="subtitle2" gutterBottom>
                            Choose the potential agents you'd want answering this question(if confused about agents, go to agents page in top navbar). The lead will take into consideration each of the agent's expertises and the task above when choosing a team to discuss the task. Not all agents selected here are guaranteed to be part of the team.
                        </Typography>
                    </Box>
                    }>
                        <IconButton
                        size="small"
                        sx={{
                            //position: 'absolute',
                            top: '50%',
                            right: 8,
                            marginTop: '13px',
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
                    <MultiselectAgents passNamesToParent={onSelectAgentChange}/>
                </Box>
                <Box>
                    <Box position="relative" width="100%" display="flex" gap={1}>
                        <Typography variant="body1" sx={{ mb: 1 }}>
                            Choose from existing papers:
                        </Typography>
                        <Tooltip title={
                            <Box>
                            <Typography variant="subtitle2" gutterBottom>
                                Choose from existing papers(ie papers that have been uploaded to the site from previous reports or agents) to be passed into the conversation as relevant context. Ie, domain specific papers to provide helpful information, or papers that you'd want to center your discussion around
                            </Typography>
                        </Box>
                        }>
                            <IconButton
                            size="small"
                            sx={{
                                //position: 'absolute',
                                top: '50%',
                                right: 8,
                                marginTop: '13px',
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
                    <MultiselectPapers passNamesToParent={onSelectFileChange}/>
                </Box>
                
                <Box>
                    <InputLabel htmlFor="formFile" sx={{ mb: 1 }}>
                        Or Upload new paper(s) as PDF
                    </InputLabel>
                    <input
                        type="file"
                        id="formFile"
                        multiple
                        onChange={onFilesChange}
                        style={{ color: 'white' }}
                    />
                </Box>
                
                {uploadedFiles.length > 0 && (
                    <Box>
                        <Typography variant="subtitle1" sx={{ mt: 2 }}>
                        Selected Files:
                        </Typography>

                        <List dense>
                        {uploadedFiles.map((file, index) => (
                            <ListItem
                            key={index}
                            secondaryAction={
                                <IconButton edge="end" aria-label="delete" onClick={() => onRemoveFile(index)}>
                                <DeleteIcon />
                                </IconButton>
                            }
                            >
                            <ListItemText primary={file.name} />
                            </ListItem>
                        ))}
                        </List>
                    </Box>
                )}
                
                <TextField
                    label="Number of cycles (leave blank for 1, max is 4)"
                    variant="outlined"
                    value={cycles}
                    onChange={onCyclesChange}
                    
                    type="number"
                    fullWidth
                />

                <TextField
                    label="Temperature (leave blank for 0.8)"
                    variant="outlined"
                    value={temperature}
                    onChange={onTemperatureChange}
                    
                    type="number"
                    fullWidth
                />
                {/* Engine Select */}
                <FormControl fullWidth>
                    <InputLabel>Engine (leave blank for openai)</InputLabel>
                    <Select
                    defaultValue=""
                    onChange={onEngineChange}
                    label="Engine (leave blank for openai)"
                    >
                    <MenuItem value="">
                        <em>Choose engine</em>
                    </MenuItem>
                    <MenuItem value="Ollama" disabled>Ollama</MenuItem>
                    <MenuItem value="openai">OpenAI</MenuItem>
                    </Select>
                </FormControl>

                {/* Model Select */}
                <FormControl fullWidth>
                    <InputLabel>Model (leave blank for gpt4o)</InputLabel>
                    <Select
                    defaultValue=""
                    onChange={onModelChange}
                    label="Model (leave blank for gpt4o)"
                    >
                    <MenuItem value="">
                        <em>Choose model</em>
                    </MenuItem>
                    <MenuItem value="mistral" disabled>Ollama: mistral</MenuItem>
                    <MenuItem value="gpt-4o">gpt-4o</MenuItem>
                    </Select>
                </FormControl>

                {/* Lead Select */}
                <FormControl fullWidth required>
                    <InputLabel>Lead</InputLabel>
                    <Select
                    defaultValue=""
                    onChange={onLeadChange}
                    label="Lead"
                    >
                    <MenuItem value="">
                        <em>Choose lead</em>
                    </MenuItem>
                    {leadsList.map((cur_lead) => (
                        <MenuItem key={cur_lead.name} value={cur_lead.name}>
                        {cur_lead.name}
                        </MenuItem>
                    ))}
                    </Select>
                    <Tooltip title="Choose a lead to guide this report(if confused, got to Leads page in top navbar). The lead chosen for this report will optionally use data from any reports it has previously generated, and users will be given the option to save this report within the lead's knowledge base to be used in future reports as well. If you don't want reports to be generated with previous reports info in mind, don't worry too much about which lead you choose.">
                        <IconButton
                        size="small"
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            right: 20,
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
                </FormControl>

            <Button variant="contained" color="primary" type="submit">
                Submit
            </Button>

            </Box>
        </Box>
    )
}

export default ReportForm; 