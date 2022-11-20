const { Schema, Types } = require('mongoose')

const reactionSchema = new Schema(
  {
    reactionId:
    {
      type: Types.ObjectId,
      default: () => new Types.ObjectId()
    },
    reactionBody:
    {
      type: String,
      required: true,
      maxlength: 280
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
    toJSON: {
      getters: true
    },
    _id: false
  }
)

reactionSchema
  .virtual('formattedDate')
  .get(function() {
    return this.createdAt.toLocaleDateString()
  })

module.exports = reactionSchema