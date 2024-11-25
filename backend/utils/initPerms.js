const Permission = require("../models/Permission");
const db = require("../config/db");
db();

const initializePermissions = async () => {
  const permissions = [
    { name: "computeRead", description: "Read access to the the compute" },
    { name: "computeWrite", description: "Write access to the compute" },
    { name: "computeDelete", description: "Delete access to the compute" },
    {
      name: "computeFull",
      description: "Full administrative access to the compute",
    },
    { name: "blobRead", description: "Read access to the the blob" },
    { name: "blobWrite", description: "Write access to the blob" },
    { name: "blobDelete", description: "Delete access to the blob" },
    {
      name: "blobFull",
      description: "Full administrative access to the blob",
    },

    { name: "networkRead", description: "Read access to the the network" },
    { name: "networkWrite", description: "Write access to the network" },
    { name: "networkDelete", description: "Delete access to the network" },
    {
      name: "networkFull",
      description: "Full administrative access to the network",
    },

    { name: "databaseRead", description: "Read access to the the database" },
    { name: "databaseWrite", description: "Write access to the database" },
    { name: "databaseDelete", description: "Delete access to the database" },
    {
      name: "databaseFull",
      description: "Full administrative access to the database",
    },
  ];

  for (const perm of permissions) {
    const existingPermission = await Permission.findOne({ name: perm.name });
    if (!existingPermission) {
      await Permission.create(perm);
    }
  }

  console.log("Permissions initialized");
};

initializePermissions();
