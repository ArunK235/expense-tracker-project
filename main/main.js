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



window.addEventListener('DOMContentLoaded',()=>{
    const token= localStorage.getItem('token')
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