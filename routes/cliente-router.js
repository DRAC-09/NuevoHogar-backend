const express = require('express');
const cliente = require('../models/cliente');
const correoModule = require('../modules/correo-module');

const router = express.Router();


//GET - Obtener todos los usuarios
router.get('/', async (req, res) =>{
    const clientes = await cliente.find();
    res.send(clientes);
})

//GET - Obtener todos los clientes
router.get('/clientes', async (req, res) =>{
    const clientes = await cliente.find({rol: 'cliente'});
    res.send(clientes);
})

//GET - Obtener todos los administradores
router.get('/administradores', async (req, res) =>{
    const clientes = await cliente.find({rol: 'administrador'});
    res.send(clientes);
})

//GET - Obtener todos los administradores
router.get('/colaboradores', async (req, res) =>{
    const clientes = await cliente.find({rol: 'colaborador'});
    res.send(clientes);
})



//POST - Registrar usuario
router.post('/register', async (req, res)=>{
    let user = await cliente.findOne({correo: req.body.correo});
    if(user){
        return res.status(401).send('Usuario ya existe!');
    }else{
        const user= new cliente(
            {
                nombre: req.body.nombre,
                identidad: req.body.identidad,
                direccion: req.body.direccion,
                sexo: req.body.sexo,
                fechaNacimiento: req.body.fechaNacimiento,
                celular: req.body.celular,
                telefono: req.body.telefono,
                correo: req.body.correo,
                contrasenia: req.body.contrasenia,   
                rol: req.body.rol    
            }
        );
        //Enviar correo de confirmación
        correoModule.enviarCorreo(req.body.correo, req.body.nombre); 
        //Insertar registro a la DB
        await user.save().then(resultado=>{
            res.send({mensaje:'registro guardado', cliente: user});
            res.end();     
        }).catch(error=>{
            res.send(error);
            res.end();
        })
    } 
})


//POST - Login usuario
router.post('/login', async (req, res) => {
    const { correo, contrasenia } = req.body;                                                               // Obteniendo datos del body
    const user = await cliente.findOne({correo: correo})                                                           // Buscando usuario en la base de datos
    if(!user) return res.status(401).send('Usuario y/o Contraseña incorrectos');
    if(user.contrasenia !== contrasenia) return res.status(401).send('Usuario y/o Contraseña incorrectos');
    return res.status(200).json({
        id: user.id,
        rol: user.rol,
    });
});


//GET - Cambio de contraseña
router.put('/changePassword', async (req, res) =>{
    const {correo, contrasenia} = req.body;
    const user = await cliente.findOne({correo: correo})
    if(!user) return res.status(401).send('Correo incorrecto');
    const clienteNuevo = {
        contrasenia: contrasenia
    }
    await cliente.findByIdAndUpdate({correo: correo}, clienteNuevo, {useFindAndModify: false});
    res.json({
        status: 'contraseña actualizada'
    });
    return res.status(200).json(user);
})

//GET - Obtener informacion usuario
router.get('/:id', async (req, res) =>{
    await cliente.find(
        {
            _id: req.params.id
        },
        {
            nombre:true,
            identidad:true,
            direccion:true,
            sexo:true,
            fechaNacimiento:true,
            celular:true,
            telefono:true,
            correo:true,
            fotoPerfil:true,
            rol:true,
            historial: true
        }
    ).then(result=>{
        res.send(result[0]);
        res.end();
    }).catch(error=>{
        res.send(error);
        res.end();
    })
});

//PUT - Actualizar informacion usuario
router.put('/actualizar/:id', async (req, res) =>{
    await cliente.updateOne({
        _id: req.params.id
    },
    {   nombre: req.body.nombre,
        identidad: req.body.identidad,
        direccion: req.body.direccion,
        sexo: req.body.sexo,
        fechaNacimiento: req.body.fechaNacimiento,
        celular: req.body.celular,
        telefono: req.body.telefono,
        correo: req.body.correo,
        fotoPerfil: req.body.fotoPerfil,
        rol: req.body.rol,
        modificacion: new Date()
    }).then(result=>{
        res.send(result);
        res.end();
    }).catch(error=>{
        res.send(error);
        res.end();
    })
})



// PUT - Añadir una mascota
router.post('/:id/agregarMascota', function (req, res) {
    cliente.updateMany(
        {
            _id: req.params.id
        },
        {
            $push:{
                historial: {
                    _id:        req.body.id,
                    nombre:     req.body.nombre,
                    edad:       req.body.edad,
                    raza:       req.body.raza,
                    sexo:       req.body.sexo,
                    imagen:     req.body.imagen,
                }
            }
        }
    ).then(resultado => {
        res.send(resultado);
        res.end();
    })
    .catch(error => {
        res.send(error);
        res.end();
    })
});



module.exports = router;