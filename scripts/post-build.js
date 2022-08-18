const fs = require("fs");

const d = new Date();
const year = d.getFullYear().toString();
const month = (d.getMonth() + 1).toString();
const date = d.getDate().toString();
const hour = d.getHours().toString();
const minutes = d.getMinutes().toString();

// version=${year:3:1}.${month}${date}.${time:0:3}
const version = `${year.slice(-1)}.${month}${date}.${hour}${minutes.slice(
  -2,
  -1
)}`;

fs.writeFile("./build/version.json", version, (err) => {
  if (err) {
    console.error(err);
  }
});
