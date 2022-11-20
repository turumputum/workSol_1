
editModal.addEventListener('show.bs.modal', function (event) {
    const call_button = event.relatedTarget
    const edit_modal_mode = call_button.getAttribute('d-mode')
    const edit_play_list_path = call_button.getAttribute('d-path')
    const edit_playlist_name = edit_play_list_path.split('/').slice(-1)
    if (edit_modal_mode == 'edit'){
        //const edit_play_list_path = call_button.getAttribute('d-path')
    }

    var title_name = document.getElementById('playlist_name_input')
    

    console.log("edit modal mode: " + edit_modal_mode + " playlist name: " + edit_playlist_name)

    if(edit_modal_mode == 'edit'){
        title_name.value = edit_playlist_name
        fetch('/playlist/${edit_playlist_name}', {
            method: 'GET',
            headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded'
            },
        }).then((res) => res.json())
        .then((dat) => {
            console.log("GET play list, res: ", dat.playlist.tracks)
            const playlist = dat.playlist
            for (let i in playlist.tracks){
                let track = playlist.tracks[i]
                //console.log("Find track: ", track)
                if (track.type == 'simple'){
                    var newRow = tableSC.insertRow(tableSC.rows.length)
                    var order_cell = newRow.insertCell().innerHTML = track.order_num
                    var name_cell = newRow.insertCell().innerHTML = track.name
                    var path = newRow.insertCell().innerHTML = track.path
                    const controls = newRow.insertCell().innerHTML = `
                        <button class="mx-1 btn btn-outline-secondary btn-sm" type="button" data-bs-toggle="modal" data-bs-target="#editTrackModal" d-track_type=track.type d-track_path=track.path>edit</button>
                        <button class="mx-1 btn btn-outline-secondary btn-sm" type="button" data-bs-toggle="modal" data-bs-target="#deleteTrackModal" d-track_path=track.path>delete</button>
                        `
                } else if(track.type == 'interactive'){
                    var newRow = tableIC.insertRow(tableIC.rows.length)
                    var id_cell = newRow.insertCell().innerHTML = track.order_num
                    var name_cell = newRow.insertCell().innerHTML = track.name
                }
            }
            var newRow = tableSC.insertRow(tableSC.rows.length)
            newRow.insertCell()
            newRow.insertCell()
            newRow.insertCell()
            var addCell = newRow.insertCell().innerHTML = '<button class="mx-1 btn btn-outline-secondary btn-sm" type="button" data-bs-toggle="modal" data-bs-target="#editTrackModal" d-track_type = "new">add</button>'

            newRow = tableIC.insertRow(tableIC.rows.length)
            newRow.insertCell()
            newRow.insertCell()
            newRow.insertCell()
            addCell = newRow.insertCell().innerHTML = '<button class="mx-1 btn btn-outline-secondary btn-sm" type="button" data-bs-toggle="modal" data-bs-target="#editTrackModal" d-track_type = "new">add</button>'

            //window.location.reload();
            }).catch((err) => {
                console.log(err)
            })
        
    } else {
        title_name.value = 'new_playlist.json'
        var newRow = tableSC.insertRow(tableSC.rows.length)
        newRow.insertCell()
        newRow.insertCell()
        newRow.insertCell()
        var addCell = newRow.insertCell().innerHTML = '<button class="mx-1 btn btn-outline-secondary btn-sm" type="button" data-bs-toggle="modal" data-bs-target="#editTrackModal" d-track_type = "new">add</button>'

        newRow = tableIC.insertRow(tableIC.rows.length)
        newRow.insertCell()
        newRow.insertCell()
        newRow.insertCell()
        addCell = newRow.insertCell().innerHTML = '<button class="mx-1 btn btn-outline-secondary btn-sm" type="button" data-bs-toggle="modal" data-bs-target="#editTrackModal" d-track_type = "new">add</button>'

    }
}
    
