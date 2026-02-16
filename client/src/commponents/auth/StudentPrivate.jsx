import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";


const StudentPrivate = ({children, type})=>{
    const {token} = useSelector((state) => state.auth);
    const {user} = useSelector((state) => state.profile);
    if(token !== null && user.accountType === type){
        return children;
    }
    else{
        return <Navigate to="/login" />;
    }
}


export default StudentPrivate;
