// Menu toggle
let menuIcon = document.querySelector('#menu-icon');
let navbar = document.querySelector('.navbar');

menuIcon.onclick = () => {
  menuIcon.classList.toggle('bx-x');
  navbar.classList.toggle('active');
};


document.querySelectorAll('.review-btn').forEach(function(button) {
  button.addEventListener('click', function() {
    const card = button.closest('.project-card');
    card.classList.toggle('open');
  });
});


let hireBtn = document.getElementById("hireBtn");
let copyMessage = document.getElementById("copyMessage");


if (!hireBtn) 
    {
  console.error("Hire button not found!");
}

hireBtn.addEventListener("click", function(e) {
  e.preventDefault();
  console.log("Hire button clicked");


  navigator.clipboard.writeText("bpb9329@nyu.edu")
    .then(function() {
      console.log("Email copied to clipboard");
      copyMessage.style.display = "inline";
      setTimeout(function() {
        copyMessage.style.display = "none";
      }, 2000);
    })
    .catch(function(err) {
      console.error("Error copying text: ", err);
    });
});


document.getElementById("contactForm").addEventListener("submit", function(event) {
  event.preventDefault(); 
  emailjs.sendForm("service_i0avfq9", "template_qtnp7vd", this)
    .then(function() {
      alert("Message sent successfully!");
      document.getElementById("contactForm").reset();
    }, function(error) {
      alert("Failed to send message, please try again.");
      console.error("EmailJS error:", error);
    });
});
