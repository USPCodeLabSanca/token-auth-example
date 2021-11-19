const refreshModel = require('../models/refresh');
const jwt = require('jsonwebtoken');
const axios = require('axios');

module.exports.createToken = async (req, res) => {
    const refreshToken = req.body.token;

    if (!refreshToken)
        return res.sendStatus(401)

    if (await refreshModel.exists({token: refreshToken})) {
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
            if (err)
                return res.sendStatus(403)
            console.log(user);
            const accessToken = generateAccessToken({sub: user.sub});
            return res.status(200).json({accessToken: accessToken});
        })
    }
    else {
        return res.sendStatus(403);
    }
}

module.exports.logoutUser = async (req, res) => {
    refreshModel.findOneAndRemove({token: req.body.token}, (err, token) => {
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

            const refreshToken = jwt.sign({sub: user._id}, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '5d'});
            // return res.status(200).cookie("accessToken", accessToken, {httpOnly: true, sameSite: 'lax'});

            const dbRefreshToken = new refreshModel({
                token: refreshToken
            });
            await dbRefreshToken.save();

            /*
            res.cookie("accessToken", accessToken, {httpOnly: true, sameSite: 'lax'});
            res.cookie("refreshToken", refreshToken, {httpOnly: true, sameSite: 'lax'});
            res.send('Cookies sent');
            */

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
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '15s'});
}