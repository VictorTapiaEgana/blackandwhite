import express from 'express';
import Jimp from 'jimp';
import { v4 as uuid } from 'uuid';
import path from 'path';

const app = express();

app.use('/assets',express.static(path.join(process.cwd(),'public')));

app.get('/',(req,res)=>{    
    res.sendFile(path.join(process.cwd(),'/pages/index.html'))    
});

app.get('/procesarimagen',async (req,res)=>{

    const { nombreImagen ,selectImagenes } = req.query;

    if (nombreImagen != '' || selectImagenes != undefined){

        let ImagenATransformar = '';

        nombreImagen 
        ? ImagenATransformar = nombreImagen 
        : ImagenATransformar = selectImagenes;
        

            const nombreNuevaImagen = `${uuid().slice(0,8)}.jpeg`;

            const NuevaImagen = path.join(process.cwd(),`public/imagenes/${nombreNuevaImagen}`);    

            const imagen = await Jimp.read( ImagenATransformar )
            
              await imagen         
                .grayscale()
                .quality(100)
                .resize(350,Jimp.AUTO)
                .writeAsync( NuevaImagen )

            res.send(
                     `<body style="background-color: #212529;color:#6c757d;">            
                        <h1 style="text-align:center;">Resultado imagenes Procesadas</h1>

                        <section style="display:flex; justify-content: center; gap:50px">

                            <div style="width:600px;">
                              <h2>Original</h2>
                                <img src="${ ImagenATransformar }" style="max-width: 100%; height: auto;" alt="Imagen Original">
                            </div>
                            
                            <div style="width: 600px;display:flex;flex:0;flex-direction: column;">
                              <h2>Modificada</h2>
                                <img src="/assets/imagenes/${nombreNuevaImagen}" alt="Imagen en escala de grises">
                                <strong>Nombre del Arhivo: ${nombreNuevaImagen}</strong>
                            </div>

                        </section>

                      </body>`
            );
    }else{

          res.status(400).send('Datos incompletos')

    }
});

app.listen(3010,()=>{
    console.clear()
    console.log(`Holiwis en puerto: 3010`)
});