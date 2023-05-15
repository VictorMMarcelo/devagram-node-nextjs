import type { NextApiRequest, NextApiResponse } from "next";
import type {RespostaPadraoMsg} from '../../types/RespostaPadraoMsg';
import type {cadastroRequisicao} from '../../types/cadastroRequisicao';
import {UsuarioModel} from '../../models/UsuarioModels'
import md5 from "md5";
import {conectarMongoDB} from "../../middlewares/conectarMongoDB";


const endpointCadastro = async( req:NextApiRequest, res:NextApiResponse <RespostaPadraoMsg> ) =>{
    if(req.method == 'POST'){
        const usuario = req.body as cadastroRequisicao;

        if(!usuario.nome || usuario.nome.length < 2){
            return res.status(400).json({erro:'Nome invalido'});
        }

        if(!usuario.email || usuario.email.length<6 || !usuario.email.includes('@') || !usuario.email.includes('.')){
            return res.status(400).json({erro:'Email invalido'});
        }

        if (!usuario.senha || usuario.senha.length < 4){
            return res.status(400).json({erro: 'Senha invalida'});
        }
        //validacao se ja existe usuario com o mesmo email 
        const usuarioComMesmoEmail = await UsuarioModel.find({email: usuario.email});
        if(usuarioComMesmoEmail && usuarioComMesmoEmail.length > 0){
            return res.status(400).json({erro: 'Ja existe uma conta com o email informado'})
        }
        //Salvar banco de dados 
        const usuarioASersalvo = {
            nome : usuario.nome,
            email : usuario.email,
            senha : md5(usuario.senha)
        }
        await UsuarioModel.create(usuarioASersalvo);
        return res.status(200).json({msg: 'Usuario Cadastrado'});
    }
    return res.status(405).json({erro:'Metodo informado nao e valido'});
}

export default conectarMongoDB(endpointCadastro);