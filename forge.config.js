module.exports = {
  packagerConfig: {
    protocols: [
      {
        name: "Security Exam App",
        schemes: ["securityexamapp"],
      },
    ],
  },
  rebuildConfig: {},
  makers: [
    {
      name: "@electron-forge/maker-squirrel",
      config: {
        name: "proctorguard_exam_app",
        authors: "YvagaCore",
        description: "Aplicación para examenes con proctoring",
        setupIcon: "",
        certificateFile: "", // Opcional, para firmar la app
        setupExe: "ProctorGuardInstaller.exe",
        setupMsi: "ProctorGuardInstaller.msi",
        noMsi: false,
        squirrelRegistryStartupCommands: {
          securityapp: {
            command: "open",
            target: '"[INSTALLDIR]\\proctorguard-exam-app.exe" "%1"',
          },
        },
      },
    },
    {
      name: "@electron-forge/maker-zip",
      platforms: ["darwin"],
    },
    {
      name: "@electron-forge/maker-dmg",
      config: {
        name: "SecurityExamApp", // Nombre del .dmg generado
        overwrite: true, // Sobrescribir si ya existe un .dmg
        icon: "", // Ruta al icono para macOS (debe ser un .icns)
        format: "ULFO", // Formato del sistema de archivos, por defecto ULFO
        background: "", // Opcional: fondo del instalador
        contents: [
          {
            x: 410,
            y: 150,
            type: "link",
            path: "/Applications",
          },
          {
            x: 130,
            y: 150,
            type: "file",
            path: "./out/proctorguard-exam-app-darwin-x64/proctorguard-exam-app.app",
          },
        ],
      },
    },
  ],
};
