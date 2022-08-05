const axios = require('axios');
var qs = require('qs');


const getAllChannels = () => {
    var config = {
    method: 'get',
    url: 'https://slack.com/api/conversations.list?types=public_channel,private_channel',
    headers: { 
        'Authorization': `Bearer ${process.env.SLACK_BOT_TOKEN}`
    }
  };

    return axios(config)
    .then(function (response) {
        // console.log(response.data);
        return response.data;
    })
    .catch(function (error) {
    console.log(error);
    });
}

const getAllUsers = () => {
    var config = {
        method: 'get',
        url: 'https://slack.com/api/users.list',
        headers: { 
          'Authorization': `Bearer ${process.env.SLACK_BOT_TOKEN}`
        }
      };
      
      return axios(config)
      .then(function (response) {
        // console.log(JSON.stringify(response.data));
        return response.data
      })
      .catch(function (error) {
        console.log(error);
      });
}

const getChannelMembers = (channelId) => {
    var data = qs.stringify({
   
    });
    var config = {
      method: 'get',
      url: `https://slack.com/api/conversations.members?channel=${channelId}`,
      headers: { 
        'Authorization': `Bearer ${process.env.SLACK_BOT_TOKEN}`
      },
      data : data
    };
    
    return axios(config)
    .then(function (response) {
    //   console.log(JSON.stringify(response.data));
      return response.data;
    })
    .catch(function (error) {
      console.log(error);
    });
}

const inviteToChannel = (memberId, channelId) => {
  var data = qs.stringify({
    'channel': channelId,
    'users': memberId
  });
  var config = {
    method: 'post',
    url: 'https://slack.com/api/conversations.invite',
    headers: { 
      'Authorization': `Bearer ${process.env.SLACK_BOT_TOKEN}`, 
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data : data
  };
  
  axios(config)
  .then(function (response) {
    console.log(JSON.stringify(response.data));
  })
  .catch(function (error) {
    console.log(error);
  });

}

const inviteBotToChannels = (channelId) => {
  var data = qs.stringify({
    'channel': channelId
  });
  var config = {
    method: 'post',
    url: 'https://slack.com/api/conversations.join',
    headers: { 
      'Authorization': `Bearer ${process.env.SLACK_BOT_TOKEN}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data : data
  };
  
  axios(config)
  .then(function (response) {
    console.log(JSON.stringify(response.data));
  })
  .catch(function (error) {
    console.log(error);
  });
}


const kickUser = (channelId, userId) => {
  var data = qs.stringify({
    'channel': channelId,
    'user': userId 
  });
  var config = {
    method: 'post',
    url: 'https://slack.com/api/conversations.kick',
    headers: { 
      'Authorization': `Bearer ${process.env.SLACK_USER_TOKEN}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data : data
  };
  
  axios(config)
  .then(function (response) {
    console.log(JSON.stringify(response.data));
  })
  .catch(function (error) {
    console.log(error);
  });
}


const inviteUser = (channelId, userId) => {

  var data = qs.stringify({
    'channel': channelId,
    'users': userId
  });
  var config = {
    method: 'post',
    url: 'https://slack.com/api/conversations.invite',
    headers: { 
      'Authorization': `Bearer ${process.env.SLACK_BOT_TOKEN}`, 
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data : data
  };
  
  axios(config)
  .then(function (response) {
    console.log(JSON.stringify(response.data));
  })
  .catch(function (error) {
    console.log(error);
  });  
}



exports.getAllChannels = getAllChannels;
exports.getAllUsers = getAllUsers;
exports.getChannelMembers = getChannelMembers;
exports.inviteToChannel = inviteToChannel;
exports.inviteBotToChannels = inviteBotToChannels;
exports.kickUser = kickUser;
exports.inviteUser = inviteUser;