'use strict';


const $ = s => document.querySelector(s);

const $$ = s =>
    [...document.querySelectorAll(s)];


const formatTime = s => {

    if (!Number.isFinite(s)) {
        return '0:00';
    }

    return `${Math.floor(s / 60)}:${String(
        Math.floor(s % 60)
    ).padStart(2, '0')}`;
};

/* =========================
   AUDIO PLAYER
========================= */

const audioPlayer =
    document.getElementById('audioPlayer');

/* =========================
   GENRE
========================= */

const genres = {

    Pop: [
        '#db2777',
        '#f9a8d4',
        '🎤'
    ],

    Rock: [
        '#dc2626',
        '#fca5a5',
        '🎸'
    ],

    Shoegaze: [
        '#6c5ce7',
        '#c4b5fd',
        '🌫️'
    ],

    'Midwest Emo': [
        '#0d9488',
        '#5eead4',
        '🌧️'
    ],

    'Post Hardcore': [
        '#c2410c',
        '#fdba74',
        '🔥'
    ]

};


/* =========================
   DATA LAGU
========================= */

const songs = [

    /* POP */

    {
        id: 1,
        title: 'Dan',
        artist: 'Sheila On 7',
        genre: 'Pop',
        duration: 281,
        favorite: true,
        audio: 'music/dan.mp3'
    },

    {
        id: 2,
        title: 'Iris',
        artist: 'The Goo Goo Dolls',
        genre: 'Pop',
        duration: 290,
        favorite: false,
        audio: 'music/iris.mp3'
    },

    {
        id: 3,
        title: 'Separuh Aku',
        artist: 'Noah',
        genre: 'Pop',
        duration: 266,
        favorite: false,
        audio: 'music/separuh-aku.mp3'
    },


    /* ROCK */

    {
        id: 4,
        title: 'All I Need',
        artist: 'Radiohead',
        genre: 'Rock',
        duration: 228,
        favorite: false,
        audio: 'music/all-i-need.mp3'
    },

    {
        id: 5,
        title: 'Lepaskan Diriku',
        artist: 'J-Rocks',
        genre: 'Rock',
        duration: 237,
        favorite: false,
        audio: 'music/lepaskan-diriku.mp3'
    },

    /* SHOEGAZE */

    {
        id: 6,
        title: 'Dagger',
        artist: 'Slowdive',
        genre: 'Shoegaze',
        duration: 218,
        favorite: true,
        audio: 'music/dagger.mp3'
    },

    {
        id: 7,
        title: 'Alison',
        artist: 'Slowdive',
        genre: 'Shoegaze',
        duration: 236,
        favorite: false,
        audio: 'music/alison.mp3'
    },

    /* MIDWEST EMO */

    {
        id: 8,
        title: 'Summer',
        artist: 'Oakwood',
        genre: 'Midwest Emo',
        duration: 124,
        favorite: false,
        audio: 'music/summer.mp3'
    },

    {
        id: 9,
        title: '27',
        artist: 'Title Fight',
        genre: 'Midwest Emo',
        duration: 147,
        favorite: false,
        audio: 'music/27.mp3'
    },

    {
        id: 10,
        title: 'The Summer Ends',
        artist: 'American Football',
        genre: 'Midwest Emo',
        duration: 286,
        favorite: false,
        audio: 'music/the-summer-ends.mp3'
    },


    /* POST HARDCORE */

    {
        id: 11,
        title: 'Apology',
        artist: 'Alesana',
        genre: 'Post Hardcore',
        duration: 317,
        favorite: true,
        audio: 'music/apology.mp3'
    },

    {
        id: 12,
        title: 'Seven Years',
        artist: 'Saosin',
        genre: 'Post Hardcore',
        duration: 193,
        favorite: false,
        audio: 'music/seven-years.mp3'
    }

];

const todos = [];

/* =========================
   STATE
========================= */

const state = {

    genre: 'Semua',

    query: '',

    sort: 'default',

    queue: [],

    current: null,

    playing: false,

    elapsed: 0,

    focusMinutes: 0,

    sessions: 0

};

