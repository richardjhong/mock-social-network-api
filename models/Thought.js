const { Schema, model, Types } = require('mongoose')

const thoughtSchema = new Schema(
  {
    thoughtText: 
    {
      type: String,
      required: true,
      maxLength: 280
    },
    createdAt: 
    {
      type: Date,
      default: Date.now,
    },
    username: 
    {
      type: String,
      required: true
    },
    reactions: [{ type: Types.ObjectId, ref: 'reaction' }],
  },
  {
    toJSON: {
      virtuals: true
    },
    id: false
  }
)

thoughtSchema
  .virtual('reactionCount')
  .get(function () {
  return this.reactions.length
})

// thoughtSchema.methods.



const Thought = model('thought', thoughtSchema)

module.exports = Thought