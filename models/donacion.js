const mongoose = require('mongoose');

var esquema = new mongoose.Schema({
          descripcion:         {type: String, required: true},
          benefactor:          {type: String, required: true},
          numeroDeposito:      {type: String, required: true},
          entidadBancaria:     {type: String, required: true},
          fechaDonativo:       {type: String, required: true},
          observaciones:       {type: String, required: true},
          correo:              {type: String, required: true}
});

module.exports = mongoose.model('donaciones', esquema);