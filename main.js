const { app, protocol, desktopCapturer, screen, dialog } = require("electron");
const http = require("http");
const fs = require("fs");
const path = require("path");
const { sendReport } = require("./useReportApi");

let server;

async function captureAllScreens(createId) {
  const displays = screen.getAllDisplays();
  const sources = await desktopCapturer.getSources({
    types: ["screen"],
    thumbnailSize: { width: 1920, height: 1080 },
  });

  for (let i = 0; i < sources.length; i++) {
    const screenSource = sources[i];
    const display = displays[i] || {};
    const { width = 1920, height = 1080 } = display.size || {};

    // Resize and convert to JPG
    const imageBuffer = screenSource.thumbnail.resize({ width, height });
    const imageBase64 = `data:image/jpeg;base64,${imageBuffer
      .toJPEG(80)
      .toString("base64")}`;

    console.log(
      `Captura de pantalla ${i + 1} convertida a base64 con prefijo estándar.`
    );

    // Inicia proceso para enviar a nuestro backend
    const sent = await sendReport({ img: imageBase64, createId });

    if (sent) {
      console.log(`Reporte de captura ${i + 1} enviado exitosamente.`);
    } else {
      console.error(`Error al enviar el reporte de captura ${i + 1}.`);
    }
  }
}

function startServer() {
  server = http.createServer((req, res) => {
    // Configuración de CORS
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "OPTIONS, GET, POST"); // Permitir también POST
    res.setHeader("Access-Control-Allow-Headers", "Content-Type"); // Especificar los encabezados permitidos

    // Responder a la solicitud preflight (OPTIONS)
    if (req.method === "OPTIONS") {
      res.writeHead(200); // Responder con un código HTTP 200 OK para las solicitudes OPTIONS
      res.end();
      return; // Salir para evitar que continúe procesando la solicitud
    }

    // Resto de las rutas
    if (req.method === "GET" && req.url === "/ping") {
      if (!res.finished) {
        console.log("Entrando en el pings");
        res.writeHead(200, { "Content-Type": "text/plain" });
        res.end("App está activa");
      }
      return;
    }

    if (req.method === "POST" && req.url === "/trigger") {
      let body = "";

      req.on("data", (chunk) => {
        body += chunk.toString();
      });

      req.on("end", async () => {
        try {
          const { createId } = JSON.parse(body);

          if (!createId) {
            throw new Error("createId es obligatorio");
          }

          console.log("Se recibió createId:", createId);

          await captureAllScreens(createId);

          if (!res.finished) {
            res.writeHead(200, { "Content-Type": "text/plain" });
            res.end("Capturas realizadas con éxito");
          }
        } catch (error) {
          console.error("Error al procesar la solicitud:", error);
          if (!res.finished) {
            res.writeHead(400, { "Content-Type": "text/plain" });
            res.end("Error al procesar la solicitud");
          }
        }
      });
    } else {
      if (!res.finished) {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("Ruta no encontrada");
      }
    }
  });

  server.listen(3010, () => {
    console.log("Servidor de Electron escuchando en http://localhost:3010");
  });
}

// Manejo del esquema personalizado
function handleCustomProtocol(url) {
  try {
    const parsedUrl = new URL(url); // Usa URL para parsear el esquema
  } catch (error) {
    console.error("Error al manejar el esquema personalizado:", error);
  }
}

// Configuración del esquema personalizado
if (process.defaultApp) {
  app.setAsDefaultProtocolClient("securityexamapp", process.execPath, [
    path.resolve(process.argv[1]),
  ]);
} else {
  app.setAsDefaultProtocolClient("securityexamapp");
}

// Manejar instancias únicas
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  app.on("second-instance", (event, commandLine) => {
    // Manejar la URL si esta instancia fue llamada con un esquema personalizado
    const url = commandLine.find((arg) => arg.startsWith("securityexamapp://"));
    if (url) handleCustomProtocol(url);
  });

  app.whenReady().then(() => {
    startServer();

    app.on("open-url", (event, url) => {
      event.preventDefault();
      handleCustomProtocol(url);
    });
  });
}

// Manejo del cierre de la app
app.on("before-quit", () => {
  if (server) {
    server.close(() => {
      console.log("Servidor cerrado correctamente.");
    });
  }
});
