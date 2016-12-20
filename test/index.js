const express = require('express');
const EBF = require('../index.js');
const app = express();
const http = require('http');
const server = http.createServer(app);

const ebf = EBF({
  redis:{
    host: '127.0.0.1',
    port: 6379
  },
  brute:{
    freeRetries: 5,
    lifetime: 5 * 600
  }
});


app.get('*', (req, res, next)=>{
  return ebf.prevent(req, res, next);
})


app.get('/', (req, res, next)=> {
  res.end('ready! ');
});

server.listen(5000, ()=>{
  console.log(`listen on *:5000`);
});
