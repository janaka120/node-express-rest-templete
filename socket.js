let io;

module.exports = {
    init: httpServer => {
        io = require('socket.io')(httpServer, {
            cors: {
                origin: '*',
                methods: ["GET", "POST", "PUT", "DELETE"],
              }
        });
        return io;
    },
    getIo: () => {
        if(!io) {
            throw new Error('Socket.io not initialize');
        }
        console.log("igetIo io called >>>>");
        return io;
    }
}