/* =========================
   HELPER
========================= */

const styleFor = g =>
    `background:linear-gradient(135deg,${genres[g][0]},${genres[g][1]})`;


const songById = id =>
    songs.find(s => s.id === id);


/* =========================
   NAVIGASI
========================= */

function showPage(page) {

    $$('.page').forEach(p => {

        p.classList.toggle(
            'active',
            p.id === page
        );

    });


    $$('.nav-btn').forEach(b => {

        b.classList.toggle(
            'active',
            b.dataset.page === page
        );

    });


    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });

}

/* =========================
   FILTER LAGU
========================= */

function visibleSongs() {

    let r = songs.filter(s => {

        const gm =
            state.genre === 'Semua' ||
            s.genre === state.genre;

        const q =
            state.query.toLowerCase();

        return gm &&
            `${s.title} ${s.artist} ${s.genre}`
                .toLowerCase()
                .includes(q);

    });


    if (state.sort === 'title') {

        r.sort((a, b) =>
            a.title.localeCompare(b.title)
        );

    }


    else if (state.sort === 'duration') {

        r.sort((a, b) =>
            a.duration - b.duration
        );

    }


    else if (state.sort === 'favorite') {

        r.sort((a, b) =>
            Number(b.favorite) -
            Number(a.favorite)
        );

    }


    return r;

}

/* =========================
   STATISTIK
========================= */

function renderStats() {

    const total =
        songs.reduce(
            (a, s) => a + s.duration,
            0
        );


    const fav =
        songs.filter(
            s => s.favorite
        ).length;


    const data = [

        [
            songs.length,
            'Lagu di koleksi'
        ],

        [
            Math.round(total / 60) + ' mnt',
            'Total durasi playlist'
        ],

        [
            fav,
            'Lagu favorit'
        ],

        [
            state.focusMinutes + ' mnt',
            'Fokus hari ini'
        ]

    ];


    $('#stats').innerHTML =
        data.map(x => `

            <div class="stat">

                <b>
                    ${x[0]}
                </b>

                <span>
                    ${x[1]}
                </span>

            </div>

        `).join('');

}


/* =========================
   GENRE
========================= */

function renderGenres() {

    $('#moods').innerHTML =
        Object.keys(genres)
            .map(g => `

                <button
                    class="mood"
                    data-genre="${g}"
                    style="${styleFor(g)}">

                    <span class="mood-icon">
                        ${genres[g][2]}
                    </span>

                    <span>
                        ${g}
                    </span>

                    <small>
                        ${songs.filter(
                            s => s.genre === g
                        ).length}
                        lagu
                    </small>

                </button>

            `)
            .join('');

}

/* =========================
   CHIP
========================= */

function renderChips() {

    const all = [
        'Semua',
        ...Object.keys(genres)
    ];


    $('#chips').innerHTML =
        all.map(g => `

            <button
                type="button"
                class="chip ${
                    state.genre === g
                        ? 'active'
                        : ''
                }"
                data-genre="${g}">

                ${g}

            </button>

        `).join('');

}

/* =========================
   PLAYLIST
========================= */

function renderPlaylist() {

    const list =
        visibleSongs();


    $('#count').textContent =
        `Menampilkan ${list.length} dari ${songs.length} lagu`;


    $('#grid').innerHTML =
        list.length

            ? list.map(s => `

                <article class="song">

                    <div
                        class="cover song-cover"
                        style="${styleFor(s.genre)}">

                        ♪

                    </div>


                    <h2>
                        ${s.title}
                    </h2>


                    <small>
                        ${s.artist} · ${s.genre}
                    </small>


                    <div class="song-actions">

                        <button
                            class="btn primary"
                            data-play="${s.id}">

                            Putar

                        </button>


                        <button
                            class="btn"
                            data-favorite="${s.id}">

                            ${
                                s.favorite
                                    ? '♥'
                                    : '♡'
                            }

                        </button>

                    </div>

                </article>

            `).join('')

            : `

                <p class="muted">
                    Lagu tidak ditemukan.
                </p>

            `;

}


