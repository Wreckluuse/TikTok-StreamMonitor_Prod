import express from "express";
import http from "http";
import { Server } from "socket.io";
import { handler } from "./svelte/build/handler.js";
import BodyParser from 'body-parser';
import cors from 'cors';
import { WebcastPushConnection } from 'tiktok-live-connector';



const app = express();
app.use(cors());
app.options('*', cors());
var allowCrossDomain = function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
}
app.use(allowCrossDomain);
app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: false }));

var nickname = "";
var dispName = "";
var handle = "";
var bio = "";
var streamerFollowers = 0;
var streamerFollowing = 0;
var connected = false;
const server = http.createServer(app)

const PORT = process.env.PORT || 3000;
const wss = new Server(server, {
  cors: {

    origin: "http://localhost:" + PORT,
    methods: ["GET", "POST"],
    allowedHeaders: ["*"],

  }
});
let serverUp = false;
let streamerInfo = {
  display_name: "",
  user_name: "",
  followers: 0,
  following: 0,
}

app.get('/healthcheck', (req, res) => { res.end('ok'); });

wss.on('connection', (socket) => {

  socket.on('tryConnection', name => {
    tteStream(name, function (cb) {
      if (cb.code === "success") {
        streamerInfo.display_name = cb.streamer_data.roomInfo.owner.nickname;
        streamerInfo.user_name = cb.streamer_data.roomInfo.owner.display_id;
        streamerInfo.followers = cb.streamer_data.roomInfo.owner.follow_info.follower_count;
        streamerInfo.following = cb.streamer_data.roomInfo.owner.follow_info.following_count;
        let payload = JSON.stringify(cb.streamer_data);
        socket.emit('connected', payload);
      };
    })
  })
})


function tteStream(uName, callback) {
  let username = uName || null;

  if (username != null || username != '') {
    var tiktokLiveConnection = new WebcastPushConnection(username, {
      enableExtendedGiftInfo: true,
      fetchRoomInfoOnConnect: true
    });

    function evtManager(data, type) {
      let out = {};
      let currentDate = new Date();
      let msgColor = getRoleColor([data.isModerator, data.isSubscriber, data.rollowRole]);

      switch (type) {
        case 'gift':

          if (data.repeatEnd) {
            let dConversion = (data.diamondCount * 0.05) / 2;

            let price = (dConversion * data.repeatCount).toLocaleString('en-US', {
              style: 'currency',
              currency: 'USD',
              minimumFractionDigits: 2,
            })
            let priceString = "$" + price
            out = {
              type: 'gift',
              nickname: data.uniqueId,
              giftType: data.giftName,
              giftCount: data.repeatCount,
              priceValue: price,
              icon: data.giftPictureUrl,
              timeStamp: currentDate.toLocaleTimeString(),
              profilePictureUrl: data.profilePictureUrl,
              followCount: data.followInfo.followerCount,
              color: msgColor,
              badges: data.userBadges
            }
          }
          break;
        case 'subscribe':
          out = {
            type: 'subscribe',
            nickname: data.uniqueId,
            months: data.subMonth,
            timeStamp: currentDate.toLocaleTimeString(),
            profilePictureUrl: data.profilePictureUrl,
            followCount: data.followInfo.followerCount,
            color: msgColor,
            badges: data.userBadges
          }
          break;
        case 'follow':
          out = {
            type: 'follow',
            nickname: data.uniqueId,
            timeStamp: currentDate.toLocaleTimeString(),
            profilePictureUrl: data.profilePictureUrl,
            followCount: data.followInfo.followerCount,
            color: msgColor,
            badges: data.userBadges
          }
          break;
        case 'share':
          out = {
            type: 'share',
            nickname: data.uniqueId,
            timeStamp: currentDate.toLocaleTimeString(),
            profilePictureUrl: data.profilePictureUrl,
            followCount: data.followInfo.followerCount,
            color: msgColor,
            badges: data.userBadges
          }
          break;
      }
      return out;
    }

    tiktokLiveConnection.connect().then(state => {
      let callbackValue = { code: "success", streamer_data: state };
      console.info(`Connected to room (ID): ${state.roomId}`)
      callback(callbackValue);
      ;
      serverUp = true;

    }).catch(err => {
      let callbackValue = { code: "failed" };
      console.error(err);
      callback(callbackValue);
    })

    tiktokLiveConnection.on('disconnected', () => {
      wss.emit('dcSuccess')
    })

    wss.on('beginDC', () => {
      console.log('Disconnected');
      tiktokLiveConnection.disconnect();
      wss.emit('dcSuccess')
    });

    tiktokLiveConnection.on('chat', data => {
      let currentDate = new Date();
      let createDate = new Date(Number(data.userDetails.createTime));
      let out = {
        displayname: data.nickname,
        nickname: data.uniqueId,
        msgContent: data.comment,
        profilePictureUrl: data.profilePictureUrl,
        timeStamp: currentDate.toLocaleTimeString(),
        followers: data.followInfo.followerCount,
        following: data.followInfo.followerCount,
        bio: data.userDetails.bioDescription,
        roles: [{ role: "mod", value: data.isModerator }, { role: "sub", value: data.isSubscriber }, { role: "default", value: data.rollowRole == 1 }],
        createDate: createDate.toDateString
      }

      wss.emit('chatMessage', JSON.stringify(out));

    })

    tiktokLiveConnection.on('gift', data => {
      let out = evtManager(data, 'gift');
      wss.emit('evtMessage', JSON.stringify(out));
    })

    tiktokLiveConnection.on('subscribe', data => {
      let out = evtManager(data, 'subscribe');
      wss.emit('evtMessage', JSON.stringify(out));
    })

    tiktokLiveConnection.on('follow', data => {
      let out = evtManager(data, 'follow');
      wss.emit('evtMessage', JSON.stringify(out));
    })

    tiktokLiveConnection.on('share', data => {
      let out = evtManager(data, 'share');
      wss.emit('evtMessage', JSON.stringify(out));
    })

    tiktokLiveConnection.on('roomUser', data => {
      let out = {
        type: 'roomUser',
        viewers: data.viewerCount,
        streamer: streamerInfo

      }
      wss.emit('updateInfo', JSON.stringify(out))
    })

  }

}

function shutdownGracefully() {
  tiktokLiveConnection.disconnect();
}

process.on('SIGINT', shutdownGracefully);
process.on('SIGTERM', shutdownGracefully);


app.use(handler);
server.listen(PORT, () => {
  console.log(`Tiktok Monitor is listening at http://localhost:${PORT}`)
})

