const jwt = require('jsonwebtoken');
require('dotenv').config();

// middleware to get check that the user is authenticated and attach the user object to the request
function authenticateToken(req, res, next) {
    var token = req.body.token || req.query.token || req.headers['x-access-token'] || req.headers['authorization'];
    if (!token) {
        return res.status(401).json({success:false, message:'No token provided.'})
    }

    jwt.verify(token, process.env.SUPER_SECRET, (err, user) => {
        if (err) {
            return res.sendStatus(403);
        } else{
            req.user = user;
            next();
        }
    });
}


// middleware to check if user is an admin
function checkAdmin(req, res, next) {
    // Ensure the user is authenticated
    var token = req.body.token || req.query.token || req.headers['x-access-token'] || req.headers['authorization'];
    if (!token) {
        return res.status(401).json({success:false, message:'No token provided.'})
    }

    token = token.replace('Bearer ', '');

    jwt.verify(token, process.env.SUPER_SECRET, (err, user) => {
        if (err) {
            return res.status(403); // Forbidden
        }

        // Check if the role is 'admin'
        if (!user.admin) {
            return res.status(403).json({ message: 'Forbidden: Admins only' });
        } else {
            // If the user is an admin, attach the user object to the request
            req.user = user;
            next();
        }

    });
}


module.exports = {
    authenticateToken,
    checkAdmin
};