/* =========================
   QUEUE
========================= */

function renderQueue() {

    $('#queue').innerHTML =
        state.queue.length

            ? state.queue.map((id, i) => {

                const s =
                    songById(id);


                return `

                    <li>

                        <div
                            class="cover small"
                            style="${styleFor(s.genre)}">

                            ♪

                        </div>


                        <span class="grow">

                            <b>
                                ${i + 1}.
                                ${s.title}
                            </b>

                            <br>

                            <small class="muted">
                                ${s.artist} ·
                                ${formatTime(s.duration)}
                            </small>

                        </span>


                        <button
                            data-remove="${id}">

                            ✕

                        </button>

                    </li>

                `;

            }).join('')

            : `

                <li class="muted">
                    Antrean kosong.
                </li>

            `;

}

/* =========================
   TUGAS
========================= */

function renderTodos() {

    $('#todos').innerHTML =
        todos.map(t => `

            <li>

                <input
                    type="checkbox"
                    data-todo="${t.id}"
                    ${t.done ? 'checked' : ''}>


                <span class="grow">
                    ${t.text}
                </span>


                <button
                    data-delete="${t.id}">

                    ✕

                </button>

            </li>

        `).join('');

}



/* =========================
   PLAYER UI
========================= */

function renderPlayer() {

    const s =
        songById(state.current);


    $('#mini').hidden = !s;


    $$('[data-act="toggle"]').forEach(
        b => {

            b.textContent =
                state.playing
                    ? 'Ⅱ'
                    : '▶';

        }
    );


    if (!s) {
        return;
    }


    [

        [
            '#homeCover',
            '#homeTitle',
            '#homeArtist'
        ],

        [
            '#fCover',
            '#fTitle',
            '#fArtist'
        ]

    ].forEach(x => {

        $(x[0]).style.cssText =
            styleFor(s.genre);


        $(x[1]).textContent =
            s.title;


        $(x[2]).textContent =
            s.artist +
            ' · ' +
            s.genre;

    });


    $('#mCover').style.cssText =
        styleFor(s.genre);


    $('#mTitle').textContent =
        s.title;


    $('#mArtist').textContent =
        s.artist;


    const duration =
        audioPlayer.duration ||
        s.duration;


    $('#fDur').textContent =
        formatTime(duration);


    $('#seek').max =
        duration;


    $('#seek').value =
        state.elapsed;


    $('#fNow').textContent =
        formatTime(state.elapsed);

}


/* =========================
   RENDER SEMUA
========================= */

function renderAll() {

    renderStats();

    renderPlaylist();

    renderQueue();

    renderTodos();

    renderPlayer();

}



/* =========================
   PUTAR LAGU
========================= */

function setPlaying(v) {

    state.playing = v;


    if (!audioPlayer.src) {

        state.playing = false;

        renderPlayer();

        return;

    }


    if (v) {

        audioPlayer.play()
            .catch(error => {

                console.error(
                    'Gagal memutar audio:',
                    error
                );

                state.playing = false;

                renderPlayer();

            });

    }

    else {

        audioPlayer.pause();

    }


    renderPlayer();

}



/* =========================
   PILIH LAGU
========================= */

function playSong(
    id,
    replace = false
) {

    const song =
        songById(id);


    if (!song) {
        return;
    }


    if (replace) {

        state.queue =
            visibleSongs()
                .map(s => s.id);

    }


    if (!state.queue.includes(id)) {

        state.queue.push(id);

    }


    state.current = id;

    state.elapsed = 0;


    audioPlayer.pause();


    audioPlayer.src =
        song.audio;


    audioPlayer.currentTime = 0;


    audioPlayer.load();


    audioPlayer.play()
        .then(() => {

            state.playing = true;

            renderAll();

        })

        .catch(error => {

            console.error(
                'Audio tidak dapat diputar:',
                error
            );

            state.playing = false;

            renderAll();

        });


    renderAll();

}



