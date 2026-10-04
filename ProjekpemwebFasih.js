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

