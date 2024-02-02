import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const BASE_URL = "https://pixabay.com/api/";
const API_KEY = "42056951-259306f3e2aef1f0902f3daf3";
const searchForm = document.querySelector(".search-form");
const gallery = document.querySelector(".gallery");
const loaderContainer = document.querySelector(".loader-container");

searchForm.addEventListener("submit", handleSearch);
hideLoader(loaderContainer);

function handleSearch(event) {
	event.preventDefault();
	showLoader(loaderContainer);
	const form = event.currentTarget;
	const query = form.elements.query.value;
	if (query === "") {
		iziToast.error({
			title: "Error",
			message: "Please enter a search term",
		});
	}

	fetchImage(query)
		.then(data => {
			if (data.hits.length === 0) {
				iziToast.error({
					title: "Error",
					message:
						"Sorry, there are no images matching your search query. Please try again!",
				});
				gallery.innerHTML = "";
			} else showImagesCards(data.hits);
			hideLoader(loaderContainer);
		})
		.catch(() => {
			iziToast.error({
				title: "Error",
				message: "Failed to fetch images. Please try again later.",
			});
		})
		.finally(() => {
			searchForm.reset();
		});
}

function fetchImage(value) {
	const urlParams = new URLSearchParams({
		key: API_KEY,
		q: value,
		image_type: "photo",
		orientation: "horizontal",
		safesearch: true,
		per_page: 9,
	});

	return fetch(`${BASE_URL}?${urlParams}`).then(resp => {
		if (!resp.ok) {
			throw new Error(resp.statusText);
		}
		return resp.json();
	});
}
function showImagesCards(images) {
	const markup = images
		.map(
			({
				webformatURL,
				tags,
				likes,
				views,
				comments,
				downloads,
				largeImageURL,
			}) => `
    
      <div class="image-card">
      <a href = "${largeImageURL}" ><img class="img" src="${webformatURL}" alt="${tags}" /></a>
      <div class="image-stats">
        <div class="stat-item">
          <p class="stat-label">Likes:</p>
          <p class="stat-value">${likes}</p>
        </div>
        <div class="stat-item">
          <p class="stat-label">Views:</p>
          <p class="stat-value">${views}</p>
        </div>
        <div class="stat-item">
          <p class="stat-label">Comments:</p>
          <p class="stat-value">${comments}</p>
        </div>
        <div class="stat-item">
          <p class="stat-label">Downloads:</p>
          <p class="stat-value">${downloads}</p>
        </div>
      </div>
    </div>
    `,
		)
		.join("");
	gallery.innerHTML = markup;
	const lightbox = new SimpleLightbox(".gallery a", {
		captionsData: "alt",
		captionDelay: 250,
	});

	lightbox.refresh();
}

function showLoader(loaderContainer) {
	loaderContainer.style.display = "flex";
}

function hideLoader(loaderContainer) {
	loaderContainer.style.display = "none";
}
