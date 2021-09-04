import nodemailer from 'nodemailer';
import hbs from 'nodemailer-express-handlebars';
import path from 'path'

const transport = nodemailer.createTransport({
    host: "",
    port: 465,
    auth:{
        user: "",
        pass: "" 
    }
});

transport.use('compile', hbs({
    viewEngine: 'handlebars',
    viewPath: path.resolve('./src/resources/mail/'),
    extName: '.html',
}));

export default transport;