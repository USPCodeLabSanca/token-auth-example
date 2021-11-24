const refreshModel = require('../models/refresh');
const jwt = require('jsonwebtoken');
const axios = require('axios');

module.exports.createToken = async (req, res) => {
    const refreshToken = req.body.token;

    if (!refreshToken)
        return res.sendStatus(401)

    // Vejo se o token existe no banco de dados
    if (await refreshModel.exists({token: refreshToken})) {
        // Vejo se o token é válido
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, user) => {
            if (err)
                return res.status(403).send({error: 'Token is not valid'})
            const accessToken = generateAccessToken({sub: user.sub});
            const newRefreshToken = jwt.sign({sub: user.sub}, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '7d'});

            const newRefreshDB = await refreshModel.findByIdAndUpdate(user.sub, {
                token: newRefreshToken
            }, {new: true});

            return res.status(200).json({accessToken: accessToken, refreshToken: newRefreshToken});
        })
    }
    else
        return res.status(403).send("Token not found");
}

module.exports.logoutUser = async (req, res) => {
    refreshModel.findByIdAndRemove({token: req.body.token}, (err, token) => {
        if (token)
            return res.sendStatus(200);
        res.sendStatus(404);
    });
}

module.exports.loginUser = async (req, res) => {
    try {
        const url = `http://localhost:${process.env.API_PORT}/user/auth`;
        const response = await axios.post(url, {
            username: req.body.username,
            password: req.body.password
        });

        if (response.data != false) {
            const user = response.data;
            const accessToken = generateAccessToken({sub: user._id});

            const refreshToken = jwt.sign({sub: user._id}, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '7d'});

            const dbRefreshToken = new refreshModel({
                token: refreshToken,
                _id: user._id
            });
            await dbRefreshToken.save();
            return res.status(200).send({accessToken: accessToken, refreshToken: refreshToken});
        }
        res.status(401).send({error: 'Wrong Password'})
    }
    catch (error) {
        console.log(JSON.stringify(error));
        res.status(504).send({'error': 'timed out'});
    }
}

const generateAccessToken = user => {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '15s'})
}