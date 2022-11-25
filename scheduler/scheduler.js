require('log-timestamp');
const fs = require("fs");
const path = require("path");
const mqtt = require("mqtt");
var watch = require('node-watch')
const { spawn } = require('child_process');
var kill  = require('tree-kill');

let date_ob = new Date();

var state = {
    player_state: 'stop',
    player_pid: '',
    current_playlist_path: '',
    current_playlist_name: ''
}

function start_player(playlist_path) {
    try{
        //---------set name and path=--=-------------
        //state.player_pid = spawn(`cd ../player; node player.js ${playlist_path}`)
        state.player_pid = spawn(`date`)
        console.log(`start player OK`)
        //client.publish('scheduler/current_playlist', `${state.current_playlist_name}`, { retain: true })
       
    }catch(err){
        console.log(`start player FAILED: ${err}`)
    }

    setTimeout(stop_player,10000)
}

function stop_player() {
    try{
        kill(state.player_pid)
        console.log(`stop player:`+ state.player_pid.kill('SIGHUP'))
        client.publish('scheduler/current_playlist', `none`, { retain: true })
    }catch(err){
        console.log(`stop player FAILED: ${err}`)
    }
    setTimeout(start_player('data/playlists/playlist_1.json'),10000)
}

function check_state() {
    let current_time_in_minutes = date_ob.getMinutes() + date_ob.getHours() * 60
    let current_day = date_ob.getDay()
    if (current_day == 0) {//-------------
        current_day = 7
    }


    for (let playlist in scheduler_table) {
        if (playlist.day_of_week.search(`${current_day}`) > 0) {//---------day in list ---------------
            let playlist_start_time_in_minutes = parseInt(playlist.start_time.split(':')[0]) * 60 + parseInt(playlist.start_time.split(':')[1])
            if (playlist_start_time_in_minutes <= current_time_in_minutes) {
                let playlist_end_time_in_minutes = parseInt(playlist.end_time.split(':')[0]) * 60 + parseInt(playlist.end_time.split(':')[1])
                if (playlist_end_time_in_minutes > current_time_in_minutes) {
                    if ((current_playlist_path != playlist.path)&&(playlist.type=='multimedia')) {
                        //----- it's playlist ok ----
                        if (state == 'stop'){

                        }else if (state == "start"){

                        }

                       
                    }
                    break
                }
            }
        }
    }
    //-----nothin to play-------------

}

const client = mqtt.connect('mqtt://127.0.0.1:1883')
client.on('connect', function () {
  console.log("mqtt brocker connected!");
})

try {
    var scheduler_table = JSON.parse(fs.readFileSync('../meta/scheduler-table.json'))
} catch (err) {
    console.error(`Error read file: ${err}`)
    process.exit(1);
}

start_player('data/playlists/playlist_1.json')
