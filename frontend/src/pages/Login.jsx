import {
    Alert,
    Box,
    Button,
    Container,
    Paper,
    TextField,
    Typography,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginService } from "../services/authService"

function LoginPage() {
    const [data, setData] = useState({ email: "", password: "" });
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await loginService(data);
        if(response.error) {
            setError(response.error);
        }
        else {
            localStorage.setItem("token",response.token);
            navigate("/");
        }
    };

    return (
        <Container maxWidth="sm">
            <Box
                sx={{
                    backgroundColor: "#1a534a",
                    minHeight: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: 0,
                }}
            >
                <Paper elevation={3} sx={{
                    padding: 4,
                    width: "100%",
                    maxWidth: 400,
                    borderRadius: 3,
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                }}>
                    <Typography component="h1" variant="h4" align="center" gutterBottom>
                        Clinic Management System
                    </Typography>
                    <Typography
                        component="h2"
                        variant="h6"
                        align="center"
                        color="textSecondary"
                        gutterBottom
                    >
                        Sign In
                    </Typography>
                    {error && (
                        <Alert severity="error" sx={{ mt: 2 }}>
                            {error}
                        </Alert>
                    )}
                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            onChange={(e) => setData({ ...data, email: e.target.value })}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            onChange={(e) => setData({ ...data, password: e.target.value })}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Sign In
                        </Button>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
}

export default LoginPage;
