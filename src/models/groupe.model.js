import { ObjectId, Schema, createCollection } from "../config/mongoose.config.js";

const groupeSchema = new Schema({
  title: {
    type: String,
    required: [true, "Groupe's title required"],
  },
  //   members: [{ type: ObjectId, ref: "User" }],
});

const Groupe = createCollection("Groupe", groupeSchema);

export default Groupe;
