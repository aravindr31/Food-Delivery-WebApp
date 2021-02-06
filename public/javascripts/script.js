//Animation
function show(id) {
  let button = document.getElementById(id);
  button.className = "btn text-center";
  button.style.background = "#57C67F";
  button.style.color = "white";
}
function hide(id) {
  let button = document.getElementById(id);
  button.className = "btn text-center";
  button.style.background = "white";
  button.style.color = "black";
}
//Login Page
const toggleForm = () => {
  const container = document.querySelector(".container");
  container.classList.toggle("active");
};
function addToCart(id) {
  $.ajax({
    url: "/addtocart/" + id,
    method: "get",
    success: (response) => {
      if (response.addStatus) {
        alert("Item Added to cart");
      }
    },
  });
}

// addnewAddress
$("#addNewAddress").submit((e) => {
  e.preventDefault();
  $.ajax({
    url: "/addAddress",
    method: "post",
    data: $("#addNewAddress").serialize(),
    success: (response) => {
      if (response.addStatus) {
        location.href = "/checkout";
      }
    },
  });
});

function goHome() {
  window.location.href = "/";
}

//address toogle
function check(x) {
  let tmp = document.getElementById("tadd");
  let def = document.getElementById("dadd");
  switch (x) {
    case "dAdd":
      tmp.checked = false;
      break;
    case "tAdd":
      def.checked = false;
      break;
  }
  // if (def.checked || tmp.checked) {
  //   document.getElementById("payBtn").disabled = false;
  // } else {
  //   document.getElementById("payBtn").disabled = true;
  // }
}
function paynow(id) {
  let tmp = document.getElementById("tadd");
  let def = document.getElementById("dadd");
  let addressSelector = "";
  if (def.checked == true) {
    addressSelector = "defaultAddress";
  }
  else if (tmp!=null&&tmp.checked == true) {
    addressSelector = "tmpAddress";
  }

  {
    $.ajax({
      url: "/checkout",
      data: {
        user: id,
        address: addressSelector,
      },
      method: "post",
      success: (order, paymentObj) => {
        console.log(order, paymentObj);
        Rpay(order, paymentObj);
      },
    });
  }
}
function Rpay(serverResponse) {
  // console.log("Server response>>>>>>",serverResponse)
  var options = {
    key: "rzp_test_Jt7dPp8jwV1KsB", // Enter the Key ID generated from the Dashboard
    amount: serverResponse.paymentObj.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
    currency: "INR",
    name: "Foodies",
    // "description": "Test Transaction",
    // "image": "https://example.com/your_logo",
    order_id: serverResponse.paymentObj.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
    handler: function (response) {
      console.log(
        ">>>>>>>>>>>response",
        response,
        serverResponse.paymentObj,
        serverResponse.user._id
      );
      paymentVerification(response, serverResponse.paymentObj);
    },
    prefill: {
      name: serverResponse.user.Name,
      email: serverResponse.user.Email,
      contact: serverResponse.user.Mobile,
    },
    notes: {
      address: serverResponse.order.deliveryDetails.address,
      city: serverResponse.order.deliveryDetails.city,
      state: serverResponse.order.deliveryDetails.state,
      zipcode: serverResponse.order.deliveryDetails.zipCode,
    },
    theme: {
      color: "#57C67F",
    },
  };
  var rzp1 = new Razorpay(options);
  rzp1.open();
}

function paymentVerification(paymentDetails, order) {
  console.log("IN PAYMENTVAERIFICATION");
  $.ajax({
    url: "/paymentVerification",
    data: {
      paymentDetails: paymentDetails,
      order: order,
    },
    method: "post",
    success: (response) => {
      if (response.changeStatus) {
        location.href = "/ordersuccess";
      }
    },
  });
}


//Admin
function changeStatus(orderId,userId,status){
  console.log(orderId,userId,status)
  $.ajax({
    url : '/admin/changeStatus',
    data : {
      orderId :orderId,
      user : userId,
      status:status
    },
    method : 'post',
    success :(response) =>{
      if (response.status){
        document.getElementById(orderId).innerHTML=response.status;
      }
    }
  })
}