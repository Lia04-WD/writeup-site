const isPassed = (req, res, next) => {
    if (req.session && req.session.isPassed) return next();
    else return res.redirect('/');
}

module.exports = isPassed