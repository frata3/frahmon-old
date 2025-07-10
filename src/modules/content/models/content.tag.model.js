import { Schema, model } from 'mongoose';


const tagSchema = new Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  topics: [{ type: Schema.Types.ObjectId, ref: 'Topic' }],
});


export default model('Tag', tagSchema);
  