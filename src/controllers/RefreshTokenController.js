import jwt from 'jsonwebtoken';

class RefreshTokenController{
    async NewToken(req, res, next){
        try{

          const { refreshToken, user } = req.cookies;

          jwt.verify(refreshToken, process.env.REFRESHTOKENSECRET, (err) => {
            if(err) return res.status(401).send({ error: 'Token expirado !'});


            const token = jwt.sign( { id: user }, process.env.SECRET, {
                expiresIn: 3600,
            });
    
            const newRefreshToken = jwt.sign( { id: user }, process.env.REFRESHTOKENSECRET, {
                expiresIn: 604800,
            });

            res.cookie('refreshToken', newRefreshToken);
            res.cookie('user', user);
    
            res.json({
                ok: "true",
                token: token
            });

            return res;
        })

        }catch(error){
            next(error);
        }
    }
}

export default new RefreshTokenController();