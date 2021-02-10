const net = require('net');
const fs = require('fs');
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const download = function(file,path) {

  const conn = net.createConnection({
    host: 'localhost', // change to IP address of computer or ngrok host if tunneling
    port: 4000 // or change to the ngrok port if tunneling
  });

  conn.setEncoding('utf8'); // interpret data as text

  // conn.on('data', (data) => {
  //   console.log('Server says: ', data);
  // });

  conn.on('connect', () => {
    conn.write(file);
  });

  conn.on('data', (request) => {
    if (request === 'NULL') {
      console.log('File not found');
      conn.destroy();
    } else {
      fs.writeFile(path, request, 'utf8', (err) => {
        if (err) throw err;
        const {size} = fs.statSync(`${file}`);
        console.log(`${size} bytes saved to ${path}`);
        console.log(`Ciao!`);
        conn.destroy();
      });
    }
  });
};

//input prompts for file name and file path

rl.question('Enter file request: ', (file) => {
  rl.question('Enter file path: ', (path) => {
    if (fs.existsSync(path)) {
      rl.question('File already exists, type y if you would like to replace it. ' , (answer) => {
        if (answer.toLowerCase() !== 'y') {
          rl.close();
          return;
        } else {
          download(file,path);
          rl.close();
        }
      });
    } else {
      download(file,path);
      rl.close();
    }
  });
});
