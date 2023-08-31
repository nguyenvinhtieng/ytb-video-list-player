const form = document.querySelector('.js-form');
const title = document.querySelector('.js-input-title');
const link = document.querySelector('.js-input-link');
const modalAdd = document.querySelector('.js-modal-add');
const closeModal = document.querySelector('.js-close-modal');
const playListList = document.querySelector('.js-playlist-list');
const videoIframe = document.querySelector('.js-video iframe');
const jsActionRefresh = document.querySelector(".js-action-refresh")
const jsActionBack = document.querySelector(".js-action-back")
const jsActionForward = document.querySelector(".js-action-forward")
const jsActionInfinite = document.querySelector(".js-action-infinite")


const defaulSongs = [
    {
        id: 1,
        title: 'Sống cho hết đời thanh xuân',
        link: 'https://www.youtube.com/watch?v=yyXHS2b-lCU'
    },
    {
        id: 2,
        title: 'Rolling down',
        link: 'https://www.youtube.com/watch?v=ixNLxzcfnbk'
    },
]

let playlist = [...defaulSongs]

let currentSong = null;
let player = null;
let done = false;
let isLoop = false;
var timer = 0;
var delay = 200;
var prevent = false;


function savePlaylist() {
    localStorage.setItem('playlist', JSON.stringify(playlist));
}

function loadPlaylist() {
    const playlistData = localStorage.getItem('playlist');
    if (playlistData) {
        playlist = JSON.parse(playlistData);
    }
}
loadPlaylist()

function generateId() {
    return '_' + Math.random().toString(36).substr(2, 9);
}

function eventModal() {
    form.addEventListener('submit', function (event) {
        event.preventDefault();
        const id = generateId();
        const titleVal = title.value;
        const linkVal = link.value;
        if (titleVal === '' || linkVal === '') return;
        const newSong = { id: id, title: titleVal, link: linkVal }
        playlist.push(newSong);
        closeModal.click();
        title.value = '';
        link.value = '';
        renderPlaylist();
        savePlaylist();
    });
}

function eventClickSong() {
    let songs = document.querySelectorAll('.js-song');
    songs.forEach(function (song) {
        song.addEventListener('dblclick', function (e) {
            const id = song.getAttribute('data-id');
            let text = "Bạn có chắc chắn muốn xóa video này?.";
            if (confirm(text) == true) {
                clearTimeout(timer);
                prevent = true;
                playlist = playlist.filter(function (song) {
                    return song.id != id;
                });
                renderPlaylist();
                savePlaylist();
                return;
            } else {
                return;
            }
        });
        song.addEventListener('click', function () {
            timer = setTimeout(function() {
                if (!prevent) {
                    const id = song.getAttribute('data-id');
                    currentSong = playlist.find(function (song) {
                        return song.id == id;
                    });
                    checkActiveSong();
                    startSong();
                }
                prevent = false;
            }, delay);
        });

        
    });

}

function renderPlaylist() {
    playListList.innerHTML = '';
    playlist.forEach(function (song) {
        const li = document.createElement('li');
        li.innerHTML = `<a class="js-song" data-id="${song.id}">${song.title}</a>`;
        playListList.appendChild(li);
    });
    eventClickSong();
    checkActiveSong();
}

function checkActiveSong() {
    if (!currentSong) return;
    const songs = document.querySelectorAll('.js-song');
    songs.forEach(function (song) {
        song.classList.remove('active');
        let songId = song.getAttribute('data-id');
        if (songId == currentSong.id) {
            song.classList.add('active');
        }
    });
}

function startSong() {
    let videoId = currentSong.link.split('v=')[1];
    player.loadVideoById(videoId);
}

function changeSong({type}) {
    if(playListList.length == 0) return;
    if(!type) return;

    let index = playlist.findIndex(function (song) {
        return song.id == currentSong.id;
    })
    if(index == -1) index = 1;
    let nextSong = null;
    if(type == 'next'){
        nextSong = playlist[index == playlist.length - 1 ? 0 : index + 1];
    } else if(type == 'back'){
        nextSong = playlist[index == 0 ? playlist.length - 1 : index - 1];
    } else {
        return;
    }
    currentSong = nextSong;
    checkActiveSong();
    startSong();
}

function actions() {
    jsActionRefresh.addEventListener("click", (e) => {
        startSong();
    })
    jsActionBack.addEventListener("click", (e) => {
        changeSong({type: 'back'})
    })
    jsActionForward.addEventListener("click", (e) => {
        changeSong({type: 'next'})
    })
    jsActionInfinite.addEventListener("click", (e) => {
        isLoop = !isLoop;
        if(isLoop){
            jsActionInfinite.classList.add("active")
        } else {
            jsActionInfinite.classList.remove("active")
        }
    })
}

if (playlist.length > 0) {
    currentSong = playlist[0];
    checkActiveSong();
}

function onYouTubePlayerAPIReady() {
    let videoId = currentSong.link.split('v=')[1];
    player = new YT.Player('player', {
        height: '390',
        width: '640',
        videoId: videoId,
        autoplay: 1,
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}

function onPlayerReady(event) {
    event.target.playVideo();
}
    
function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.ENDED){
        if(isLoop) {
            startSong();
        } else {
            changeSong({type: 'next'})
        }
    }
}

eventModal();
renderPlaylist();
actions();
