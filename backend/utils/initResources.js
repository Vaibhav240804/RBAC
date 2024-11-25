const Resource = require("../models/Resource");
const Permission = require("../models/Permission");
const db = require("../config/db");
db();

const initializeResources = async () => {
  const computeRead = await Permission.findOne({ name: "computeRead" });
  const computeWrite = await Permission.findOne({ name: "computeWrite" });
  const computeDelete = await Permission.findOne({ name: "computeDelete" });
  const computeFull = await Permission.findOne({ name: "computeFull" });

  const blobRead = await Permission.findOne({ name: "blobRead" });
  const blobWrite = await Permission.findOne({ name: "blobWrite" });
  const blobDelete = await Permission.findOne({ name: "blobDelete" });
  const blobFull = await Permission.findOne({ name: "blobFull" });

  const networkRead = await Permission.findOne({ name: "networkRead" });
  const networkWrite = await Permission.findOne({ name: "networkWrite" });
  const networkDelete = await Permission.findOne({ name: "networkDelete" });
  const networkFull = await Permission.findOne({ name: "networkFull" });

  const databaseRead = await Permission.findOne({ name: "databaseRead" });
  const databaseWrite = await Permission.findOne({ name: "databaseWrite" });
  const databaseDelete = await Permission.findOne({ name: "databaseDelete" });
  const databaseFull = await Permission.findOne({ name: "databaseFull" });

  const resources = [
    {
      name: "Compute",
      permissions: [
        computeRead._id,
        computeWrite._id,
        computeDelete._id,
        computeFull._id,
      ],
      description: "Compute resources for cloud services (e.g., VMs, Servers)",
    },
    {
      name: "Blob",
      permissions: [blobRead._id, blobWrite._id, blobDelete._id, blobFull._id],
      description: "Blob storage resources in cloud services",
    },
    {
      name: "Network",
      permissions: [
        networkRead._id,
        networkWrite._id,
        networkDelete._id,
        networkFull._id,
      ],
      description: "Network resources for cloud services (e.g., VPC, Subnets)",
    },
    {
      name: "Database",
      permissions: [
        databaseRead._id,
        databaseWrite._id,
        databaseDelete._id,
        databaseFull._id,
      ],
      description: "Database resources in cloud services",
    },
  ];

  for (const resource of resources) {
    const existingResource = await Resource.findOne({ name: resource.name });
    if (!existingResource) {
      await Resource.create(resource);
    }
  }

  console.log("Resources initialized");
};

initializeResources()
  .then((res) => {
    console.log(res);
  })
  .catch((err) => {
    console.error("Error initializing resources:", err);
  });
