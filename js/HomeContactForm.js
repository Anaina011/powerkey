const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const numberInput = document.getElementById("number");
const servicesInput = document.getElementById("services");
const messageInput = document.getElementById("message");
const submitButton = document.getElementById("submitButton");

const maxMessageWords = 50;

submitButton.addEventListener("click", function() {
  if (!validateName() || !validateEmail() || !validateNumber() || !validateServices() || !validateMessage()) {
    return;
  }
  
  // All validations passed, you can submit the form or perform other actions
  alert("Form submitted successfully!");
  
  // Reset the form
  resetForm();
  
  // Refresh the page
  window.location.reload();
});

function validateName() {
  const nameValue = nameInput.value.trim();
  const nameValidationMessage = document.getElementById("nameValidation");
  
  if (nameValue === "") {
    nameValidationMessage.style.display = "block";
    return false;
  } else {
    nameValidationMessage.style.display = "none";
    return true;
  }
}

function validateEmail() {
  const emailValue = emailInput.value.trim();
  const emailValidationMessage = document.getElementById("emailValidation");
  
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(emailValue)) {
    emailValidationMessage.style.display = "block";
    return false;
  } else {
    emailValidationMessage.style.display = "none";
    return true;
  }
}

function validateNumber() {
  const numberValue = numberInput.value.trim();
  const numberValidationMessage = document.getElementById("numberValidation");
  
  if (numberValue === "") {
    numberValidationMessage.style.display = "block";
    return false;
  } else {
    numberValidationMessage.style.display = "none";
    return true;
  }
}

function validateServices() {
  const servicesValue = servicesInput.value.trim();
  const servicesValidationMessage = document.getElementById("servicesValidation");
  
  if (servicesValue === "") {
    servicesValidationMessage.style.display = "block";
    return false;
  } else {
    servicesValidationMessage.style.display = "none";
    return true;
  }
}

function validateMessage() {
  const messageValue = messageInput.value.trim();
  const messageValidationMessage = document.getElementById("messageValidation");
  
  if (messageValue === "") {
    messageValidationMessage.textContent = "Please enter your message.";
    messageValidationMessage.style.display = "block";
    return false;
  }

  // Split message by spaces to count words
  const words = messageValue.split(/\s+/).filter(function(word) {
    return word.length > 0;
  });
  
  if (words.length > maxMessageWords) {
    messageValidationMessage.textContent = `Maximum ${maxMessageWords} words allowed.`;
    messageValidationMessage.style.display = "block";
    return false;
  } else {
    messageValidationMessage.style.display = "none";
    return true;
  }
}

function resetForm() {
  nameInput.value = "";
  emailInput.value = "";
  numberInput.value = "";
  servicesInput.value = "";
  messageInput.value = "";

  // Hide all validation messages
  document.getElementById("nameValidation").style.display = "none";
  document.getElementById("emailValidation").style.display = "none";
  document.getElementById("numberValidation").style.display = "none";
  document.getElementById("servicesValidation").style.display = "none";
  document.getElementById("messageValidation").style.display = "none";

  // Reset textarea height
  messageInput.style.height = "auto";
}

// Update the rows as the user types
messageInput.addEventListener("input", function() {
  messageInput.style.height = "auto";
  messageInput.style.height = (messageInput.scrollHeight) + "px";
});
