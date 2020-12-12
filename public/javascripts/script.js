//Animation
function show(id) {
  let button = document.getElementById(id);
  button.className = "btn text-center";
  button.style.background = "orange";
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
//Sidebar
function openNav() {
  document.getElementById("mySidebar").style.width = "35%";
  document.getElementById("contain").style.marginLeft = "35%";
}

function closeNav() {
  document.getElementById("mySidebar").style.width = "0";
  document.getElementById("contain").style.marginLeft = "0";
}
