const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const player = $('.player')
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const cd = $('.cd')
const cdWidth = cd.offsetWidth
const playBtn = $('.btn-toggle-play')
const progress = $('#progress')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playlist = $('.playlist')

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    songs: [
        {
          name: "The Playah",
          singer: "Soobin x SlimV",
          path: "./assets/music/The Playah Special Performance_ - Soobin.mp3",
          image: "./assets/img/theplayah.jpg"
        },
        {
          name: "Ba Kể Con Nghe",
          singer: "Dương Trần Nghĩa",
          path: "./assets/music/Ba Ke Con Nghe - Duong Tran Nghia.mp3",
          image: "./assets/img/bakeconnghe.jpg"
        },
        {
          name: "Real Love",
          singer: "Mỹ Anh x Khắc Hưng",
          path: "./assets/music/Real Love - My Anh_ Khac Hung.mp3",
          image: "./assets/img/reallove.jfif"
        },
        {
          name: "Muộn Rồi Mà Sao Còn Yêu",
          singer: "Erik x Khắc Hưng",
          path: "./assets/music/Muon Roi Ma Sao Con Yeu - Erik_ Khac Hun.mp3",
          image: "./assets/img/muon-roi-ma-sao-con-yeu.jpg"
        },
        {
          name: "Em Hát Ai Nghe",
          singer: "Orange",
          path: "./assets/music/Em Hat Ai Nghe - Orange.mp3",
          image: "./assets/img/em-hat-ai-nghe.jpg"
        },
        {
            name: "Muốn Khóc Thật To",
            singer: "Trúc Nhân",
            path: "./assets/music/Muon Khoc That To - Truc Nhan.mp3",
            image: "./assets/img/muon-khoc-that-to.jpg"
        },
        {
          name: "Xích Thêm Chút",
          singer: "RPT Groovie x RPT MCK x TLinh",
          path: "./assets/music/Xich Them Chut - XTC Remix - RPT Groovie.mp3",
          image: "./assets/img/xich-them-chut.jpg"
        },
        {
            name: "Cưới Thôi",
            singer: "Masiu x Masew x B Ray x TAP",
            path: "./assets/music/Cuoi Thoi - Masew_ Masiu_ B Ray_ TAP.mp3",
            image: "./assets/img/cuoi-thoi.jpg"
        },
        {
            name: "Dịu Dàng Em Đến",
            singer: "Erik",
            path: "./assets/music/Diu Dang Em Den - Erik_ NinjaZ.mp3",
            image: "./assets/img/diu-dang-em-den.jpg"
        },
        {
            name: "3107 3",
            singer: "W/n x Duongg x Nâu x Titie",
            path: "./assets/music/3107-3 - W_n_ Nau_ Duongg_ Titie.mp3",
            image: "./assets/img/3107 3.jpg"
        },
        {
            name: "Nước Hoa",
            singer: "Hoàng Tôn",
            path: "./assets/music/Nuoc Hoa - Hoang Ton.mp3",
            image: "./assets/img/nuoc-hoa.jpg"
        }
               
    ],
    render() {
        const htmls = this.songs.map((song, index) => {
            return `
                <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index = ${index}>
                    <div class="thumb" style="background-image: url('${song.image}')">
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
    defineProperties() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex]
            }
        })
    },
    handleEvents() {
        const _this = this
        //Xử lý khi Cd quay hoặc dừng
        const cdThumbAnimate = cdThumb.animate([
            { transform: 'rotate(360deg)' }
        ], { 
            duration: 10000,
            iterations: Infinity
        })

        cdThumbAnimate.pause()

        //Xử lý phóng to/ thu nhỏ CD
        document.onscroll = function() {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newCdWidth = cdWidth - scrollTop;

            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
            cd.style.opacity = newCdWidth / cdWidth;
        }

        //Xử lý khi click
        playBtn.onclick = function() {
            if (_this.isPlaying) {
                audio.pause()                
            } else {                
                audio.play()                
            }
        }

        //Xử lý khi bài hát được chạy
        audio.onplay = function() {
            _this.isPlaying = true
            player.classList.add('playing')
            cdThumbAnimate.play()
        }

        //Xử lý khi bài hát bị dừng
        audio.onpause = function() {
            _this.isPlaying = false
            player.classList.remove('playing')
            cdThumbAnimate.pause()
        }

        //Khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function() {
            if (audio.duration) {
                const progressPercent = audio.currentTime / audio.duration * 100
                progress.value = progressPercent
            }
        }

        //Xử lý khi tua bài hát 
        progress.oninput = function (e) {
            const seekTime = audio.duration / 100 * e.target.value
            console.log(e.target.value);
            audio.currentTime = seekTime
        }

        //Xử lý khi chuyển bài hát tiếp theo  
        nextBtn.onclick = function() {
            if (_this.isRandom) {
                _this.playRandomSong()
                _this.loadCurrentSong()
            } else {
                _this.nextSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }

        //Xử lý khi chuyển bài hát trước đó
        prevBtn.onclick = function() {
            if (_this.isRandom) {
                _this.playRandomSong()
                _this.loadCurrentSong()
            } else {
                _this.prevSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }

        //Xử lý khi nhấn nút random 
        randomBtn.onclick = function(e) {
            _this.isRandom = !_this.isRandom
            randomBtn.classList.toggle('active', _this.isRandom)
            _this.playRandomSong()
        }

        //Xử lý khi bài hát kết thúc 
        audio.onended = function() {
            if (_this.isRandom) {
                _this.playRandomSong()
                _this.loadCurrentSong()
            } if (_this.isRepeat) {
                audio.play()
            } else {
                _this.nextSong()
            }
            audio.play()
        }

        //Xử lý khi nhấn nút repeat
        repeatBtn.onclick = function(e) {
            _this.isRepeat = !_this.isRepeat
            repeatBtn.classList.toggle('active', _this.isRepeat)
        }

        // Lắng nghe hành vi click vào playlist 
        playlist.onclick = function(e) {
            const songNode = e.target.closest('.song:not(.active)')
            if (songNode || e.target.closest('.option')) {
                //Xử lý khi click vào song
                if (songNode) {
                    _this.currentIndex = Number(songNode.getAttribute('data-index'))
                    _this.loadCurrentSong()
                    audio.play()
                    _this.render()
                }
            }
        }
        
    },
    scrollToActiveSong() {
        $('.song.active').scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        })    
    },
    loadCurrentSong() {
        heading.textContent = this.currentSong.name 
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path
    },
    nextSong() {
        this.currentIndex++
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },
    prevSong() {
        this.currentIndex--
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong()
    },
    playRandomSong() {
        let newIndex 
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while (newIndex === this.currentIndex)

        this.currentIndex = newIndex
    },
    start() {
        // Định nghĩa các thuộc tính cho object
        this.defineProperties()

        //Lắng nghe / xử lý các sự kiện (DOM Events)
        this.handleEvents()

        //Tải thông tin bài hát đầu tiên vào UI khi ứng dụng chạy
        this.loadCurrentSong()

        //Render playlist
        this.render()
    }   
}

app.start()
