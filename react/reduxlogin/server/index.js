import express from 'express';
import bodyParser from 'body-parser';

let app = express();

import users from './routes/users'

app.use(bodyParser.json());

//请求路由
app.use('/api/users',users);
app.get('/',(req,res) =>{
    res.send("hello world");
})

app.listen(6060,()=>console.log('Running on localhost:6060'));

