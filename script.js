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
  console.log(songs);
  return songs;
}

async function main() {
  let songs = await getSongs();

  let songsUl = document
    .querySelector(".song-list")
    .getElementsByTagName("ul")[0];
  for (const song of songs) {
    songsUl.innerHTML += `<li>${
      song.replaceAll("%20", " ").split(".mp3")[0]
    }</li>`;
  }

  let audio = new Audio(songs[0]);
  audio.play();

  audio.addEventListener("loadeddata", () => {
    console.log(audio.duration, audio.currentSrc, audio.currentTime);
  });
}
main();
