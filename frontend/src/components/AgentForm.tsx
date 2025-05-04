import MultiselectPapers from './MultiselectPapers';

import {
    List,
    ListItem,
    ListItemText,
    IconButton,
    Tooltip,
    TextField,
    Button,
    Box,
    Typography,
    InputLabel,
  } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

interface AgentFormProps {
    name: string;
    role: string;
    expertise: string
    uploadedFiles : File[]
    onRemoveFile: (index: number) => void;
    onNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onRoleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onExpertiseChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSelectFileChange: (names: string[]) => void;
    onSubmit: (e: React.FormEvent) => void;
}
function AgentForm({name, role, expertise, uploadedFiles, onRemoveFile, onNameChange, onRoleChange, onExpertiseChange,onSelectFileChange, onFileChange, onSubmit}: AgentFormProps) {    

    return (
        <Box>
            <Box position="relative" width="100%" display="flex" gap={1}>
                <Typography variant="h5" color="primary" gutterBottom sx={{ paddingBottom: 0 }}>Create agent</Typography>
                <Tooltip title={
                    <Box>
                    <Typography variant="subtitle2" gutterBottom>
                      Agents represent industry professionals with specific roles and expertise.
                    </Typography>
                    <Typography variant="body2">
                      You can either:
                      <br />• <strong>Just enter details</strong> like role or expertise to guide responses,
                      <br />• <strong>Or upload papers</strong> that become part of the agent’s private knowledge base.
                      <br />
                      <br />You can do both — the more context you provide, the better the agent will perform.
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
                
                <Box position="relative" width="100%">
                    <TextField
                        label="Role"
                        variant="outlined"
                        value={role}
                        onChange={onRoleChange}
                        required
                        fullWidth
                    />
                    <Tooltip title="The position this agent will play in conversations. ie, Biologist, Researcher, etc. The more specific the better!">
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
                        label="Expertise"
                        variant="outlined"
                        value={expertise}
                        onChange={onExpertiseChange}
                        required
                        fullWidth
                    />
                    <Tooltip title="The specific area of expertise. Ie, if the role were biologist, expertise could be molecular biology">
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
                        onChange={onFileChange}
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

                <Button variant="contained" color="primary" type="submit">
                    Submit
                </Button>
            </Box>
        </Box>
            
    )
}

export default AgentForm; 