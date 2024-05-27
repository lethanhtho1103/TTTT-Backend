const nodemailer = require("nodemailer");

class Order {
  async sendEmail(req, res) {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.GOOGLE_APP_EMAIL,
        pass: process.env.GOOGLE_APP_PASSWORD,
      },
    });
    console.log("Start send email");

    try {
      await transporter.sendMail({
        from: '"TTTT-Shop 👻" <foo@example.com>', // sender address
        to: `${req.body.email}`, // list of receivers
        subject: "Xác nhận đặt hàng thành công ✔", // Subject line
        text: "Hello world?", // plain text body
        html: "<b>Hello world?</b>", // html body
      });
      console.log("End send email");
    } catch (error) {
      console.log(error.message);
    }
    return res.status(200).json({
      message: "Gửi email xác nhận thành công",
      data: { email: req.body.email },
    });
  }
}

module.exports = new Order();
