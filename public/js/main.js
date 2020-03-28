const socket = io();

const chatMsg = document.querySelector('.msg__input');
const chatBox =  document.querySelector('.chat-container');
const roomName = document.getElementById('room__name');
const roomUsers = document.getElementById('room__users');
const user = document.getElementById('curruntUser');
 const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

console.log( username, room );
socket.emit('joinRoom', {username, room})

socket.on('message', message => {
    console.log(message);
    showMassage(message);

    chatBox.scrollTop = chatBox.scrollHeight;
})

socket.on('roomUsers', ({ room, users, curruntUser}) => {
    mapRoomName(room);
    mapRoomUsers(users, curruntUser);
})

chatMsg.addEventListener('submit', e => {
    e.preventDefault();

    const msg = e.target.elements.inputMsg.value;

    socket.emit('chatMassage', msg);

    e.target.elements.inputMsg.value = '';
    e.target.elements.inputMsg.focus();

})

function showMassage(message){
    const div = document.createElement('div');
    div.classList.add('chat__msg');
    div.innerHTML = 
                    `<div class="chat__msg">
                                <div class="alert alert-success text-muted" role="alert">
                                    <div class="msg__header d-inline">
                                        <span class="msg__username">@${message.username}</span>
                                        <span class="msg__time text-right">${message.time}</span>
                                    </div>
                                    <hr class="text-dark">
                                    <div class="msg_content">
                                        <span class="context">@msg: </span>
                                        <span>${message.text}</span>
                                    </div>
                                </div>
                            </div>`;
    document.querySelector('.chat-container').appendChild(div);

    
}

function mapRoomName(room) {
    roomName.innerText = room;
}

function mapRoomUsers(users, curruntUser){

    user.innerText = curruntUser.username;

    roomUsers.innerHTML = `
    ${users.map(user => `
                        <li class="dropdown-item mt-1 text-center text-muted">
                            <i class="far fa-user"></i>
                            ${user.username}
                        </li>
    `).join()}`;

    
}