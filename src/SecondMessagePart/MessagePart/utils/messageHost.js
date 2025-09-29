const host = 'https://talkpad-backend-6.onrender.com';

module.exports.addMessage = `${host}/api/messages/addmessage`;
module.exports.getMessage = `${host}/api/messages/getmessage`;
module.exports.editMessageRoute = `${host}/api/messages/editMessage`;
module.exports.deleteMessage = `${host}/api/messages/deleteMessage`;
module.exports.getFiles = `${host}/api/files/upload`;