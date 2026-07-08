
console.log("Retail Billing System");


let cart = [];


const product = [
    { productId: "1", productName: "Samosa", price: 10 },
    { productId: "2", productName: "Burger", price: 50 },
    { productId: "3", productName: "Pizza", price: 100 },
    { productId: "4", productName: "Cold drink", price: 20 }
];


const prf = document.getElementById("product-filter");
const prp = document.getElementById("product-price");
const prq = document.getElementById("product-qty");

const b = document.getElementById("addtocart");

const t = document.getElementById("cart-items-body");

const totalitems = document.getElementById("totalitems");
const subtotal = document.getElementById("subtotal");
const gst = document.getElementById("gst");
const grandtotal = document.getElementById("grandtotal");

const invoiceNo = document.getElementById("invoiceNo");
const currentDate = document.getElementById("currentDate");
const currentTime = document.getElementById("currentTime");

const printBtn = document.getElementById("printBill");
const newBillBtn = document.getElementById("newBill");

const searchBtn = document.getElementById("searchBtn");
const searchInvoice = document.getElementById("searchInvoice");



let invoiceCounter =
    Number(localStorage.getItem("invoiceCounter")) || 1001;

invoiceNo.textContent = "INV" + invoiceCounter;



function updateDateTime() {

    const now = new Date();

    currentDate.textContent = now.toLocaleDateString();

    currentTime.textContent = now.toLocaleTimeString();

}

updateDateTime();

setInterval(updateDateTime,1000);



let invoiceHistory =
    JSON.parse(localStorage.getItem("invoiceHistory")) || [];



if(localStorage.getItem("cart")){

    cart = JSON.parse(localStorage.getItem("cart"));

}



function billCalculate(){

    let st = 0;

    cart.forEach(item=>{

        st += Number(item.Total);

    });

    const tax = st * 0.18;

    totalitems.textContent = cart.length;

    subtotal.textContent = st.toFixed(2);

    gst.textContent = tax.toFixed(2);

    grandtotal.textContent = (st + tax).toFixed(2);

}



function saveCart(){

    localStorage.setItem("cart",JSON.stringify(cart));

}



function loadCart(){

    t.innerHTML = "";

    cart.forEach((item)=>{

        const row = t.insertRow();

        row.setAttribute("data-id",item.Id);

        row.insertCell(0).textContent = item.ProductName;
        row.insertCell(1).textContent = item.Price;
        row.insertCell(2).textContent = item.Qty;
        row.insertCell(3).textContent = item.Total;

        row.insertCell(4).innerHTML =
        `<button class="db">❌</button>`;

    });

    billCalculate();

}

loadCart();


function getData(val){

    const products = product.filter((data)=>data.productId===val);

    if(products.length<=0){

        alert("Invalid Product ID");
        return;

    }

    prf.value = products[0].productName;
    prp.value = products[0].price;

    prq.focus();

}




function addNewRow(productName,price,qty){

    const uniqueId = Date.now().toString();

    const total = (price*qty).toFixed(2);

    const item={

        Id:uniqueId,
        ProductName:productName,
        Price:Number(price),
        Qty:Number(qty),
        Total:total

    };

    cart.push(item);

    saveCart();

    loadCart();

}




prf.addEventListener("keydown",function(event){

    if(event.key==="Enter" && event.target.value!==""){

        getData(event.target.value);

    }

});




b.addEventListener("click",()=>{

    if(prf.value==="" || prp.value==="" || prq.value===""){

        alert("Please Fill All Fields");

        return;

    }

    addNewRow(

        prf.value,
        prp.value,
        prq.value

    );

    prf.value="";
    prp.value="";
    prq.value="";

    prf.focus();

});




t.addEventListener("click",function(event){

    if(event.target.classList.contains("db")){

        const row = event.target.closest("tr");

        const id = row.getAttribute("data-id");

        cart = cart.filter(item=>item.Id!==id);

        saveCart();

        loadCart();

    }

});



printBtn.addEventListener("click",()=>{

    if(cart.length===0){

        alert("Cart is Empty.");
        return;
    }

    const bill={

        invoice:"INV"+invoiceCounter,

        date:currentDate.textContent,

        time:currentTime.textContent,

        items:[...cart],

        totalItems:cart.length,

        subtotal:subtotal.textContent,

        gst:gst.textContent,

        grandTotal:grandtotal.textContent

    };

    invoiceHistory.push(bill);

    localStorage.setItem(

        "invoiceHistory",

        JSON.stringify(invoiceHistory)

    );

    window.print();

});




newBillBtn.addEventListener("click",()=>{

    if(cart.length!==0){

        if(!confirm("Start New Bill?")){

            return;
        }

    }

    cart=[];

    saveCart();

    loadCart();

    invoiceCounter++;

    localStorage.setItem(

        "invoiceCounter",

        invoiceCounter

    );

    invoiceNo.textContent="INV"+invoiceCounter;

});





searchBtn.addEventListener("click",()=>{

    const search=searchInvoice.value.trim();

    if(search===""){

        alert("Enter Invoice Number");

        return;

    }

    const bill=invoiceHistory.find(

        data=>data.invoice===search

    );

    if(!bill){

        alert("Invoice Not Found");

        return;

    }

    invoiceNo.textContent=bill.invoice;

    currentDate.textContent=bill.date;

    currentTime.textContent=bill.time;

    cart=bill.items;

    saveCart();

    loadCart();

});





searchInvoice.addEventListener("keydown",(e)=>{

    if(e.key==="Enter"){

        searchBtn.click();

    }

});





window.onbeforeprint=function(){

    document.querySelector(".product-group").style.display="none";

    document.querySelector(".button-group").style.display="none";

    document.querySelector(".search-invoice").style.display="none";

};





window.onafterprint=function(){

    document.querySelector(".product-group").style.display="grid";

    document.querySelector(".button-group").style.display="flex";

    document.querySelector(".search-invoice").style.display="flex";

};





window.addEventListener("beforeunload",()=>{

    saveCart();

});

const saveBtn=document.getElementById("saveBill");
saveBtn.addEventListener("click",()=>{

    if(cart.length===0){

        alert("Cart is Empty.");
        return;
    }

    const bill={

        invoice:"INV"+invoiceCounter,

        date:currentDate.textContent,

        time:currentTime.textContent,

        items:[...cart],

        totalItems:cart.length,

        subtotal:subtotal.textContent,

        gst:gst.textContent,

        grandTotal:grandtotal.textContent

    };

    invoiceHistory.push(bill);

    localStorage.setItem(
        "invoiceHistory",
        JSON.stringify(invoiceHistory)
    );

    localStorage.setItem(
        "invoiceCounter",
        invoiceCounter
    );

    alert("Bill Saved Successfully.");
});