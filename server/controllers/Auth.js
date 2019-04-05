const bcrypt = require('bcryptjs');

module.exports = {
    register: async (req, res) => {
        const db = req.app.get('db')
        const { username, password, isAdmin } = req.body;

        let response = await db.get_user(username);
        let user = response[0];

        if (user) {
            return res.status(409).send('Username taken')
        }

        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt)

        let result = await db.register_user(isAdmin, username, hash)
        let existingUser = result[0]

        delete existingUser.hash
        req.session.user = { isAdmin: existingUser.is_admin, id: existingUser.id, username: existingUser.username }
        console.log(req.session.user)
        res.status(201).send(req.session.user)
    },
    login: async (req, res) => {
        const db = req.app.get('db');

        const { username, password} = req.body;

        let response = await db.get_user(username);
        let user = response[0];

        if (!user) {
            return res.status(401).send("Wrooooooooooooooooooooooooooooooooooooooooong!!!")
        }

        const isAuthenticated = bcrypt.compareSync(password, user.hash);
        
        if (!isAuthenticated) {
            return res.status(403).send('Wrooooooooooooooooooooooooooooooooooooooooong!!!')
        }

        req.session.user = {  id: user.id, isAdmin: user.is_admin, username: user.username }
        res.status(200).send(req.session.user)
    },
    logout: (req, res) => {
        req.session.destroy()
        res.sendStatus(200)
    }
}