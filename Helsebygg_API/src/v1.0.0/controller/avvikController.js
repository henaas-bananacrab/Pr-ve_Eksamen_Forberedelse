const { getAllAvvik, getAvvikById, createAvvik, getAvvikByStatus, updateAvvikStatus } = require('../repositories/avvikRepositorie');

const getAvvik = async (req, res) => {
  try {
    const avvik = await getAllAvvik();
    res.status(200).json(avvik);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

const getAvvikByIdHandler = async (req, res) => {
    try {
        const avvik = await getAvvikById(req.params.id);
        if (!avvik) {
            return res.status(404).json({ error: 'Avvik not found' });
        }
        res.status(200).json(avvik);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const createAvvikHandler = async (req, res) => {
    try {
        const avvik = await createAvvik(req.body);
        res.status(201).json(avvik);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const getAvvikByStatusHandler = async (req, res) => {
    try {
        const avvik = await getAvvikByStatus(req.params.id);
        if (!avvik) {
            return res.status(404).json({ error: 'Avvik not found' });
        }
        res.status(200).json(avvik);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const updateAvvikStatusHandler = async (req, res) => {
    const { id } = req.params;
    const { statusId } = req.body;
    try {
        const updated = await updateAvvikStatus(id, statusId);
        if (!updated) {
            return res.status(404).json({ error: 'Avvik not found' });
        }
        res.status(200).json({ message: 'Avvik status updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    getAvvik,
    getAvvikByIdHandler,
    createAvvikHandler,
    getAvvikByStatusHandler,
    updateAvvikStatusHandler
};