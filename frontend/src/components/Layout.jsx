import { Outlet, useNavigate } from "react-router-dom";
import {
    AppBar,
    Toolbar,
    Typography,
    Box,
    Button,
    Chip,
} from "@mui/material";

const Layout = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        navigate("/login");
    };

    return (
        <Box sx={{ flexGrow: 1 }}>
            {/* Dark Green AppBar to match your image */}
            <AppBar 
                position="static" 
                sx={{ backgroundColor: "#1a534a", padding: "0 10px" }}
            >
                <Toolbar>
                    {/* Brand Name and Admin Badge */}
                    <Typography variant="h6" component="div" sx={{ fontWeight: "bold" }}>
                        Clinic Queue
                    </Typography>
                    
                    <Chip 
                        label="admin" 
                        size="small" 
                        sx={{ 
                            ml: 1, 
                            backgroundColor: "rgba(255,255,255,0.2)", 
                            color: "white",
                            fontSize: "0.7rem" 
                        }} 
                    />

                    {/* Spacer to push nav items to the right */}
                    <Box sx={{ flexGrow: 1 }} />

                    {/* Navigation Items */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Button 
                            color="inherit" 
                            onClick={() => navigate("/")}
                            sx={{ textTransform: "none" }}
                        >
                            My Clinic
                        </Button>
                        <Button 
                            color="inherit" 
                            onClick={() => navigate("/users")}
                            sx={{ textTransform: "none" }}
                        >
                            Users
                        </Button>
                        <Button 
                            variant="outlined" 
                            color="inherit"
                            onClick={handleLogout}
                            sx={{ 
                                textTransform: "none",
                                borderColor: "rgba(255,255,255,0.5)",
                                "&:hover": { borderColor: "white" }
                            }}
                        >
                            Logout
                        </Button>
                    </Box>
                </Toolbar>
            </AppBar>

            {/* Main Content Area */}
            <Box component="main" sx={{ p: 4 }}>
                <Outlet />
            </Box>
        </Box>
    );
};

export default Layout;