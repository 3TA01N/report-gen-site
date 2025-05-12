import {useState} from "react"
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { TextField, Alert, Button,Paper, Box, Typography, Container, Link, CircularProgress } from '@mui/material';


function Login () {
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    })
    const handleChange = (e:any) => {
        setFormData((prevData) => ({
            ...prevData,
            [e.target.name]: e.target.value
        }));
    }
    const handleAxiosError = (error:any) => {
        //check if network error
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
    const handleNav = () => {
        navigate('/register');
    }
    const handleSubmit = async (e:any) => {
      e.preventDefault();
          if(isLoading){
              return
          }
    
          setIsLoading(true);
          setError(null);
          try{
                //console.log(formData)
                const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/login/`, formData)
                //console.log(`${import.meta.env.VITE_BACKEND_URL}/api/login/`)
                console.log("Success!", response.data)
                localStorage.setItem("accessToken", response.data.tokens.access);
                localStorage.setItem("refreshToken", response.data.tokens.refresh)
                const decoded = JSON.parse(atob(response.data.tokens.access.split('.')[1])); // Decode JWT payload
                const expirationTime = decoded.exp * 1000; // Convert from seconds to milliseconds
                localStorage.setItem('tokenExpiration', String(expirationTime)); // Store expiration time

                navigate('/');
                window.location.reload();
              
          }
          catch(error){
            console.log("error catching")
            handleAxiosError(error)
            console.error(error)
          }
          finally{
              setIsLoading(false)
          }
    
    };
    
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
                <Typography variant="h5">Sign In</Typography>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
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
                        name="password"
                        variant="outlined"
                        type="password"
                        fullWidth
                        margin="normal"
                        value={formData.password}
                        onChange={handleChange}
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        disabled={isLoading}
                        sx={{ mt: 2 }}
                        onClick={handleSubmit}
                    >
                        Sign In
                    </Button>
                    {isLoading && (
                        <Box sx={{ mt: 3 }}>
                            <CircularProgress />
                        </Box>
                    )}
                    
                </Box>
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
                    Don’t have an account? Register
                </Link>
            </Paper>
        </Container>
    )
}

export default Login;