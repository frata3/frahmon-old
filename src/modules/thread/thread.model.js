const { Schema, model } = mongoose;

const threadSchema = new Schema({
    slug: { type: String, required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    tags: [{ type: Schema.Types.ObjectId, ref: "Tag" }],
});

const Thread = model("Thread", threadSchema);
module.exports = Thread;
