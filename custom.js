// ender song 
// scroll top
// play/pause/seek
// cd rotate
// next/pre
// random 
// next/repeat when ended
// active song
// scroll active into view
// play song when click

const MUSIC_PLAYER_STORAGE = 'music player';

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const cd = $('.cd');
const playBtn = $('.btn-toggle-play')
const player = $('.player')
const progress = $('#progress')
const prevBtn = $('.btn-prev')
const nextBtn = $('.btn-next')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playlist = $('.playlist')
const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(MUSIC_PLAYER_STORAGE)) || {},
    setConfig: function (key, value) {
        this.config[key] = value;
        localStorage.setItem(MUSIC_PLAYER_STORAGE, JSON.stringify(this.config))
    },
    songs: [
        {
            name: 'Chiều nay không có mưa bay',
            singer: 'Trung Quân',
            path: './music/Chieu-Nay-Khong-Co-Mua-Bay-Trung-Quan-Idol.mp3',
            img: './images/img1.jpg'
        },
        {
            name: 'Em có đợi tin nhắn tôi không',
            singer: 'Hải Sâm',
            path: './music/Em-Co-Doi-Tin-Nhan-Toi-Khong-Hai-Sam.mp3',
            img: './images/img2.jpg'
        },
        {
            name: 'Loài hoa mang tên em',
            singer: 'Đông Hùng',
            path: './music/Loai-Hoa-Mang-Ten-Em-Dong-Hung.mp3',
            img: './images/img3.jpg'
        },
        {
            name: 'Một điều mà anh rất ngại nói ra',
            singer: 'Hải Sâm',
            path: './music/Mot-Dieu-Ma-Anh-Rat-Ngai-Noi-Ra-Hai-Sam.mp3',
            img: './images/img4.jpg'
        },
        {
            name: 'Ngày chưa giông bão',
            singer: 'Bùi Lan Hương',
            path: './music/Ngay-Chua-Giong-Bao-Nguoi-Bat-Tu-OST-Bui-Lan-Huong.mp3',
            img: './images/img5.jpg'
        },
        {
            name: 'Suýt nữa thì',
            singer: 'Andiez',
            path: './music/Suyt-Nua-Thi-Chuyen-Di-Cua-Thanh-Xuan-OST-Andiez.mp3',
            img: './images/img6.jpg'
        },
    ],
    render: function () {
        const htmls = this.songs.map((song, index) => {
            return `
            <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index = ${index}>
            <div class="thumb"
                style="background-image: url('${song.img}')">
            </div>
            <div class="body">
                <h3 class="title">${song.name}</h3>
                <p class="author">${song.singer}</p>
            </div>
            <div class="option">
                <i class="fas fa-ellipsis-h"></i>
            </div>
        </div>
        `
        })
        playlist.innerHTML = htmls.join('')
    },

    defineProperties: function () {
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[this.currentIndex]
            }
        })
    },

    handleEvent: function (event) {

        //xu li quay dung
        const cdThumbAnimate = cdThumb.animate([
            { transform: 'rotate(360deg)' }
        ], {
            duration: 10000,
            iterations: Infinity
        })
        cdThumbAnimate.pause()



        const cdWidth = cd.offsetWidth
        document.onscroll = function () {
            const scrollTop = window.screenY || document.documentElement.scrollTop
            const newCdWidth = cdWidth - scrollTop
            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
            cd.style.opacity = newCdWidth / cdWidth
        }

        playBtn.onclick = function () {
            if (app.isPlaying) {
                audio.pause()
            } else {
                audio.play()
            }
        }

        audio.onplay = function () {
            app.isPlaying = true
            player.classList.add('playing')
            cdThumbAnimate.play()
        }


        audio.onpause = function () {
            app.isPlaying = false
            player.classList.remove('playing')
            cdThumbAnimate.pause()
        }

        //set tien trinh play 
        audio.ontimeupdate = function () {
            if (audio.duration) {
                progress.value = Math.floor(audio.currentTime / audio.duration * 100)
            }

            //xu li khi tua
            progress.onchange = function (e) {
                const seekTime = e.target.value * audio.duration / 100
                audio.currentTime = seekTime
            }

        }

        //next song
        nextBtn.onclick = function () {
            if (app.isRandom) {
                app.randomSong();
            } else {
                app.nextSong()
            }
            audio.play()
            app.render()
            app.scrollToActiveSong()
        }

        //prev song
        prevBtn.onclick = function () {
            if (app.isRandom) {
                app.randomSong()
            } else {
                app.prevSong()
            }
            audio.play()
            app.render()
            app.scrollToActiveSong()

        }

        //xu li nhan random btn
        randomBtn.onclick = function (e) {
            app.isRandom = !app.isRandom
            app.setConfig('isRandom', app.isRandom)
            randomBtn.classList.toggle('active', app.isRandom)
        }

        //xu li khi lap lai 1 song
        repeatBtn.onclick = function (e) {
            app.isRepeat = !app.isRepeat
            app.setConfig('isRepeat', app.isRepeat)

            repeatBtn.classList.toggle('active', app.isRepeat)
        }

        //xu li khi song end
        audio.onended = function () {
            if (app.isRepeat) {
                audio.play()
            } else {
                nextBtn.click()
            }
        }

        //click vao song
        playlist.onclick = function (e) {
            const songNode = e.target.closest('.song:not(.active)')
            if (songNode || e.target.closest('.option')) {
                if (songNode) {
                    app.currentIndex = Number(songNode.dataset.index)
                    app.loadCurrentSong()
                    app.render()
                    audio.play()
                } else if (e.target.closest('.option')) {

                }
            }
        }

    },

    scrollToActiveSong: function () {
        setTimeout(function () {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'nearest'
            })
        }, 300)
    },

    loadCurrentSong: function () {
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.img}')`
        audio.src = this.currentSong.path
    },

    nextSong: function () {
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
        }
        this.loadCurrentSong();
    },

    prevSong: function () {
        this.currentIndex--;
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong();
    },

    randomSong: function () {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while (newIndex === this.currentIndex)
        this.currentIndex = newIndex
        this.loadCurrentSong();
    },

    loadConfig: function () {
        this.isRandom = this.config.isRandom
        this.isRepeat = this.config.isRepeat
    },
    start: function () {
        this.loadConfig();

        this.defineProperties();

        this.handleEvent();

        this.loadCurrentSong();

        this.render();

        randomBtn.classList.toggle('active', app.isRandom)
        repeatBtn.classList.toggle('active', app.isRepeat)
    }
}

app.start();