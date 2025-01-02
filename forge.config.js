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
  ],
};
