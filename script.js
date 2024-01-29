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

(async function main() {
  let songs = await getSongs();

  let songsUl = document
    .querySelector(".song-list")
    .getElementsByTagName("ul")[0];

  for (const song of songs) {
    songsUl.innerHTML += `<li class="song-card rounded">
    <img class="invert" src="music.svg" alt="music" />
    <div class="info">
      <div class="text-orange w-20">
        ${song.replaceAll("%20", " ").split(".mp3")[0].split("-")[1]}
      </div>
      <div class="text-green text-sm">
        ${song.replaceAll("%20", " ").split(".mp3")[0].split("-")[0]}
      </div>
    </div>
    <span class="cursor-pointer play-now">Play Now</span>
    <div class="play-button cursor-pointer">
      <img class="invert cursor-pointer" src="play.svg" alt="play" />
    </div>
  </li>`;
  }

  let audio = new Audio(songs[0]);
  audio.play();

  audio.addEventListener("loadeddata", () => {
    console.log(audio.duration, audio.currentSrc, audio.currentTime);
  });
})();
