//const mqtt = require("mqtt");
const options = {
    keepalive: 30,
    clientId: 13333,
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

client = mqtt.connect('ws://127.0.0.1:1890', options)
//client = mqtt.connect("ws://test.mosquitto.org:8080")
//import mqtt from 'mqtt'
//----------------MQTT------------------------------
client.on('connect', function () {
  console.log("mqtt brocker connected!");
  
  client.subscribe('player/state')
  client.subscribe('player/volume_val')
})

client.on('message', function (topic, message) {
    // message is Buffer
    console.log(message.toString())
    if(topic=='player/state'){
      $('#card_player_status_title').text(message.toString())

      if(message.toString().split(' ').slice(0,1)=='Playing'){
        $('#bt_play_title').text('Pause')
      }else if(message.toString().split(' ').slice(0,1)=='Pause'){
        $('#bt_play_title').text(' Play ')
      }
    }
    if(topic=='player/volume_val'){
      $('#volumeRange').val(parseInt(message))
    }
  })

$('#volumeRange').on("mouseup", function(){
  client.publish('player/volume_val', $('#volumeRange').val(),{ retain: true })
})

$('#bt_play').on('click', function(){
  if($('#bt_play_title').text()=='Pause'){
    client.publish('player/play_pause', '0')
  }else{
    client.publish('player/play_pause', '1')
  }
})

$('#bt_stop').on('click', function(){
    client.publish('player/stop', '1')
})

$('#bt_prev').on('click', function(){
  client.publish('player/prev', '1')
})
$('#bt_next').on('click', function(){
  client.publish('player/next', '1')
})


$( document ).ready(function() {
    console.log( "ready!" );
});      
    