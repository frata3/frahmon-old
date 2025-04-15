// const mongoose = require('mongoose');

// async function cleanAllCollections() {
//   await mongoose.connect('mongodb://localhost:27017/frahmonDB');

//   const collections = await mongoose.connection.db.listCollections().toArray();

//   for (const { name } of collections) {
//     console.log(`Cleaning ${name}...`);
//     await mongoose.connection.db.collection(name).updateMany(
//       {},
//       {
//         $unset: {
//           __v: "",
//           createdAt: "",
//           updatedAt: ""
//         }
//       }
//     );
//   }

//   console.log("Done.");
//   await mongoose.disconnect();
// }

// cleanAllCollections();
