const userModel = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports.createUser = async (req, res) => {
    try {
        if (await userModel.exists({username: req.body.username}))
            return res.status(409).send({error: 'username already used'});

        const user = new userModel({
            username: req.body.username,
            password: await bcrypt.hash(req.body.password, 10),
            cartaoCredito: req.body.cartaoCredito
        });
    
        const userSaved = await user.save();
    
        return res.status(200).send(userSaved);
    }
    catch {
        console.log(JSON.stringify(error));
        return res.status(504).send({'error': 'timed out'});
    }
}

module.exports.getUser = async (req, res) => {
    try {
        const sub = req.sub;
        
        if (req.params.id !== sub)
            return res.status(401).send({error: 'No access to this user'});

        const user = await userModel.findById(sub);

        if (!user)
            return res.send(404).send({error: 'User not found'});

        res.status(200).send(user);
    }
    catch (error) {
        console.log(JSON.stringify(error));
        return res.status(504).send({'error': 'timed out'});
    }
}

module.exports.authenticateUser = async (req, res) => {
    const {username, password} = req.body;

    const user = await userModel.findOne({username: username});

    if (!user)
        return res.status(404).send({error: 'User not Found'});
    
    if (await bcrypt.compare(password, user.password)){
        return res.status(200).send(user)
    }
    else
        res.status(401).send(false)
}

module.exports.validateToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token)
        return res.sendStatus(401);
    
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err)
            return res.sendStatus(403);

        req.sub = user.sub;
        next();
    });
};