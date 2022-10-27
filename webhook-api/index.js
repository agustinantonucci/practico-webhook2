const authenticationToken = "777";

const express = require("express");
const nodemailer = require("nodemailer");
const app = express();
const bodyParser = require("body-parser");

const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.json({ message: "Bienvenido al webhook de medicos." });
});

app.get("/webhook", (req, res) => {
  if (req.headers.authorization === authenticationToken) {
    res.sendStatus(200);
  } else {
    res.sendStatus(401);
  }
});

app.post("/webhook", function (req, res) {
  if (req.headers.authorization === authenticationToken) {
    let webhook = JSON.stringify(req.body);

    let parseo = JSON.parse(webhook);

    let claves = Object.keys(req.body);

    let texto = "";

    for (let i = 0; i < claves.length; i++) {
      let clave = claves[i];
      console.log(parseo[clave]);
      texto += `
        <h1>${clave.toUpperCase()}</h1>
        <h4>${JSON.stringify(parseo[clave])}</h4>
      `;
    }

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: "agustinantonucci@gmail.com",
        pass: "iryjedpzkkkyczbo",
      },
    });

    const envioMensaje = async () => {
      const info = await transporter.sendMail({
        from: '"Enviado desde webhook medicos" <agustinantonucci@gmail.com>',
        to: "agustinantonucci@gmail.com",
        subject: "Enviado desde webhook medicos",
        html: texto,
      });
      return info;
    };

    try {
      const info = envioMensaje()
        .then((info) => {
          return info;
        })
        .catch((error) => {
          console.log("Error envio de mensaje:", error);
        });

      info.then((val) => {
        console.log("Mail enviado");
        return res.status(200).json({ message: "Mail enviado" });
      });
    } catch (error) {
      emailStatus = error;
      return res
        .status(400)
        .json({ message: "Algo salió mal al enviar el mail." });
    }
  } else {
    res.sendStatus(401);
    console.log("Error autenticación");
  }
});

app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}.`);
});
