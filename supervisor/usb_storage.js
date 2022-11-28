var watch = require('node-watch')
var usbDetect = require('usb-detection');
const fs = require("fs");
const { exec } = require('child_process');

let usb_watcher = watch('/dev');

function search_usb_storage_dev(name){
  if(name.slice(0,7)=='/dev/sd'){
    if(name.slice(-1)=='1'){
      //console.log(name)
      if(fs.existsSync(name)){
        usb_storages.add_device(name)
      }else{
        usb_storages.remove_device(name)
      }
    }
    //usb_storages.search_devices()
  }
}

usb_watcher.on('change', function (evt, name) {
  //console.log("Event folder name:"+name.slice(0,7))
  search_usb_storage_dev(name)
})

let usb_storages = class{
  static mountedDevice=[]
  static flag_deviceIsMounted
  constructor(){
    this.flag_deviceIsMounted=0
  }
  static add_device(name){
    console.log("add device")
    if(usb_storages.flag_deviceIsMounted==0){
      mount(name)
      if(this.mountedDevice.find((element)=>element=name)==undefined){
        this.mountedDevice.push(name)
        console.log(this.mountedDevice)
      }
    }
  }

  static remove_device(name){
    console.log("remove device")
    unmount()
    this.mountedDevice = this.mountedDevice.filter((element)=>element!=name)
    console.log(this.mountedDevice)
  }

}

function execPromise(cmd) {
  return new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        console.warn(error)
      }
      console.log(`exec: ${cmd} resault ${stdout} stderr: ${stderr}`)
      resolve(stdout? stdout : stderr);
    })
  })
 }

async function mount(name){
  try{
    await execPromise(`mount ${name} /home/playerok/workSol_1/data/usb`)
    execPromise(`chmod -R 777 /home/playerok/workSol_1/data/usb`)
    usb_storages.flag_deviceIsMounted=1
  }catch(err){
    console.warn(`Umount FAIL: ${err}`)
  }
}

async function unmount(){
  try{
    let cmd = 'umount /home/playerok/workSol_1/data/usb'
    await execPromise(cmd)
    usb_storages.flag_deviceIsMounted=0
  }catch(err){
    console.warn(`Umount FAIL: ${err}`)
  }
}


async function onStart(){
  await unmount()

  try{
    console.log(`Scan mounted device`)
    fs.readdir('/dev', (err, files) => {
      files.forEach(file => {
        //console.log(file)
        search_usb_storage_dev(`/dev/${file}`);
      })
    })
  }catch(err){
    console.warn(`Read /dev FAIL: ${err}`)
  }
}

onStart()
