const xlsx = require("node-xlsx");
const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const fs = require("fs");
const sendAcknowledgement = require("./send-mail.service");
const { uploadFileBuffer } = require("../utils/s3.config");

const handleBulkUser = async (fileBuffer) => {
  try {
    const xlExport = [];
    const xlFile = xlsx.parse(fileBuffer);
    console.log(xlFile);

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
            console.log(err);
            emailStat = "Not sent";
          });
        user.password = await bcrypt.hash(user.password, 10);
        await user.save();
        xlExport.push([...item, "Yes", "Created", emailStat]);
      })
    );

    const buffer = xlsx.build([{ name: "Creation Sheet", data: xlExport }]);
    const result = await uploadFileBuffer("exports", buffer);
    return result;
  } catch (err) {
    console.log(err);
  }
};

module.exports = handleBulkUser;
