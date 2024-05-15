const app = require("./app");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
dotenv.config({ path: "./config.env" });

process.on("uncaughtException", (err) => {
  console.log(err);
  process.exit(1);
});

const http = require("http");

const server = http.createServer(app);

//  db connection uri
const DB = process.env.DBURI.replace("cZSXxx8nVMZQkxqq", process.env.DBPASSWORD);

// using mongoose orm for connecting db
mongoose.connect(DB, {
    // 
    // useCreateIndex: true,
    // useFIndAndModify: false,
    // useUnifiedTopology: true,
  })
  .then((con) => {
    console.log("DB Connection is successfull");
  })
  .catch((err) => {
    console.log(err);
  });
const port = process.env.PORT || 8000;

server.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

process.on("unhandledRejection", (err) => {
  console.log(err);
  server.close(() => {
    process.exit(1);
  });
});
