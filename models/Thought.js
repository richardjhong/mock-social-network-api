const { Schema, model } = require('mongoose')

const formatDate = () => {
  const date = new Date()
  return date.toDateString()
}

const reactionSchema = new Schema(
  {
    reactionId:
    {
      type: Schema.Types.ObjectId,
      default: new Schema.Types.ObjectId
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
      get: formatDate
    }
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
      get: formatDate
    },
    user: 
    {
      type: String,
      required: true
    },
    reactions: [reactionSchema]
  }
)

thoughtSchema.virtual('reactionCount').get(function () {
  return this.reactions.length
})

const Thought = model('thought', thoughtSchema)

module.exports = Thought