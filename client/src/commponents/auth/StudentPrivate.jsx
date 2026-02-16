const StudentPrivate = ({children, type})=>{
    const {token} = useSelector((state) => state.auth);
    const {user} = useSelector((state) => state.profile);
    if(token !== null && user.accountType === type){
        return children;
    }
    else{
        return <Navigate to="/notfound" />;
    }
}


export default StudentPrivate;