/* =========================
   NEXT
========================= */

function nextSong() {

    if (!state.queue.length) {

        shuffle();

        return;

    }


    const i =
        state.queue.indexOf(
            state.current
        );


    const nextIndex =
        i === -1
            ? 0
            : (i + 1) %
              state.queue.length;


    playSong(
        state.queue[nextIndex]
    );

}


/* =========================
   PREVIOUS
========================= */

function prevSong() {

    if (!state.queue.length) {
        return;
    }


    const i =
        state.queue.indexOf(
            state.current
        );


    const prevIndex =
        i === -1
            ? 0
            : (
                i - 1 +
                state.queue.length
            ) %
            state.queue.length;


    playSong(
        state.queue[prevIndex]
    );

}

/* =========================
   ACAK
========================= */

function shuffle() {

    const shuffled =
        [...songs]
            .sort(
                () => Math.random() - 0.5
            );


    state.queue =
        shuffled.map(
            s => s.id
        );


    const first =
        shuffled[0];


    if (first) {

        playSong(
            first.id
        );

    }

}

/* =========================
   AUDIO EVENT
========================= */

audioPlayer.addEventListener(
    'timeupdate',
    () => {

        state.elapsed =
            audioPlayer.currentTime;


        renderPlayer();

    }
);

audioPlayer.addEventListener(
    'loadedmetadata',
    () => {

        const s =
            songById(state.current);


        if (!s) {
            return;
        }


        $('#fDur').textContent =
            formatTime(
                audioPlayer.duration
            );


        $('#seek').max =
            audioPlayer.duration;

    }
);


audioPlayer.addEventListener(
    'play',
    () => {

        state.playing = true;

        renderPlayer();

    }
);


audioPlayer.addEventListener(
    'pause',
    () => {

        state.playing = false;

        renderPlayer();

    }
);


audioPlayer.addEventListener(
    'ended',
    () => {

        state.elapsed = 0;

        nextSong();

    }
);


audioPlayer.addEventListener(
    'error',
    () => {

        state.playing = false;

        console.error(
            'File audio tidak ditemukan atau tidak dapat diputar:',
            audioPlayer.src
        );

        renderPlayer();

    }
);


/* =========================
   TRACK TIMER
========================= */

const pomo = {

    mode: 25,

    left: 1500,

    running: false,

    id: null

};

function renderTimer() {

    $('#timer').textContent =
        formatTime(pomo.left);


    $('#tStart').textContent =
        pomo.running
            ? 'Jeda'
            : 'Mulai Track';


    $('#sessions').textContent =
        state.sessions;

}

function toggleTimer() {

    if (pomo.running) {

        clearInterval(
            pomo.id
        );


        pomo.running = false;


        renderTimer();

        return;

    }

    pomo.running = true;


    pomo.id =
        setInterval(() => {

            pomo.left--;


            if (pomo.left <= 0) {

                clearInterval(
                    pomo.id
                );


                pomo.running = false;


                if (pomo.mode === 25) {

                    state.sessions++;

                    state.focusMinutes += 25;

                    renderStats();


                    alert(
                        'Track selesai! Waktunya istirahat.'
                    );

                }


                pomo.left =
                    pomo.mode * 60;

            }


            renderTimer();

        }, 1000);


    renderTimer();

}


/* =========================
   CLICK EVENT
========================= */

