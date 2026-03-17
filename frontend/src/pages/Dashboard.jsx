import react from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
function DashboardPage()
{
    const navigate = useNavigate();
    useEffect (() => {
        if (!localStorage.getItem("token")){
            navigate("/login");
        }
    }, [])
   return (
      <>
            <h1>Dashboard</h1>
      </>
   )
}

export default DashboardPage;

