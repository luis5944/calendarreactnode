const express = require("express");
const { dbConnection } = require("./database/config");
const cors = require("cors");
require("dotenv").config();

//Crear el servidor de express
const app = express();

//Conexión con BD
dbConnection();

//CORS (PROTEGER RUTAS)
app.use(cors());

//Mostrar Directorio público
app.use(express.static("public"));

//lectura y parseo del body en los POST
app.use(express.json());

//Rutas
//Siginifica que todo lo que vamos a utilizar en require(auth)
// lo va a utilizar en /api/auth
app.use("/api/auth", require("./routes/auth"));
app.use("/api/events", require("./routes/events"));

//Escuchar peticiones
app.listen(process.env.PORT, () => {
  console.log(`Servidor corriendo en puerto ${process.env.PORT}`);
});
