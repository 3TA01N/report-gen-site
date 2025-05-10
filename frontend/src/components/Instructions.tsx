import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css"; // Ensure Bootstrap is imported
import "bootstrap/dist/js/bootstrap.bundle.min"; // Import Bootstrap JS for modal functionality
import { Modal, Box, Typography, IconButton, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';


interface InstructionsProps {
    startingShow: boolean; 
}

const Instructions: React.FC<InstructionsProps> = ({ startingShow }) => {
    const [show, setShow] = useState(startingShow);

    const closeInstr = () => {
      localStorage.removeItem("showInstr");
      setShow(false)
    }
    
    return (
      <>
        <Typography
          variant="body2"
          sx={{
            textDecoration: 'underline',
            color: 'primary.main',
            cursor: 'pointer',
            display: 'inline-block',
            marginTop: 2,
          }}
          onClick={() => setShow(true)}
        >
          Confused? Instructions
        </Typography>

        <Modal open={show} onClose={closeInstr}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '80%',
              maxHeight: '90vh',
              overflowY: 'auto',
              bgcolor: 'background.paper',
              borderRadius: 2,
              boxShadow: 24,
              p: 4,
            }}
          >
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h6">Instructions</Typography>
              <IconButton onClick={closeInstr}>
                <CloseIcon />
              </IconButton>
            </Box>

            <Box mt={2}>
              <Typography variant="h5" gutterBottom>
                Welcome to Agent based Report Generation
              </Typography>
              <Typography paragraph>
                This site provides an interface for generating reports through combining AI agents and Retrieval Augmented Generation.
              </Typography>

              <Typography variant="h6" gutterBottom>Step 1: Getting Started</Typography>
              <Typography paragraph>
                Begin by navigating to "Leads" in the navbar above, and creating a lead. Leads choose teams, organize meetings, and keep track of previous meeting data.
              </Typography>

              <Typography variant="h6" gutterBottom>Step 2: Building a team of potential agents</Typography>
              <Typography paragraph>
                Before generating a report, each lead chooses a team of agents. Navigate to Agents to create specialized agent for your needs.
              </Typography>

              <Typography variant="h6" gutterBottom>Step 3: Creating a report</Typography>
              <Typography paragraph>
                Once you've created a lead and agents, it's time to generate a report. If youre confused on what to enter, click on the question mark icon next to each field for information.
              </Typography>
            </Box>

            <Box display="flex" justifyContent="flex-end" mt={3}>
              <Button onClick={closeInstr} variant="outlined">Close</Button>
            </Box>
          </Box>
        </Modal>
      </>
    );
  };

  
  export default Instructions;