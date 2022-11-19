const { Schema, model } = require('mongoose')

const formatDate = () => {
  const date = new Date()
  return date.toDateString()
}

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