const users = [];

// Join user to chat
function userJoin(id, username, room) {
  const user = { id, username, room };

  users.push(user);

  return user;
}

// Get current user
function getCurrentUser(id) {
  return users.find(user => user.id === id);
}

function userLeave(id) {
    const user = users.findIndex(user => user.id === id);

    if(user !== -1){
        return users.splice(user, 1)[0];
    }
}

function getRoomUser(room){
    return users.filter(user => user.room === room);
}

module.exports = {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUser
}