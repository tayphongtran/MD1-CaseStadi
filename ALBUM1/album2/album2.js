/** 
    1.Render song
    2. Scoll top
    3. play/ pause / seek
    4. CD rotate
    5. Next / prev
    6. Random
    7. Next / Repeat when ended
    8. Active song
    9. Scroll active song into view
    10. play song when click
    **/

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const PLAYER_STORAGE_KEY = 'CI2022I1'

const player = $('.player')
const cd = $('.cd');
const heading = $('header h2')
const cdthumb = $('.cd-thumb')
const audio = $('#audio')
const playBtn = $('.btn-toggle-play')
const progress = $('#progress')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repaetBtn = $('.btn-repeat')
const playlist = $('.playlist')


const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    songs: [
        {
            name: "Cuộc Đời Vô Danh",
            singer: "Trần Tuyết Nhiên",
            path: "./songs2/CuocDoiVoDanh.mp3",
            image: "./image2/kute1.jpg"
        },
        {
            name: "Gửi Tương Lai",
            singer: "Lý Hiện",
            path: "./songs2/Lý Hiện.mp3",
            image: "./image2/kute2.jpg"
        },
        {
            name: "Bánh Mì Bò Sữa",
            singer: "Dương Tử",
            path: "./songs2/BanhMiBoSua.mp3",
            image: "./image2/kute3.jpg"
        },
        {
            name: "Em Có Thể Không Quan Tâm",
            singer: "Trần Phương Ngữ",
            path: "./songs2/EmCoTheKhongQuanTamAnh.mp3",
            image: "./image2/kute4.jpg"
        },
        {
            name: "Ánh Sáng",
            singer: "Lương Tâm Di",
            path: './songs2/AnhSang.mp3',
            image: "./image2/kute5.jpg"
        },
        {
            name: "Yêu Không Do anh",
            singer: "Vưu Trưởng Tĩnh",
            path: './songs2/YeuKhongDoAnh.mp3',
            image: "./image2/kute6.jpg"
        }
    ],
    setConfig: function (key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
    },
    render: function () {
        // duyet cac phan tu mang songs
        const htmls = this.songs.map((song, index) => {
            return `
                     <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index = ${index}>
                         <div class="thumb"
                             style="background-image: url('${song.image}')">
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
        });
        playlist.innerHTML = htmls.join('')
    },
    defineProperties: function () {
        // DN: 1 Obj so it (syntax defineProperty)
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[this.currentIndex]
            }
        });
    },
    handleEvents: function () {
        const _this = this;
        const cdWidth = cd.offsetWidth;

        // Xu ly CD quay/ dung
        const cdThumbAnimate = cdthumb.animate([
            { transform: 'rotate(360deg)' }
        ], {
            duration: 10 * 1000, // 10 seconds
            iterations: Infinity
        })
        cdThumbAnimate.pause()

        // Xy ly phong to , thu nho CD
        document.onscroll = function () {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newCdWidth = cdWidth - scrollTop;

            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
            cd.style.opacity = newCdWidth / cdWidth
        }

        // Xu ly khi click Play
        playBtn.onclick = function () {
            if (_this.isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }

        }

        // when song on play
        audio.onplay = function () {
            _this.isPlaying = true;
            player.classList.add('playing');
            cdThumbAnimate.play()
        }

        // when song pause play
        audio.onpause = function () {
            _this.isPlaying = false;
            player.classList.remove('playing');
            cdThumbAnimate.pause()
        }

        // Xu ly time music
        audio.ontimeupdate = function () {
            if (audio.duration) {
                const progressPercent = Math.fround(audio.currentTime / audio.duration) * 100
                progress.value = progressPercent
            }
        }

        // Xu ly timeout
        progress.onchange = function (event) {
            const seekTime = audio.duration / 100 * event.target.value
            audio.currentTime = seekTime
        }

        //khi netx song
        nextBtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong()
            } else {
                _this.nextSong()
            }
            audio.play()
            _this.render()
            _this.scrollToAactiveSong()
        }
        //khi prev song
        prevBtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong()
            } else {
                _this.prevSong()
            }
            audio.play()
            _this.render()
            _this.scrollToAactiveSong()
        }

        // Xu ly on/off random
        randomBtn.onclick = function (e) {
            _this.isRandom = !_this.isRandom
            _this.setConfig('isRandom', _this.isRandom)
            randomBtn.classList.toggle('active', _this.isRandom)
        }
        // this.playRandomSong()

        // Xu ly lap lai mot song
        repaetBtn.onclick = function (e) {
            _this.isRepeat = !_this.isRepeat
            _this.setConfig('isRepeat', _this.isRepeat)
            repaetBtn.classList.toggle('active', _this.isRepeat)

        }

        //Xu ly next song when audio ended
        audio.onended = function () {
            if (_this.isRepeat) {
                audio.play()
            } else {
                nextBtn.click()
            }
        }

        // lang nghe hanh vi click vao playlist
        playlist.onclick = function (e) {
            let songNode = e.target.closest('.song:not(.active)')
            // click vào music
            if (songNode || e.target.closest('.option')) {
                //Xu Ly Khi click music
                if (songNode) {
                    _this.currentIndex = Number(songNode.dataset.index)
                    _this.loadCurrentSong()
                    _this.render()
                    audio.play()
                }

                // Xu Ly khi click option
                if (e.target.closest('.option')) {

                }
            }

        }
    },
    scrollToAactiveSong: function () {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
            })
        }, 350)
    },
    loadCurrentSong: function () {
        heading.textContent = this.currentSong.name;
        cdthumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path
    },
    loadConfix: function () {
        this.isRandom = this.config.isRandom
        this.isRepeat = this.config.isRepeat

    },

    nextSong: function () {
        this.currentIndex++
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
        }

        this.loadCurrentSong()
    },
    prevSong: function () {
        this.currentIndex--
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1
        }

        this.loadCurrentSong()
    },

    playRandomSong: function () {
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while (newIndex === this.currentIndex)
        this.currentIndex = newIndex
        this.loadCurrentSong()
    },

    start: function () {
        // gán cấu hình từ config vào obj (tag/app)
        this.loadConfix();

        this.defineProperties();

        // DN: xu ly DOM event
        this.handleEvents();

        // load data song fisrt in UI when go to app
        this.loadCurrentSong()

        // render playlist
        this.render();

        //hien thi trang thai ban dau cua button repeat and random
        repaetBtn.classList.toggle('active', this.isRepeat)
        randomBtn.classList.toggle('active', this.isRandom)
    }
}


app.start();

