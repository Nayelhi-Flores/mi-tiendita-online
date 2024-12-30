// Función auxiliar para manejar errores
const manejarError = (res, error, message) => {
    console.error(message, error);
    res.status(500).json({ error: message });
};

module.exports = { manejarError };