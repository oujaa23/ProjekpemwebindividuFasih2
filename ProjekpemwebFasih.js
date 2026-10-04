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