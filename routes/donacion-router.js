const express = require('express');
const donacion = require('../models/donacion');
const router = express.Router();


//GET - Obtener todas las donaciones
router.get('/', async (req, res) =>{
    const donation = await donacion.find();
    res.send(donation);
})

//POST - Nueva donacion
router.post('/agregar', (req, res)=>{
    let donation = new donacion(
        {
        descripcion:         req.body.descripcion,
        benefactor:          req.body.benefactor,
        numeroDeposito:      req.body.numeroDeposito,
        entidadBancaria:     req.body.entidadBancaria,
        fechaDonativo:       req.body.fechaDonativo,
        observaciones:       req.body.observaciones,
        correo:              req.body.correo          
        });

        donation.save().then(resultado=>{
            res.send({mensaje:'Donacion agregada con exito', donacion: donation});
            res.end();     
        }).catch(error=>{
            res.send(error);
            res.end();
        })
})

module.exports = router;