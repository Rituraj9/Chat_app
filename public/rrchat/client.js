const socket = io();
const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageinp');
const messageArea = document.querySelector('.message__area')
var audio = new Audio('./rrchat/Collect-chimes-sound-effect.mp3');
const append = (message, position) =>
{
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageArea.append(messageElement);
    if(position == 'incoming')
    {
        audio.play();
    }
}

form.addEventListener('submit',(e)=>
{
    e.preventDefault();
    const message = messageInput.value;
    append(`You: ${message}`,'outgoing');
    socket.emit('send',message);
    messageInput.value = '';
});

let name;
do{
name = prompt("Enter Your Name to Join:");
socket.emit('new-user-joined', name);
}while(!name)

socket.on('user-joined',name => {
    append(`${name} Joined the Chat`,'incoming');
});

socket.on('receive',data => {
    append(`${data.name}: ${data.message}`,'incoming');
});

socket.on('leave',name => {
    append(`${name} left the chat`,'incoming');
});
