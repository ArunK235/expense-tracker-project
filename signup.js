async function signUp(e){
    try{
        e.preventdefault();
        console.log(e.target.emsil.value);
        const signUpDetails={
            name: e.target.name.value,
            email: e.target.email.value,
            password: e.target.password.value
        }
        console.log(signUpDetails);
        const response= await axios.post('http://localhost:3000/user/signup', signUpDetails)
        if(response.status === 201){
            window.location.href='../login/login.html';
        }
        else{
            throw new Error('failed to login')
        }
    }
    catch(err){
        document.body.innerHTML=`<div style='color:red;'>${err}</div>`

    }
}
