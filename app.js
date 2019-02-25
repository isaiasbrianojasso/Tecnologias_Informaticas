///////////////////////////////////////INICIALIZA EXPRESS//////////////////////////////////////
const express = require("express");
const bodyParser = require("body-parser");
var app = express();
///////////////////////////////////////REQUIERE MODIFICAR ARCHIVOS//////////////////////////////////////
const archivos = require('fs'); //FILE SYSTEM
///////////////////////////////////////DB HANDLER//////////////////////////////////////
var db = {
  ///////////////////////////////////////ABRIR  CONEXION //////////////////////////////////////
  initDB: function () {
    var fs = require("fs");
    var contents = fs.readFileSync("./alumnos.json");
    this.alumnos = JSON.parse(contents);
  },
  ///////////////////////////////////////BUSQUEDA ALUMNOS//////////////////////////////////////
  getAlumnoBy: function (filter, value) {
    console.log("filtro: " + filter + "valor: " + value);
    var selected = null;
    this.alumnos.forEach(alumno => {
      console.log(alumno);
      console.log(alumno[filter]);
      if (alumno[filter] == value) {
        selected = alumno;
        return selected;
      }
    });
    return selected;
  },
  ///////////////////////////////////////ELIMINAR ALUMNOS//////////////////////////////////////
  //Eliminar un alumno por la clave
  deleteAlumnoByClave: function (clave) {
    var index;
    //Buscamos el indice del alumno
    for (index = 0; index < this.alumnos.length; index++) {
      if (this.alumnos[index].clave == clave)
        break;
    }
    //Si se encontro el indice se elimina
    if (index < db.alumnos.length) {
      delete db.alumnos[index];
      db.alumnos.splice(index, 1);
      db.saveAlumnos();
    }
  },
  ///////////////////////////////////////EDITAR ALUMNOS//////////////////////////////////////
  editAlumnoByClave: function (clave,nombre) { //*agrege nombre
    var index;
    //Buscamos el indice del alumno
    for(index = 0; index < this.alumnos.length; index++) {
      if (this.alumnos[index].clave ==   db.alumnos[index].clave) //si clave y nombre estan en el mismo indce hace la funcion de abajo 
    
      break;
    }
    //Si se encontro el indice se edita ya lo tengo selecionado 
    if (index < db.alumnos.length) {
     db.alumnos[index].nombre = nombre; //unciona no modifica el nombre
      db.alumnos[index].clave = clave; //funciona modifica la clave
      db.saveAlumnos();
    }
  },
  ///////////////////////////////////////GUARDAR ALUMNOS//////////////////////////////////////

  saveAlumnos: function () {
    archivos.writeFileSync('alumnos.json', JSON.stringify(this.alumnos),
      function (error) {
        if (error) {
          console.log('Hubo un error al escribir en el archivo')
          console.log(error);
        }
      });
  }
  ///////////////////////////////////////FINALIZA GUARDAR ALUMNOS//////////////////////////////////////
}
///////////////////////////////////////FINALIZA DB HANDLER//////////////////////////////////////


///////////////////////////////////////AQUI SE RECIBEN LOS POST,DELETE Y PUT//////////////////////////////////////
app.use(express.static('assets'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.get('/', function (req, res) {
  res.sendfile("index.html");
});

app.route("/alumnos")
  .get((req, res) => {
    db.initDB();
    res.json(db.alumnos);
  })

  .post((req, res) => {
    db.initDB();
    var alumno = req.body;
    console.log("Objeto post recibido");
    console.log(alumno);
    db.alumnos.push(alumno);
    db.saveAlumnos();
    res.json({ 'status': 'OK' });
  })

  .put((req, res) => {
    //envio los datos por el metodo put.... indentificando la clave como base
    db.initDB();
    var alumno = req.body;
    console.log("Objeto put recibido");
    console.log(alumno);
    db.editAlumnoByClave(alumno.clave,alumno.nombre); //*agrege nombre para
    console.log(db.alumnos);
    res.json({ 'status': 'OK' });
  })

  .delete((req, res) => {
    db.initDB();
    var alumno = req.body;
    console.log("Objeto delete recibido");
    console.log(alumno);
    db.deleteAlumnoByClave(alumno.clave);
    console.log(db.alumnos);
    res.json({ 'status': 'OK' })
  });

app.get('/alumnos/:clave', (req, res) => {
  db.initDB();
  var clave = req.params.clave;
  var alumno = db.getAlumnoBy('clave', clave);
  res.json(alumno);
});

app.listen(3000, function () {
  console.log("Started on PORT 3000");
})
