import express from 'express';
import Jimp from 'jimp';
import { v4 as uuid } from 'uuid';
import path from 'path';
import { create } from 'express-handlebars';

const app = express();

const hbs = create({ 
                   extname: '.hbs',   
                   layoutsDir:path.join(process.cwd(),'/views') ,
                   partialsDir:path.join(process.cwd(),'/views/componentes') ,
                   defaultLayout:false
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', './views');

app.use('/assets',express.static(path.join(process.cwd(),'public')));
app.use('/tmp',express.static('/tmp'));

app.get('/',(req,res)=>{       
    res.render('index.hbs')
});

app.get('/procesarimagen',async (req,res)=>{

    const { nombreImagen ,selectImagenes } = req.query;

    if (nombreImagen != '' || selectImagenes != undefined){

        let ImagenATransformar = '';

        nombreImagen 
        ? ImagenATransformar = nombreImagen 
        : ImagenATransformar = selectImagenes;

            const nombreNuevaImagen = `${uuid().slice(0,8)}.jpeg`;            
            const NuevaImagen = `/tmp/${nombreNuevaImagen}`       
            const imagen = await Jimp.read( ImagenATransformar );
            
              await imagen         
                   .grayscale()
                   .quality(60)
                   .resize(350,Jimp.AUTO)
                   .writeAsync( NuevaImagen )

                res.render('procesarimagen.hbs',{
                     imagenOriginal:ImagenATransformar,
                     ImagenTransformada:nombreNuevaImagen
                })
    }else{
        
        res.render('index.hbs',{
            error:"Ingrese una ruta URL o seleccion una imagen"                   
        });

    }
});

app.listen(3010,()=>{
    console.clear()
    console.log(`Holiwis en puerto: 3010`)
});