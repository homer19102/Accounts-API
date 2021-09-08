import jwt from 'jsonwebtoken';

export default (req, res, next) => {
    const authHeader = req.headers.authorization;

    if(req.originalUrl === '/login/' || req.originalUrl === '/accounts/NewUser' || req.originalUrl === '/password/ResetPassword' )
        return next();

    if(!authHeader)
        return res.status(401).send({ error: 'Token não informado !'});

    const parts = authHeader.split(' ');

    if(!parts.length === 2)
        return res.status(401).send({ error: 'Token no formato incorreto !'});

    const [ scheme, token] = parts;

   /*  if(!/^Bearer$^/i.test(scheme))
        return res.status(401).send({ error: 'Token no formato incorreto !'}); */

    jwt.verify(token, process.env.SECRET, (err, decoded) => {
        if(err) return res.status(401).send({ error: 'Token inválido !'});

        req.userId = decoded.id;
        return next();
    })
    
}