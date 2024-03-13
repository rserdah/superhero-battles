const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const logger = require('../util/logger');

const SALT_ROUNDS = 10;
const SECRET_KEY = 'your-secret-key';

/**
 * Authenticates a user if logged in but does not reject the request if no user is logged in (i.e. allows guest users to access this endpoint). 
 * Typically, guest users would access limited/different data, but that would be handled in the actual endpoint. This middleware just 
 * appends user data to the request if a user is logged in and does nothing otherwise
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
async function authUserAllowGuest(req, res, next) {
    authUserWithGuestStatus(req, res, next, true);
}

async function authUser(req, res, next) {
    authUserWithGuestStatus(req, res, next, false);
}

/**
 * Validates that the logged in username matches the username PATH param
 */
async function authUserOwnerPath(req, res, next) {
    await authUser(req, res, async () => {
        await authUserMatchesUsername(req, res, next, req.params.username);
    });
}

/**
 * Validates that the logged in username matches the username QUERY param
 */
async function authUserOwnerQuery(req, res, next) {
    await authUser(req, res, async () => {
        await authUserMatchesUsername(req, res, next, req.query.username);
    });
}

async function authUserMatchesUsername(req, res, next, matchUsername) {
    if(req.user.username != matchUsername) {
        res.status(403).json({message: 'Forbidden from new thing!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!'});
        return;
    }

    next();
}

/**This is a middleware helper function and is not meant to be used as middleware directly in an endpoint */
async function authUserWithGuestStatus(req, res, next, allowGuest) {
    const authHeader = req.headers['authorization'];

    // Authentication header format convention: 'Bearer <token>'; This split returns the token value
    const token = authHeader && authHeader.split(' ')[1];

    if(((allowGuest === false) && !token)) {
        logger.info('401 Unauthorized access');
        res.status(401).json({ message: 'Unauthorized access' });
        return;
    }

    if(token) {
        jwt.verify(token, SECRET_KEY, (err, user) => {
            if(err || !user) {
                logger.info('403 Forbidden access');
                res.status(403).json({ message: 'Forbidden access' });
                return;
            }
            else {
                req.user = user;
                next();
            }
        });
    }
    else {
        req.isGuest = true;
        next();
    }
}

module.exports = {
    SALT_ROUNDS, // Should not be exported, will remove when the func that uses it is moved here
    SECRET_KEY, // Should not be exported, will remove when the func that uses it is moved here
    authUser,
    authUserAllowGuest, 
    authUserOwnerPath,
    authUserOwnerQuery
};