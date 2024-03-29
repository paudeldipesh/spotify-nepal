const playCardBtnEl = document.querySelector(".play");
const previousBtnEl = document.getElementById("previous");
const playBtnEl = document.getElementById("play");
const nextBtnEl = document.getElementById("next");
const cardContainerEl = document.querySelector(".card-container");

let songs;

function secondsToMinutesAndSecondsFormat(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "00:00";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");

  return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs() {
  const response = await fetch("http://127.0.0.1:3000/songs/");
  const data = await response.text();

  let div = document.createElement("div");
  div.innerHTML = data;

  const anchor = div.getElementsByTagName("a");
  let songs = [];

  for (let index = 0; index < anchor.length; index++) {
    const element = anchor[index];

    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split("/songs/")[1]);
    }
  }
  return songs;
}

let currentSong = new Audio();

const playMusic = (music, pause = false) => {
  currentSong.src = `/songs/${music}`;
  if (!pause) {
    currentSong.play();
    playBtnEl.src = "./images/pause.svg";
  }
  document.querySelector(".song-info").innerHTML = decodeURIComponent(music);
  document.querySelector(".song-time").innerHTML = "00:00 / 00:00";
};

(async function main() {
  songs = await getSongs();
  playMusic(songs[0], true);

  let songsUl = document
    .querySelector(".song-list")
    .getElementsByTagName("ul")[0];

  for (const song of songs) {
    songsUl.innerHTML += `<li class="song-card rounded cursor-pointer">
    <img class="invert" src="./images/music.svg" alt="music" />
    <div class="info">
      <div class="text-orange w-20">
        ${decodeURIComponent(song)}
      </div>
    </div>
    <span class="play-now">Play Now</span>
    <div class="play-button cursor-pointer">
      <img class="invert cursor-pointer" src="./images/play.svg" alt="play" />
    </div>
  </li>`;
  }

  for (const song of songs) {
    cardContainerEl.innerHTML += `<div class="card rounded">
    <div class="play">
      <div class="circular-box">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M5 20V4L19 12L5 20Z"
            stroke="none"
            stroke-width="1.5"
            stroke-linejoin="round"
          />
        </svg>
      </div>
    </div>
    <img
      src="https://i.scdn.co/image/ab67706f00000002d771dc645afe9b87978b1d3e"
      alt="music"
    />
    <h3 class="text-orange">Happy Hits</h3>
    <p>${decodeURIComponent(song)}</p>
  </div>`;
  }

  Array.from(
    document.querySelector(".song-list").getElementsByTagName("li")
  ).forEach((element) => {
    element.addEventListener("click", (element) => {
      playMusic(
        element.currentTarget
          .querySelector(".info")
          .firstElementChild.innerHTML.trim()
      );
    });
  });

  playBtnEl.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      playBtnEl.src = "./images/pause.svg";
    } else {
      currentSong.pause();
      playBtnEl.src = "./images/play.svg";
    }
  });

  currentSong.addEventListener("timeupdate", () => {
    document.querySelector(
      ".song-time"
    ).innerHTML = `${secondsToMinutesAndSecondsFormat(
      currentSong.currentTime
    )} / ${secondsToMinutesAndSecondsFormat(currentSong.duration)}`;
    document.querySelector(".circle").style.left = `${
      (currentSong.currentTime / currentSong.duration) * 100
    }%`;
  });

  document.querySelector(".seekbar").addEventListener("click", (e) => {
    let barPercent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = `${barPercent}%`;
    currentSong.currentTime = (currentSong.duration * barPercent) / 100;
  });

  document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0";
  });

  document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-100%";
  });

  previousBtnEl.addEventListener("click", () => {
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    if (index - 1 >= 0) {
      playMusic(songs[index - 1]);
    }
  });

  nextBtnEl.addEventListener("click", () => {
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    if (index + 1 < songs.length) {
      playMusic(songs[index + 1]);
    }
  });

  document
    .querySelector(".range")
    .firstElementChild.addEventListener("change", (e) => {
      currentSong.volume = Number.parseInt(e.target.value) / 100;
    });
})();
