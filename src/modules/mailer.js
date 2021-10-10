import nodemailer from 'nodemailer';
import hbs from 'nodemailer-express-handlebars';
import path from 'path'

const transport = nodemailer.createTransport({
    host: process.env.SMTP,
    port: 465,
    auth:{
        user: process.env.USER,
        pass: process.env.PASSWORD 
    },
    secureConnection: true,
    tls: { ciphers: 'SSLv3' }
});

transport.use('compile', hbs({
    viewEngine: {
        defaultLayout: undefined,
        partialsDir: path.resolve('./src/resources/mail/')
      },
    viewPath: path.resolve('./src/resources/mail/'),
    extName: '.html',
}));

export default transport;