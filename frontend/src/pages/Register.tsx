import {useState, useEffect } from "react"
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { TextField, Alert, Button,Paper, Box, Typography, Container, Link } from '@mui/material';


function Register () {
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password1: "",
        password2: "",
    })
    const handleNav = () => {
        navigate('/login');
    }
    const [loginData, setLoginData] = useState({
        email: "",
        password: "",
    })
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
        console.log("Full URL:", window.location.href);
        console.log("Query params:", window.location.search);
    }, []);
    
    useEffect(() => {
        setLoginData({
            email: formData.email,
            password: formData.password1
        })
    },[formData]);

    const handleSubmit = async (e:any) => {
        e.preventDefault();
        if (isLoading) {
            return 
        }
        setIsLoading(true)
        setError(null);
        console.log("starting register response")
        axios({
            url: `${import.meta.env.VITE_BACKEND_URL}/api/register/`,
            method: "POST",
            data: formData
        })
        .then(response => {
            console.log('New user registered:', response.data) 

            const loginAfterRegister = async () => {
                try{
                    const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/login/`, loginData)
                    console.log("Success login!", response.data)
                    localStorage.setItem("accessToken", response.data.tokens.access);
                    localStorage.setItem("refreshToken", response.data.tokens.refresh)
                    localStorage.setItem("showInstr", "true");
                    navigate('/');
                    window.location.reload();
                    
                }
                catch(error){
                console.log("error catching")
                handleAxiosError(error)
                console.error(error)
                }
            }
            loginAfterRegister();
        })
        .catch((Error) => {
            console.log("error catching")
            handleAxiosError(Error)
            console.error(Error)
        })
        
        setIsLoading(false)
        
        

    }
    return (
        <Container component="main" maxWidth="xs" sx={{paddingTop: 2}}>
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
                        fullWidth
                        sx={{ mt: 2 }}
                        disabled={isLoading}
                        onClick={handleSubmit}
                    >
                        Register
                    </Button>
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
        </Container>
        
    )
}

export default Register;