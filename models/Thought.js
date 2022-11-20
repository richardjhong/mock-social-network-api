const { Schema, model, Types } = require('mongoose')

const reactionSchema = new Schema(
  {
    reactionId:
    {
      type: Types.ObjectId,
      default: new Types.ObjectId
    },
    reactionBody:
    {
      type: String,
      required: true,
      maxLength: 280
    },
    username: 
    {
      type: String,
      required: true,
    },
    createdAt:
    {
      type: Date,
      default: Date.now,
    }
  },
  {
    _id: false
  }
)

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
    reactions: [reactionSchema],
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

const Thought = model('thought', thoughtSchema)

module.exports = Thought