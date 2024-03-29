import multer from "multer";
import cosmicjs from "cosmicjs";

const {
    CHAVE_GRAVACAO_AVATARES,
    WRITE_PUBLICACOES,
    BUCKET_AVATAR,
    BUCKET_PUBLICACAO
}=process.env;


    const Cosmic=cosmicjs();
    const bucketAvatares=Cosmic.bucket({
        slug: BUCKET_AVATAR,
        write_key: CHAVE_GRAVACAO_AVATARES
    });
    const bucketPublicacoes=Cosmic.bucket({
        slug:  BUCKET_PUBLICACAO,
        write_key: WRITE_PUBLICACOES
    });

    const storage=multer.memoryStorage();
    const upload=multer({storage : storage});
    
    const uploadImagemCosmic=async(req : any) => {
        if(req?.file?.originalname){
            const media_object={
                originalname: req.file.originalname,
                buffer : req.file.buffer};

            if(req.url && req.url.includes('publicacao')){
                return await bucketPublicacoes.addMedia({media : media_object});
            }else{
               console.log(media_object);
              return await bucketAvatares.addMedia({media : media_object});
               

            }
        }
    }
    export {upload, uploadImagemCosmic};