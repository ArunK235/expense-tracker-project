async function addExpensive(e){
    try{
        e.preventDefault();
        console.log(e.target.description.value);
        console.log(e.target.amount.value);
        console.log(e.target.category.value);
        const expenseDetails={
            amount: e.target.amount.value,
            description: e.target.description.value,
            category: e.target.category.value
        }
        console.log(expenseDetails);
        const token= localStorage.getItem('token')
        const response= await axios.post('http://localhost:3000/expense/addExpensive', expenseDetails,{headers:{'Authorization': token}})
        if(response.status === 200){
            alert(response.data.message)
            ShowExpenseOnScreen(expenseDetails);
        }
        else{
            throw new Error('failed to login')
        }
    }
    catch(err){
        document.body.innerHTML=`<div style='color:red;'>${err}</div>`
    }
}
function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}
function showPremiumuser(){
    document.getElementById('rzp-button').style.visibility='hidden';
    document.getElementById('message').innerHTML='You are a Premium User'; 
}

window.addEventListener('DOMContentLoaded',()=>{
    const token= localStorage.getItem('token')
    const decodetoken= parseJwt(token);
    console.log(decodetoken);
    const ispremiumuser= decodetoken.ispremiumuser
    if(ispremiumuser){
        showPremiumuser();
        showLeaderBoard();
    }
    axios.get('http://localhost:3000/expense/getExpensive',{headers:{'Authorization': token}})
    .then((response)=>{
        response.data.expense.forEach(expense =>{
            
            ShowExpenseOnScreen(expense);
        })
        
    })
    .catch(err =>console.log(err))
})

function ShowExpenseOnScreen(expense){
    const parentElement=document.getElementById('list of expenses');
    const expenseElemId = `expense-${expense.id}`;
    
    parentElement.innerHTML +=`<li id=${expenseElemId}> ${expense.amount}-${expense.description}-${expense.category}
                              <button onclick='deleteExpense(event , ${expense.id})'>Delete Expense</button></li>`
                
                        
}
async function deleteExpense(e,expenseid){
    const token= localStorage.getItem('token')
    await axios.delete(`http://localhost:3000/expense/deleteExpensive/${expenseid}`,{headers:{'Authorization': token}})
    .then(() =>{
        removeExpenseFromScreen(expenseid);
    })
    .catch(err =>console.log(err));
}
function removeExpenseFromScreen(expenseid){
    const expenseElemId = `expense-${expenseid}`;
    document.getElementById(expenseElemId).remove();
}


document.getElementById('rzp-button').onclick= async function(e){
    const token= localStorage.getItem('token')
    
    const response= await axios.get('http://localhost:3000/purchase/premiummembership',{headers:{'Authorization': token}})
    console.log(response);
    var options= {
        "key": response.data.key_id,
        "order_id": response.data.order.id,
        "handler": async function(response){
            await axios.post("http://localhost:3000/purchase/updatetransctionstatus", {
                order_id : options.order_id,
                payment_id : response.razorpay_payment_id,
            } , {headers:{'Authorization': token}} )
            alert('you are a premium user')
            document.getElementById('rzp-button').style.visibility='hidden';
            document.getElementById('message').innerHTML='You are a Premium User';
            localStorage.setItem('token', res.data.token);
            showLeaderBoard();
            download();
        }
    }
    const rzp1= new Razorpay(options);
    rzp1.open();
    e.preventDefault();

    rzp1.on('payment.failed', function(response){
        console.log(response)
        alert('payment failed');
    })
}
function showLeaderBoard(){
    const inputElement= document.createElement('input')
    inputElement.type='button'
    inputElement.value='Show Leaderboard'
    inputElement.onclick= async()=>{
        const token = localStorage.getItem('token')
        const userLeaderBoard=await axios.get('http://localhost:3000/premium/showLeaderBoard',{headers:{'Authorization': token}})
        console.log(userLeaderBoard);

        var LeaderboardElem = document.getElementById('leaderboard');
        LeaderboardElem.innerHTML +='<h1>Leader-Board</h1>'
        userLeaderBoard.data.forEach((userdeatils)=>{
            LeaderboardElem.innerHTML +=`<li>Name -${userdeatils.name} Total Expense -${userdeatils.total_cost || 0}</li>`
        })
    }
    document.getElementById('message').appendChild(inputElement);
}

function download(){
    const token = localStorage.getItem('token')
    axios.get('http://localhost:3000/user/download', { headers: {"Authorization" : token} })
    .then((response) => {
        if(response.status === 201){
            var a = document.createElement("a");
            a.href = response.data.fileUrl;
            a.download = 'myexpense.csv';
            a.click();
        } else {
            throw new Error(response.data.message)
        }

    })
    .catch((err) => {
        console.log(err);
    });
}
