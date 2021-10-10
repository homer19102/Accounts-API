import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { readFile } from 'fs/promises';
import cookieParser from 'cookie-parser';

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

app.use(cookieParser());

const swaggerDocs = JSON.parse(await readFile('./swagger.json', 'utf8'));

app.use("/QuickBankApiDoc", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(cors());

app.use(routes);

app.listen(process.env.PORT || 3000,() =>{
    console.log('API start')
});

export default app;

