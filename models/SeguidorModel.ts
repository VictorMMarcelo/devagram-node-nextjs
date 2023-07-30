import mongoose,{Schema} from "mongoose";

const SeguidorSchema = new Schema({
    usuarioId : {type : String , require : true},
    usuarioSeguidoId : {type : String, required : true}
});

export const SeguidorModel = (mongoose.models.seguidores || mongoose.model('seguidores',SeguidorSchema));