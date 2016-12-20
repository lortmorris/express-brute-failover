# express-brute-failover
This is a easy and simple version of express-brute with failover (when using redis/memory);

# install
```bash
$ npm install express-brute-failover
```

# example
```js
const express = require('express');
const EBF = require('express-brute-failover');
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

```

# Powered by
[César Casas](https://ar.linkedin.com/in/cesarcasas)
