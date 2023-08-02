import type{NextApiRequest, NextApiResponse} from 'next';
import type {RespostaPadraoMsg} from "@/types/RespostaPadraoMsg";
import { conectarMongoDB } from '@/middlewares/conectarMongoDB';
import { validarTokenJWT } from '@/middlewares/validarTokenJWT';
import { UsuarioModel } from '@/models/UsuarioModels';
import { politicaCORS } from '@/middlewares/politicaCORS';

const pesquisaEndpoint = async(req : NextApiRequest, res : NextApiResponse<RespostaPadraoMsg | any[]>) =>{
    try {
        if (req.method === 'GET'){
           if (req?.query?.id){
            const usuarioEncontrados = await UsuarioModel.findById(req?.query?.id);
            if(!usuarioEncontrados){
                return res.status(400).json({erro : 'Usuario nao encontrado'});

            }
            usuarioEncontrados.senha = null;
            return res.status(200).json(usuarioEncontrados);

           }else{
            const {filtro} = req.query;

            if (!filtro || filtro.length < 2){
                return res.status(400).json({erro : 'Favor informar Pelo menos dois caracteres para busca'});
            }

            const usuarioEncontrados = await UsuarioModel.find({
                $or: [ {nome : {$regex : filtro, $options : 'i'}},
                //{ email : {$regex : filtro, $options : 'i'}}
            ]
            });
            return res.status(200).json(usuarioEncontrados);


           }
        }
    }catch(e){
        console.log(e);
        return res.status(500).json({erro: 'Nao foi possivel buscar usuarios:' + e});
    }
}

export default politicaCORS(validarTokenJWT(conectarMongoDB(pesquisaEndpoint)));