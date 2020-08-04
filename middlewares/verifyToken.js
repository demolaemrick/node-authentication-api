const jwt = require('jsonwebtoken')

const verifyUser = (req, res, next) => {
    const token = req.header('x-auth-token');

    // check for token
    if(!token) return res.status(401).send('Access Denied!')

    //if token verify the token
    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET)
        // Add user from payload
        req.user = verified
        next();
    }
    catch(error){ res.status(400).send('Invalid Token')}
}

module.exports = verifyUser