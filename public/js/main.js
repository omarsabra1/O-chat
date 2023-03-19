const chatForm=document.getElementById('chat-form');
const chatMessages=document.querySelector('.chat-messages');
// get username and room from URL
const {username,room}=Qs.parse(location.search,{
  ignoreQueryPrefix:true
});
const roomName=document.getElementById('room-name');
const userList=document.getElementById('users');


const socket = io();


//Join chatroom 
socket.emit('joinRoom',{username,room});

//get rooms and users
socket.on('roomUsers',({room,users})=>{
  outputRoomName(room);
  outputUsers(users);
});
//message from server
socket.on('message',message=>{
  outputMessage(message);

  //Scroll down 
  chatMessages.scrollTop=chatMessages.scrollHeight;  
})
socket.on('helloUserMsg',(msg)=>{
  
})
//Message submit

chatForm.addEventListener('submit',(e)=>{
  e.preventDefault();

  //get message text
  const msg=e.target.elements.msg.value;

  //Emit message to server
 socket.emit('chatMessage',msg);

  //clear input
  e.target.elements.msg.value='';
});

//output message to DOM
function outputMessage(msg){
  const div=document.createElement('div');
  div.classList.add('message');
  document.querySelector('.chat-messages').appendChild(div);
  const msgDetails=`<p class="meta">${msg.username} <span>${msg.time}</span>`
  const msgText=`<p class="text">${msg.text}</p>`
  div.innerHTML=msgDetails+msgText;
}

// add room to DOM
function outputRoomName(room){
roomName.innerText=room;
}

function outputUsers(users){
  userList.innerHTML=`
  ${users.map(user=>`<li>${user.username}</li>`).join('')}
  `
}