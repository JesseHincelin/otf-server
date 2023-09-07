import { createCollection, ObjectId, Schema } from "../config/mongoose.config.js";

const categorieSchema = new Schema({
  name: {
    type: String,
    required: [true, "Categorie's name required"],
  },
  createdBy: { type: ObjectId, ref: "User" },
  color: String,
});

const Categorie = createCollection("Categorie", categorieSchema);

export default Categorie;
