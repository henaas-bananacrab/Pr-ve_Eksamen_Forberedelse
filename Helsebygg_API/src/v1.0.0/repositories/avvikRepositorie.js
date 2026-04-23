const db = require('../database/db');

const getAllAvvik = async () => {
  const [rows] = await db.query(`
    SELECT 
      a.*,
      s.Status,
      p.Prioritering,
      k.Kategori,
      av.Avdeling
    FROM avvik a
    JOIN status s ON a.Status_Status_id = s.Status_id
    JOIN prioritering p ON a.Prioritering_Prioritering_id = p.Prioritering_id
    JOIN kategori k ON a.Kategori_Kategori_id = k.Kategori_id
    JOIN avdeling av ON a.Avdeling_Avdeling_id = av.Avdeling_id
  `);

  return rows;
};

const getAvvikById = async (id) => {
  const [rows] = await db.query(`
    SELECT * FROM avvik WHERE Avvik_id = ?
  `, [id]);

  return rows[0];
};

const createAvvik = async (avvik) => {
  const {
    Tittel,
    Beskrivelse,
    Dato,
    Status_Status_id,
    Prioritering_Prioritering_id,
    Kategori_Kategori_id,
    Avdeling_Avdeling_id
  } = avvik;

  const [result] = await db.query(`
    INSERT INTO avvik 
    (Tittel, Beskrivelse, Dato, Status_Status_id,
     Prioritering_Prioritering_id, Kategori_Kategori_id, Avdeling_Avdeling_id)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `, [
    Tittel,
    Beskrivelse,
    Dato,
    Status_Status_id,
    Prioritering_Prioritering_id,
    Kategori_Kategori_id,
    Avdeling_Avdeling_id
  ]);

  return result.insertId;
};

const getAvvikByStatus = async (statusId) => {
  const [rows] = await db.query(`
    SELECT * FROM avvik WHERE Status_Status_id = ?
  `, [statusId]);

  return rows;
};

const updateAvvikStatus = async (id, statusId) => {
  const [result] = await db.query(`
    UPDATE avvik SET Status_Status_id = ? WHERE Avvik_id = ?
  `, [statusId, id]);

  return result.affectedRows > 0;
};

module.exports = {
  getAllAvvik,
  getAvvikById,
  createAvvik,
  getAvvikByStatus,
  updateAvvikStatus
};
