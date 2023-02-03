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
            showUserExpense(expenseDetails);
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

window.addEventListener('DOMContentLoaded',async ()=>{
    try{
        const rowValue = localStorage.getItem('expPerPage')
        const token= localStorage.getItem('token')
        const decodetoken= parseJwt(token);
        console.log(decodetoken);
        let page = 1
        let expPerPage = rowValue
        const ispremiumuser= decodetoken.ispremiumuser
        if(ispremiumuser){
            showPremiumuser();
            showLeaderBoard();
            download();
        }
        const expenseData = await axios.get(
            `http://localhost:3000/expense/get/expensePerPage?page=${page}&expPerPage=${expPerPage}`,
            { headers: { Authorization: token } }
          );
               
          showUserExpense(expenseData);
        showPagination(expenseData.data)
    }
    catch(err){
        console.log(err);
    }
    
})
function showPagination({currentPage,hasNextPage,nextPage,hasPreviousPage,previousPage,lastPage,firstPage}){
    console.log(currentPage,hasNextPage,nextPage,hasPreviousPage,previousPage,lastPage,firstPage)
    const grandParent = document.getElementById('data')
    const midParent = document.getElementById('list')
    const ParentElement = document.getElementById('pagination')
    currentPage = Number(currentPage)
    if(hasPreviousPage){
      const btn1 = document.createElement('button')
      btn1.className = 'pageButton'
      btn1.innerHTML = '<<'
      btn1.addEventListener('click',()=>getItems(previousPage))
      ParentElement.appendChild(btn1)
      midParent.appendChild(btn1)
    }
  
    if(hasNextPage){
      const btn2 = document.createElement('button')
      btn2.className = 'pageButton'
      btn2.innerHTML = '>>'
      btn2.addEventListener('click',()=>getItems(nextPage))
      ParentElement.appendChild(btn2)
      midParent.appendChild(btn2)
    }
    grandParent.appendChild(midParent)
}
async function getItems(page){
    console.log('entered in get items')
    
    // console.log(expPerPage)
    try{
      const expPerPage = localStorage.getItem('expPerPage')
      const token= localStorage.getItem('token');
      //console.log(token,expPerPage,"kkk")
      const parentSection = document.getElementById('list')
      const ParentElement = document.getElementById('pagination')
      const expenseData = await axios.get(
        `http://localhost:3000/expense/get/expensePerPage?page=${page}&expPerPage=${expPerPage}`,
        { headers: { Authorization: token } }
      ); 
        console.log('after expense data')
      parentSection.innerHTML=''
      ParentElement.innerHTML=''
      console.log(expenseData.data)
      showUserExpense(expenseData)
      showPagination(expenseData.data)
    
    }
    catch(err){
      console.log(err)
    }
    
  }

/*function ShowExpenseOnScreen(expense){
    const parentElement=document.getElementById('list of expenses');
    const expenseElemId = `expense-${expense.id}`;
    
    parentElement.innerHTML +=`<li id=${expenseElemId}> ${expense.amount}-${expense.description}-${expense.category}
                              <button onclick='deleteExpense(event , ${expense.id})'>Delete Expense</button></li>`
                
                        
}*/

async function showUserExpense(expenseData) {
    const parentElement = document.getElementById("list");
    try {
      let data = expenseData.data.allExpense;
      // parentElement.innerHTML = "";
      data.forEach((expense) => {
        const li = document.createElement("li");
        li.id = `${expense.id}`;
        li.className = "litext";
        li.appendChild(
          document.createTextNode(`${expense.amount}- ${expense.description}-${expense.category}`)
        );
        parentElement.appendChild(li);
  
        let delBtn = document.createElement("button");
        delBtn.id = "delete";
        delBtn.className = "libtn";
        delBtn.appendChild(document.createTextNode("delete"));
        delBtn.onclick = function () {
            deleteExpense(expense.id);
        };
        li.appendChild(delBtn);
        parentElement.appendChild(li);
      });
    } catch (err) {
      console.log(err);
    }
  }

async function deleteExpense(expenseid){
    try{
        const token= localStorage.getItem('token')
        const delexp = await axios.delete(`http://localhost:3000/expense/deleteExpensive/${expenseid}`,{headers:{'Authorization': token}})
        if(delexp.status=== 200){
            let ul = document.getElementById("list");
            let li = document.getElementById(expenseid);
            ul.removeChild(li);
        }
    }
    catch(err){
        console.log(err);
    }
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
    const inputElement= document.createElement('input')
    inputElement.type='button'
    inputElement.value='Download'
    inputElement.onclick= async()=>{
        const token = localStorage.getItem('token')
        var response =await axios.get('http://localhost:3000/user/download', { headers: {"Authorization" : token} })
        console.log(response)
        if(response.status === 200){
            var a = document.createElement("a");
            a.href = response.data.fileURL;
            a.download = 'myexpense.csv';
            a.click();
        } else {
            throw new Error(response.data.message)
        }

    }
    document.getElementById('message').appendChild(inputElement);
}
function rowChange(e){
    // e.preventDefault()
    console.log(e.target.value,'value')
    console.log(typeof(e.target.value))
    const rowValue = Number(e.target.value)
    console.log(typeof(rowValue))
    localStorage.setItem("expPerPage", rowValue)
    location.reload()
}
