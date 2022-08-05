const express = require('express');
const bodyParser = require("body-parser");
var cors = require('cors');
var axios = require('axios');
var qs = require('qs');
require('dotenv').config()
const port = process.env.PORT || 3000;
const app = express();
var cron = require('node-cron');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'));

const {User, ChannelGroup} = require('./db/database');
const slackWebApi = require('./services/slackWebApi');


console.log(process.env.SLACK_BOT_TOKEN);

cron.schedule('0 23 * * Friday', () => {

  User.find({permament: true}, function(err, users) 
  {
     if (err)
     {
         res.send(err);
     }
     console.log(users);
  
     users.forEach(user => {
      let channelId = user.channelId;
      let userId = user.memberId
  
      slackWebApi.kickUser(channelId, userId);
     });
  
  });

});



app.get('/api/all-channels', async function (req, res) {
  const channels = await slackWebApi.getAllChannels().then(result => result);
  var channelNameId = [];

  channels.channels.forEach(channel => {
    channelNameId.push({name: channel.name, id: channel.id});
  });

  res.send(channelNameId);

});



app.get('/api/channels-info', async function (req, res) {

    const channels = await slackWebApi.getAllChannels().then(result => result);
    const allMembers = await slackWebApi.getAllUsers().then(result => result);
    // const channelMembers = await getChannelMembers('CS62VCEMB').then(result => result);

    // res.send(allMembers);


    var data = [];

    // channels.channels.forEach( async (channel, index) => {
    for(index = 0; index < channels.channels.length; index++){

        if (index < 1) {
            var channel = channels.channels[index];
            // console.log(channel)
            var channelId = channel.id;
            channelMembers = await slackWebApi.getChannelMembers(channelId).then(result => result);

            channelMembers.members.forEach((memberId, i) => {
                var info = {};

                info.channelId = channelId;
                info.channelName = channel.name;
                info.archived = channel.is_archived;
                info.private = channel.is_private;
                info.memberId = memberId;

                
                allMembers.members.forEach(member => {
                    // console.log('---', member.id);

                    if (memberId === member.id) {
                        info.memberName = member.profile.real_name;
                    }

                });


                data.push(info);
            });

        }

    };

    res.send(data);

})


app.get('/api/users', async function (req, res) {
  User.find({}, function(err, users) {
    res.send(users);
  })
});

app.get('/api/channel/groups', async function (req, res) {
  
  ChannelGroup.find({}, function(err, groups) {
    res.send(groups);  
  })

});


app.post('/api/permament', async function (req, res) {
  let isChecked = req.body.isChecked;
  let userId = req.body.userId;
  let channelId = req.body.channelId;
  isChecked = isChecked === 'true' ? true : false;

  console.log(isChecked, userId, channelId, typeof isChecked);

  const filter = {memberId: userId,channelId:channelId};
  const update = { permament: isChecked };

  let user = await User.findOneAndUpdate(filter, update);

  console.log(user);

  // if (isChecked === 'true'){
  //   slackWebApi.kickUser(channelId, userId);
  // } else {
  //   slackWebApi.inviteUser(channelId, userId);
  // }

});




app.post('/api/channel/group/create', async function (req, res) {

  let data = [];
  let groupName = req.body.groupName;
  let channels = req.body.channels;
  channels = JSON.parse(channels);

  console.log(groupName, channels);

  channels.forEach(channel => {
    let info = {};

    const channelParts = channel.split('~');
    info.channelId = channelParts[0];
    info.channelName = channelParts[1];
    data.push(info);
  });


  console.log(data);


  const group = new ChannelGroup({
    name: groupName,
    channels: data,
  });
  
  group.save();

  res.end("yes");

});


app.post('/api/slack/send/invitation', async function (req, res) {
  let channels = [];

  let singleChannels = req.body.singleChannels;
  let groupChannels = req.body.groupChannels;
  let memberId = req.body.userId;
  console.log(memberId);


  singleChannels = JSON.parse(singleChannels);
  groupChannels = JSON.parse(groupChannels);

  singleChannels.forEach(channel => {
    const channelParts = channel.split('~');
    let channelId = channelParts[0];
    channels.push(channelId);
  });

  for(let i=0; i<groupChannels.length; i++){
    let groupId = groupChannels[i];
    let group = await ChannelGroup.findById(groupId);

    group.channels.forEach(channel => {
      channels.push(channel.channelId)
    });
  }

  console.log('----', channels);

  // memberId = 'U03H9KNG2NP';

  channels.forEach(channelId => {
    console.log('---', channelId);
    slackWebApi.inviteBotToChannels(channelId);
    slackWebApi.inviteToChannel(memberId, channelId) 
  });

  

  // let u = "U029VBQUQGN";
  // let ch = "C03HVUU2LKE";
  // slackWebApi.inviteToChannel(u, ch);



  res.send("yes");

});




app.get('/api/save-users', async function (req, res) {

  const channels = await slackWebApi.getAllChannels().then(result => result);
  const allMembers = await slackWebApi.getAllUsers().then(result => result);
  // const channelMembers = await getChannelMembers('CS62VCEMB').then(result => result);

  // res.send(allMembers);


  var data = [];

  // channels.channels.forEach( async (channel, index) => {
  for(index = 0; index < channels.channels.length; index++){

      // if (index < 1) {
          var channel = channels.channels[index];
          // console.log(channel)
          var channelId = channel.id;
          channelMembers = await slackWebApi.getChannelMembers(channelId).then(result => result);

          channelMembers.members.forEach((memberId, i) => {
              var info = {};

              info.channelId = channelId;
              info.channelName = channel.name;
              info.archived = channel.is_archived;
              info.private = channel.is_private;
              info.memberId = memberId;

              
              allMembers.members.forEach(member => {
                  // console.log('---', member.id);

                  if (memberId === member.id) {
                      info.memberName = member.profile.real_name;
                  }

              });

              const user = new User(info);
              user.save();

              
              if (i == 0) {
                console.log(info);
              }


              data.push(info);
          });

      // }

  };

  res.send(data);

})





app.get('/slack/command/kick', async function (req, res) {
  
  console.log(req.body)
  
});




app.listen(port, () => {
    console.log(`Application is running on port ${port}`);
});








// const { App } = require('@slack/bolt');
// const sapp = new App({
//   token: process.env.SLACK_BOT_TOKEN,
//   signingSecret: process.env.SLACK_SIGNING_SECRET
// });

// (async () => {
//   await sapp.start(process.env.PORT || 8000);
//   console.log('⚡️ Bolt app is running!');
// })();