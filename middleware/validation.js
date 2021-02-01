module.exports = function(req, res, next) {
    const {email, name, password} = req.body;
    var emailRegex = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;
    function validEmail(email) {
        return emailRegex.test(email);
    }

    if(req.path === "/register") {
        if(![email, name, password].every(Boolean)) {
            return res.status(401).json("Missing Credentials");
        }
        else if(!validEmail(email)) {
            return res.status(401).json("Invalid Email");
        }
    }

    else if(req.path === "/login") {
        if(![email, password].every(Boolean)) {
            return res.status(401).json("Missing Credentails");
        }
        else if(!validEmail(email)) {
            return res.status(401).json("Invalid Email");
        }
    }
    next();
};