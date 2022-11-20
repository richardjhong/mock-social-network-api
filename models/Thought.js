const { Schema, model, Types } = require('mongoose')
const Reaction = require('./Reaction')

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
    reactions: [Reaction],
  },
  {
    toJSON: {
      virtuals: true,
      getters: true
    },
    id: false
  }
)

thoughtSchema
  .virtual('reactionCount')
  .get(function () {
    return this.reactions.length
  })

thoughtSchema
  .virtual('formattedDate')
  .get(function() {
    return this.createdAt.toLocaleDateString()
  })

const Thought = model('thought', thoughtSchema)

module.exports = Thought