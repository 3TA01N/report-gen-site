import axios from "axios";
import {useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom";
import {Container, Paper, Typography} from '@mui/material';
function VerifyEmail() {
    const { uid, token } = useParams();
    const [dispMessage, setDispMessage] = useState("")
    const navigate = useNavigate();

    useEffect(() => {
        const verifyUser = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/verify/${uid}/${token}/`);
                setDispMessage(response.data.message)
                localStorage.setItem("access_token", response.data.access)
                localStorage.setItem("refresh_token", response.data.refresh)

                setTimeout(() => {
                    navigate("/");
                    }, 1500);
            }
            catch (err: any) {
                setDispMessage(err.response.data.error)
            }
        }
        verifyUser()
    }, []);
    return (
        <Container component="main" maxWidth="xs" sx={{paddingTop: 2}}>
            <Paper
                    sx={{
                        borderRadius: 0,
                        padding: 3,
                        textAlign: "center",
                    }}
                >
                    <Typography variant="h6">
                        {dispMessage}
                    </Typography>
                
                </Paper>
        </Container>
    )
}

export default VerifyEmail;