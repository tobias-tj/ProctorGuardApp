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
        certificateFile: "",
        setupExe: "ProctorGuardInstaller.exe",
        setupMsi: "ProctorGuardInstaller.msi",
        noMsi: false,
      },
      platforms: ["win32"], // Solo se ejecutará en Windows
    },
    {
      name: "@electron-forge/maker-zip",
      platforms: ["darwin"], // Solo se ejecutará en macOS
    },
    {
      name: "@electron-forge/maker-dmg",
      config: {
        name: "SecurityExamApp",
        overwrite: true,
        icon: "",
        format: "ULFO",
      },
      platforms: ["darwin"], // Solo se ejecutará en macOS
    },
  ],
};
