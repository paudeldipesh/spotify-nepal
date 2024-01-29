const playBtnEl = document.querySelector(".play");
playBtnEl.addEventListener("click", () => {
  console.log("Music played");
});

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

const playMusic = (music) => {
  currentSong.src = `/songs/${music}`;
  currentSong.play();
};

(async function main() {
  let songs = await getSongs();

  let songsUl = document
    .querySelector(".song-list")
    .getElementsByTagName("ul")[0];

  for (const song of songs) {
    songsUl.innerHTML += `<li class="song-card rounded cursor-pointer">
    <img class="invert" src="music.svg" alt="music" />
    <div class="info">
      <div class="text-orange w-20">
        ${song.replaceAll("%20", " ")}
      </div>
    </div>
    <span class="play-now">Play Now</span>
    <div class="play-button cursor-pointer">
      <img class="invert cursor-pointer" src="play.svg" alt="play" />
    </div>
  </li>`;
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
})();
