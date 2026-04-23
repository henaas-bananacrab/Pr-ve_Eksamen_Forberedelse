const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET;
const { createUser, loginUser } = require('../repositories/brukerRepositorie');

const registerUser = async (req, res) => {
    const { Brukernavn, Passord, Rolle } = req.body;
    try {
        const hash = await bcrypt.hash(Passord, 10);

        const user = await createUser(Brukernavn, hash, Rolle);

        const token = jwt.sign({ id: user.id, role: user.Rolle }, SECRET_KEY, { expiresIn: '1h' });

        res.status(201).json({ success: true, token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const loginUserHandler = async (req, res) => {
    const { Brukernavn, Passord } = req.body;
    try {
        const user = await loginUser(Brukernavn, Passord);

        if (!user || !await bcrypt.compare(Passord, user.Passord)) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user.id, role: user.Rolle }, SECRET_KEY, { expiresIn: '1h' });

        res.status(200).json({ success: true, token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    registerUser,
    loginUserHandler
};