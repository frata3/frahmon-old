import { Schema, model } from 'mongoose';


const topicSchema = new Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  categories: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
  description: { type: String },
});


export default model('Topic', topicSchema);
  