const mongoose = require('mongoose');

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect("mongodb+srv://root2:12345@devcluster.ebkvs.mongodb.net/grow_glide?retryWrites=true&w=majority");
}


// Schema
const userSchema = new mongoose.Schema({
  channelId: String,
  channelName: String,
  private: String,
  archived: Boolean,
  memberId: String,
  memberName: String,
  permament: { type: Boolean, default: false }
});

const channelGroupSchema = new mongoose.Schema({
  name: String,
  channels: []
});



// Model
const User = mongoose.model('User', userSchema);
const ChannelGroup = mongoose.model('ChannelGroup', channelGroupSchema);

// const group = new ChannelGroup({
//   name: "asd",
//   channels: [{'name': "asdasd", "id": "asdasd"}],
// });

// group.save();

// const user = new User({ 
//     channel_id: 'String',
//     channel_name: 'String',
//     channel_type: 'String',
//     archived: true,
//     slack_user_id: 'String',
//     user_name: 'String',
//     permament: false, 
// });
// user.save();
// console.log(user);


exports.User = User;
exports.ChannelGroup = ChannelGroup;