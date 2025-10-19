import {useState, useEffect } from "react"
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { TextField, Alert, Button,Paper, CircularProgress, Box, Typography, Container, Link } from '@mui/material';


function Register () {
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate();
    const [displayVerify, setDisplayVerify] = useState(false)
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password1: "",
        password2: "",
    })
    const handleNav = () => {
        navigate('/login');
    }
    
    const handleChange = (e:any) => {
        setFormData({
            ...formData,
            [e.target.name]:e.target.value
        })
    }
    const handleAxiosError = (error:any) => {
        if (error.message === "Network Error") {
            setError("Network error: backend is down.")
        }
        else if (error.response && error.response.data) {
            const firstErrorField:any = Object.keys(error.response.data)[0];
            const firstError:any = Object.values(error.response.data).flat()[0]; 
            setError(firstErrorField + ":" + firstError)
          } 
        else {
            setError("Unknown error")
        }
    }
    useEffect(() => {
        //console.log("Full URL:", window.location.href);
        //console.log("Query params:", window.location.search);
    }, []);
    

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        if (isLoading) return;

        setIsLoading(true);
        setError(null);

        try {
            //register
            console.log("starting register response");
            await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/register/`, formData);

            //verify
            setDisplayVerify(true)
            /*

            //login
            const res = await api.post(`/login/`, loginData);
            localStorage.setItem("accessToken", res.data.tokens.access);
            localStorage.setItem("refreshToken", res.data.tokens.refresh);
            localStorage.setItem("showInstr", "true");
            //Create default agent and lead
            await Promise.all([
                (async () => {
                    const fd = new FormData();
                    fd.append("name", "DefaultAgent");
                    fd.append("role", "You are a jack of all trades.");
                    fd.append("expertise", "Expertise in every subject");
                    const res1 = await api.post("/agents/", fd);
                    console.log("Default agent created:", res1.data);

                    const lead = {
                        name: "DefaultLead",
                        description: "A default lead for users to start running conversations with",
                    };
                    const res2 = await api.post("/leads/", lead);
                    console.log("Default lead created:", res2.data);

                    navigate("/");
                    window.location.reload();
                })(),
            ]);*/
            
        } catch (err) {
            console.error("Error during registration flow:", err);
            handleAxiosError(err);
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <Container component="main" maxWidth="xs" sx={{paddingTop: 2}}>
            {displayVerify ? (
                <Paper
                    sx={{
                        borderRadius: 0,
                        padding: 3,
                        textAlign: "center",
                    }}
                >
                    <Typography variant="h6">
                        Check your email for a verification link from report-gen03@gmail.com
                    </Typography>
                </Paper>
            ) : (
            <Paper
                sx={{
                    borderRadius: 0,
                    paddingTop: 2,
                    paddingLeft: 2,
                    paddingRight: 2,
                    paddingBottom: 2,
                }}
                >
                {error && (
                    <Alert
                        severity="error"
                        onClose={() => setError(null)}
                        sx={{ mb: 2}}
                    >
                        {error}
                    </Alert>
                )}
                <Typography variant="h5">Register</Typography>
                <Box component="form" sx={{ mt: 2 }}>
                    <TextField
                        label="Username"
                        name="username"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={formData.username}
                        onChange={handleChange}
                    />
                    <TextField
                        label="Email Address"
                        name="email"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={formData.email}
                        onChange={handleChange}
                    />
                    <TextField
                        label="Password"
                        name="password1"
                        variant="outlined"
                        type="password"
                        fullWidth
                        margin="normal"
                        value={formData.password1}
                        onChange={handleChange}
                    />
                    <TextField
                        label="Confirm password"
                        name="password2"
                        variant="outlined"
                        type="password"
                        fullWidth
                        margin="normal"
                        value={formData.password2}
                        onChange={handleChange}
                    />
                    <Button
                        variant="contained"
                        type="submit"
                        fullWidth
                        sx={{ mt: 2 }}
                        disabled={isLoading}
                        onClick={handleSubmit}
                    >
                        Register
                    </Button>
                    {isLoading && (
                        <Box sx={{ mt: 3 }}>
                            <CircularProgress />
                        </Box>
                    )}
                    <Link
                        component="button"
                        variant="body2"
                        onClick={handleNav}
                        sx={{
                            display: 'block',
                            textAlign: 'center',
                            color: 'primary.main',
                            textDecoration: 'none',
                            fontSize: '14px',
                            marginTop: 2,
                        }}
                    >
                        Login
                    </Link>
                </Box>
            </Paper>
            )}
        </Container>
        
    )
}

export default Register;