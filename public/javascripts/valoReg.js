const owner = document.querySelector("#owner");
const member = document.querySelector("#team");
const teamform = document.querySelector("#teamForm");
const ownerform = document.querySelector("#ownerForm");
teamform.style.display= "none"; 
ownerform.style.display= "none";

owner.addEventListener('click',()=>{
teamform.style.display= "none";
ownerform.style.display= "block";
})

member.addEventListener('click',()=>{
ownerform.style.display= "none";    
teamform.style.display= "block";    
})