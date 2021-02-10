const net = require('net');
const fs = require('fs');
const server = net.createServer();

server.listen(4000, () => {
  console.log('Server listening on port 4000!');
});

server.on('connection', (client) => {
  console.log('New client connected!');
  client.setEncoding('utf8'); // interpret data as text
  
  client.on('data', (request) => {
    console.log(`File requested: ${request}`);
    if (!fs.existsSync(request)) {
      client.write('NULL');
    } else {
      fs.readFile(request, (err, data) => {
        if (!err) {
          client.write(data);
          console.log(`${request} successfully sent!`);
        } else {
          console.log(err);
        }
      });
    }
  });
});


