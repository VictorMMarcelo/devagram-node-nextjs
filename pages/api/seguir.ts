import type{NextApiRequest, NextApiResponse} from 'next';
import type {RespostaPadraoMsg} from "@/types/RespostaPadraoMsg";
import { validarTokenJWT } from '@/middlewares/validarTokenJWT';
import { conectarMongoDB } from '@/middlewares/conectarMongoDB';
import { UsuarioModel } from '@/models/UsuarioModels';

const endpointSeguir =async (req : NextApiRequest, res: NextApiResponse<RespostaPadraoMsg>) => {
    try{
        if (req.method === 'PUT'){

            const {userId, id} = req?.query;
            //usuario logado/autenticado = quem esta fazendo as acoes
            const usuarioLogado = await UsuarioModel.findById(userId);
            if(!usuarioLogado){
                return res.status(400).json({erro :'Usuario logado nao encontrado'});
            }

            //id do usuario e ser seguidor
            const usuarioASerSeguido =  await UsuarioModel.findById(id);
            if(!usuarioASerSeguido){
                return res.status(400).json({erro :'Usuario a ser seguido nao encontrado'});
            }
        }
        return res.status(405).json({erro :'Metodo informado nao existe'});
    }catch(e){
        console.log(e);
    return res.status(500).json({erro: 'Nao foi possivel seguir/deseguir o usuario informado'});
    }
}
export default validarTokenJWT(conectarMongoDB(endpointSeguir));