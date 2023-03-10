async function login(e){
    try{
        e.preventDefault();
        const logInDetails={
            
            email: e.target.email.value,
            password: e.target.password.value
        }
        console.log(logInDetails);
        const response= await axios.post('http://localhost:3000/user/login', logInDetails)
        if(response.status === 200){
            alert(response.data.message)
        }
        else{
            throw new Error('failed to login')
        }
    }
    catch(err){
        document.body.innerHTML=`<div style='color:red;'>${err}</div>`
    }
}

