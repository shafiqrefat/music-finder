/* SELECTORS */
const searchBtn = document.querySelector(".search-btn");
const searchInput = document.querySelector(".search-box input");
const searchResult = document.querySelector(".search-result");
const singleLyrics = document.querySelector(".single-lyrics");

/* SEARCH RESULT */

searchBtn.addEventListener("click",getSearchResult);
searchInput.addEventListener("keyup",(event) => {
	if(event.key === "Enter"){
		if(!searchInput.value){
			alert("please find the correct song name");
		}
		else if(searchInput.value){
			getSearchResult();
		}
	else{
		searchResult.innerHTML = "";
	}
	}
});

/* GETTING SEARCH RESULT FROM API */

function getSearchResult(){
	const songTitle = searchInput.value;
	if (songTitle){
		fetch(`https://api.lyrics.ovh/suggest/${songTitle}`)
		.then(response => response.json())
		.then(data =>{
			const fromApi = data.data;
			const songs = fromApi.map(collection => collection).slice(0,10);

			if(!songs.length){
				searchResult.innerHTML = `<h3 class="text-center">Sorry! no songs found.</h3>`;
				}
			else{
				searchResult.innerHTML = "";
				songs.map((collection) => {
					searchResult.innerHTML += `
					<!-- single result -->
					<div class="single-result d-flex align-items-center justify-content-between my-3 p-3">
						<div>
						<a href="${collection.link}" target="_blank">
							<img src="${collection.album.cover}" alt="cover of ${collection.album.title}">
						</a>
						</div>
						<div>
							<h3 class="lyrics-name">
								<a href="${collection.link}" target="_blank">${collection.title}</a>
							</h3>
							<p class="author lead">${collection.album.title} by <span style="font-style: italic;" >${collection.artist.name}</span>
							</p>
						</div>
						<div class="text-md-right text-center">
							<button class="btn btn-success" onclick="getLyrics('${collection.artist.name}', '${collection.title}', '${collection.title}', '${collection.artist.name}')">Get Lyrics </button>
						</div>
					</div>
					<!--  single result -->
					`
				});
			}
			searchResult.display.style = "block";
			singleLyrics.innerHTML = "";
		});
	}
	else{
		alert("please find the correct song name");
	}
}

/* GETTING LYRICS FROM API */

function getLyrics(artist,title,songTitle,artistName){
	fetch(`https://api.lyrics.ovh/v1/${artist}/${title}`)
	.then(response=> response.json())
	.then(data =>{
		singleLyrics.innerHTML = `
		<button class="btn back" onclick="back()">&lsaquo; back</button>
		<h2 class="text-success mb-4">${artistName} - ${songTitle}</h2>
		<pre class="lyric text-white">${
			!data.lyrics ? data.error : data.lyrics
		}</pre>
	`;
	searchResult.style.display = "none";
	});

	searchInput.value = "";
}

/* BACK TO  THE SEARCH RESULT */
function back() {
	searchResult.style.display = "block";
	singleLyrics.innerHTML = "";
}