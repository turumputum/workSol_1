//const mqtt = require("mqtt");
const options = {
    keepalive: 30,
    clientId: 13334,
    protocolId: 'MQTT',
    protocolVersion: 4,
    clean: true,
    reconnectPeriod: 1000,
    connectTimeout: 30 * 1000,
    will: {
      topic: 'WillMsg',
      payload: 'Connection Closed abnormally..!',
      qos: 0,
      retain: true
    },
    rejectUnauthorized: false
  }

client = mqtt.connect('ws://192.168.88.131:1890/mqtt')
//client = mqtt.connect('mqtt://127.0.0.1:1883')
//client = mqtt.connect("ws://test.mosquitto.org:8080")
//import mqtt from 'mqtt'
//----------------MQTT------------------------------
client.on('connect', function () {
  //console.log("mqtt brocker connected!");
  
  client.subscribe('player/state')
  client.subscribe('player/volume_val')
  client.subscribe('scheduler/current_playlist')
  client.subscribe('scheduler/on_off_time')
})

client.on('message', function (topic, message) {
    // message is Buffer
    //console.log(topic + ':'+message.toString())
    if(topic=='player/state'){
      $('#card_player_status_title').text(message.toString())

      if(message.toString().split(' ').slice(0,1)=='Playing'){
        $('#bt_play_title').text('Pause')
      }else if(message.toString().split(' ').slice(0,1)=='Pause'){
        $('#bt_play_title').text(' Play ')
      }
    }
    if(topic=='player/volume_val'){
      console.log("mqtt set volume val")
      $('#volumeRange').val(parseInt(message))
    }
    if(topic=='scheduler/current_playlist'){
      //console.log('set playlist name')
      $('#playlist_name_title').text(message)
    }
    if(topic=='scheduler/on_off_time'){
      //console.log('set time vals')
      $('#time_vals').text(message)
    }

  })

$('#volumeRange').on("mouseup", function(){
  client.publish('player/volume_val', $('#volumeRange').val(),{ retain: true })
})

$('#bt_play').on('click', function(){
  if($('#bt_play_title').text()=='Pause'){
    client.publish('player/play_pause', '1')
  }else{
    client.publish('player/play_pause', '0')
  }
})

$('#bt_stop').on('click', function(){
    client.publish('player/stop', '1')
})

$('#bt_prev').on('click', function(){
  client.publish('player/prev', '1')
})
$('#bt_next').on('click', function(){
  //console.log('pressed next button')
  client.publish('player/next', '1')
})
$('#bt_restart').on('click', function(){
  //console.log('pressed next button')
  client.publish('scheduler/restart', '1')
})

$( document ).ready(function() {
    //console.log( "ready!" );
});      
    