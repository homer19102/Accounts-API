import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import { db } from './databaseConnect.js';

import routes from './src/routes/index.js';

dotenv.config();

(async () =>{
    try{
        await db.mongoose.connect(db.url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true,
        });
        console.log('Conectado ao mongodb com sucesso');
    }catch(error){
        console.log('Erro ao conectar no mongodb ' + error);
    }
})();

const app = express();

app.use(express.json());

app.use(cors());

app.use(routes);

app.listen(process.env.PORTAPI,() =>{
    console.log('API start')
});

export default app;

