const xlsx = require("node-xlsx");
const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const fs = require("fs");
const sendAcknowledgement = require("./send-ack.service");

const handleBulkUser = async (path) => {
  try {
    const xlExport = [];
    const xlFile = xlsx.parse(path);

    await Promise.all(
      xlFile[0].data.map(async (item, idx) => {
        let emailStat = "Email Sent";
        if (idx === 0) {
          xlExport.push([...item, "Created", "Reason", "Acknowledgement"]);
          return;
        }
        const email_exists = await userModel.findOne({ email: item[2] });
        const phone_exists = await userModel.findOne({ phoneNumber: item[3] });
        if (email_exists || phone_exists) {
          xlExport.push([...item, "No", "Already Exists", "Not sent"]);
          return;
        }
        const user = new userModel({
          name: `${item[0]} ${item[1]}`,
          email: item[2],
          phoneNumber: item[3],
          password: "pass123",
        });
        sendAcknowledgement(user.email)
          .then()
          .catch((err) => {
            emailStat = "Not sent";
          });
        user.password = await bcrypt.hash(user.password, 10);
        await user.save();
        xlExport.push([...item, "Yes", "Created", emailStat]);
      })
    );

    const buffer = xlsx.build([{ name: "Creation Sheet", data: xlExport }]);
    fs.writeFileSync("./exports/export.xlsx", buffer);
  } catch (err) {
    console.log(err);
  }
};

module.exports = handleBulkUser;
