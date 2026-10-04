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