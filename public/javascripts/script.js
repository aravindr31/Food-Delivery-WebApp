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
    const container = document.querySelector('.container');
    container.classList.toggle('active');
  };