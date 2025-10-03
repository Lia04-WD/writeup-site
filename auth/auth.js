const express = require('express');
const bcrypt = require('bcrypt');

const router = express.Router();

router.post('/verify', (req, res) => {
    const passwd = req.body.passwd;
    const flag = bcrypt.compareSync(passwd, process.env.GUEST_PASS);

    if(flag){
        req.session.isPassed = true;
        req.session.save((err) => {
            if (err) return res.status(500).send('Sessoin Error!');
        });

        return res.redirect('/main');
    }
    else res.status(401).json({msg: 'Invalid Password!'})
});

module.exports = router;