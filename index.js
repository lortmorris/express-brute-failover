'use strict';

const redis = require('redis');
const ExpressBrute = require('express-brute');
const debug = require('debug')('express-brute-failover');
const bruteRedisStore = require('express-brute-redis');

function expresBruteFailoverMain(params){
  params = params || {};
  const redisOptions =  Object.assign({},
    {host: '127.0.0.1', port: 6379},
    params.redis || {});

    let failCallback = (a,b)=>{
      console.log(`se cago la fruta en brute: `, a,b);
    };

    const expressBruteOptions = Object.assign({},
      {
        freeRetries: 200,
        lifetime: 5 * 60,
        minWait: 500,
        maxWait: 60000,
        failCallback: failCallback
      },
      params.brute || {});

      const expressBruteInstance = new ExpressBrute(expressBruteOptions, new ExpressBrute.MemoryStore());
      const redisClient = redis.createClient( redisOptions );

      redisClient.on('connect', ()=>{ });

      redisClient.on('error', ()=>{
        debug('redis.error called');
        expressBruteInstance.store = new ExpressBrute.MemoryStore();
      });

      redisClient.on('end', ()=>{ debug('redis.end called'); });
      redisClient.on('ready', ()=>{
        debug('redis:: connected');
        expressBruteInstance.store =  new  bruteRedisStore({client: redisClient});
      });

      return expressBruteInstance;
    }

    module.exports = expresBruteFailoverMain;
