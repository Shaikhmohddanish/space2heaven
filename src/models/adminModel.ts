import { Schema, model, models } from "mongoose"

const AdminSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique:true },
    password: { type: String, required: true },
}, { timestamps: true })

const AdminModel = models.admins_db || model("admins_db", AdminSchema)

export default AdminModel