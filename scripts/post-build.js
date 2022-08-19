const fs = require("fs");

const d = new Date()
  .toLocaleString("en-US", {
    timeZone: "Asia/Hong_Kong",
    hour12: false,
  })
  .split(/[\/, :]+/);

const year = d[2];
const month = d[0];
const date = d[1];
const hour = d[3];
const minutes = d[4];

const version = `${year.slice(-1)}.${month}${date}.${hour}${minutes.slice(
  -2,
  -1
)}`;

fs.writeFile("./build/version.json", version, (err) => {
  if (err) {
    console.error(err);
  }
});
