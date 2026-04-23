const db = require('../database/db');
const bcrypt = require('bcrypt');

const SALT_ROUNDS = 10;

const createUser = async ({ Brukernavn, Passord, Rolle }) => {
  const hashedPassword = await bcrypt.hash(Passord, SALT_ROUNDS);

  const [result] = await db.query(`
    INSERT INTO bruker (Brukernavn, Passord, Rolle)
    VALUES (?, ?, ?)
  `, [Brukernavn, hashedPassword, Rolle]);

  return result.insertId;
};

// Login user
const loginUser = async (Brukernavn, Passord) => {
  const [rows] = await db.query(`
    SELECT * FROM bruker WHERE Brukernavn = ?
  `, [Brukernavn]);

  const user = rows[0];
  if (!user) return null;

  const isMatch = await bcrypt.compare(Passord, user.Passord);
  if (!isMatch) return null;

  return user;
};

module.exports = {
  createUser,
  loginUser
};