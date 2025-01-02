const axios = require("axios");

async function sendReport({ img, createId }) {
  const payload = {
    createId: createId,
    incidentType: "window_changed",
    time: new Date().toISOString(),
    img,
  };

  try {
    console.log("Enviando reporte:", payload);

    const { status } = await axios.post(
      "http://localhost:3000/api/manageReportExam",
      payload,
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    if (status === 200) {
      console.log("Reporte enviado con éxito.");
      return true;
    }
    console.error("Error inesperado: estado no exitoso.");
    return false;
  } catch (error) {
    console.error(
      "Error al enviar el reporte:",
      error.response?.data || error.message || "Error desconocido"
    );
    return false;
  }
}

module.exports = { sendReport };