document.addEventListener(
    'click',
    e => {

        const p =
            e.target.closest(
                '[data-page]'
            );


        if (p) {

            e.preventDefault();

            showPage(
                p.dataset.page
            );

            return;

        }



        const g =
            e.target.closest(
                '[data-genre]'
            );


        if (g) {

            state.genre =
                g.dataset.genre;


            renderChips();

            renderPlaylist();

            showPage(
                'playlist'
            );

            return;

        }

        const pl =
            e.target.closest(
                '[data-play]'
            );


        if (pl) {

            playSong(
                Number(
                    pl.dataset.play
                ),
                pl.closest('#grid') !== null
            );

            return;

        }

        const fav =
            e.target.closest(
                '[data-favorite]'
            );


        if (fav) {

            const s =
                songById(
                    Number(
                        fav.dataset.favorite
                    )
                );


            s.favorite =
                !s.favorite;


            renderPlaylist();

            renderStats();

            return;

        }

        const rm =
            e.target.closest(
                '[data-remove]'
            );


        if (rm) {

            const id =
                Number(
                    rm.dataset.remove
                );


            state.queue =
                state.queue.filter(
                    x => x !== id
                );


            renderQueue();

            return;

        }

        const act =
            e.target.closest(
                '[data-act]'
            );


        if (act) {

            if (
                act.dataset.act ===
                'toggle'
            ) {

                if (state.current) {

                    setPlaying(
                        !state.playing
                    );

                }

                else {

                    shuffle();

                }

            }


            else if (
                act.dataset.act ===
                'next'
            ) {

                nextSong();

            }


            else {

                prevSong();

            }


            return;

        }

        const mode =
            e.target.closest(
                '[data-mode]'
            );


        if (mode) {

            pomo.mode =
                Number(
                    mode.dataset.mode
                );


            pomo.left =
                pomo.mode * 60;


            clearInterval(
                pomo.id
            );


            pomo.running = false;


            $$('[data-mode]').forEach(
                b => {

                    b.classList.toggle(
                        'active',
                        b === mode
                    );

                }
            );


            renderTimer();

            return;

        }

        const del =
            e.target.closest(
                '[data-delete]'
            );


        if (del) {

            const i =
                todos.findIndex(
                    t =>
                        t.id ===
                        Number(
                            del.dataset.delete
                        )
                );


            if (i > -1) {

                todos.splice(
                    i,
                    1
                );

            }


            renderTodos();

        }

    }
);


/* =========================
   ACAK
========================= */

$('#btnAcak').addEventListener(
    'click',
    shuffle
);

/* =========================
   SEARCH
========================= */

$('#search').addEventListener(
    'input',
    e => {

        state.query =
            e.target.value;

        renderPlaylist();

    }
);

/* =========================
   SORT
========================= */

$('#sort').addEventListener(
    'change',
    e => {

        state.sort =
            e.target.value;

        renderPlaylist();

    }
);

/* =========================
   SEEK
========================= */

$('#seek').addEventListener(
    'input',
    e => {

        const value =
            Number(
                e.target.value
            );


        state.elapsed =
            value;


        if (
            Number.isFinite(
                audioPlayer.duration
            )
        ) {

            audioPlayer.currentTime =
                value;

        }


        renderPlayer();

    }
);

/* =========================
   TRACK TIMER BUTTON
========================= */

$('#tStart').addEventListener(
    'click',
    toggleTimer
);

/* =========================
   RESET TIMER
========================= */

$('#tReset').addEventListener(
    'click',
    () => {

        clearInterval(
            pomo.id
        );


        pomo.running = false;


        pomo.left =
            pomo.mode * 60;


        renderTimer();

    }
);

/* =========================
   TAMBAH TUGAS
========================= */

$('#todoForm').addEventListener(
    'submit',
    e => {

        e.preventDefault();


        const input =
            $('#todoInput');


        const text =
            input.value.trim();


        if (text) {

            todos.push({

                id: Date.now(),

                text: text,

                done: false

            });


            input.value = '';


            renderTodos();

        }

    }
);

/* =========================
   CHECK TUGAS
========================= */

$('#todos').addEventListener(
    'change',
    e => {

        const c =
            e.target.closest(
                '[data-todo]'
            );


        if (c) {

            const t =
                todos.find(
                    x =>
                        x.id ===
                        Number(
                            c.dataset.todo
                        )
                );


            if (t) {

                t.done =
                    c.checked;

            }


            renderTodos();

        }

    }
);


renderGenres();
renderChips();
renderTimer();
renderAll();
