import axios from "axios";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

axios.defaults.baseURL = "https://pixabay.com/api/";

const API_KEY = "42056951-259306f3e2aef1f0902f3daf3";
const searchForm = document.querySelector(".search-form");
const gallery = document.querySelector(".gallery");
const loaderContainer = document.querySelector(".loader-container");
const btnShowMore = document.querySelector(".show-btn");
let currentPage = 1;

let currentQuery = "";
function showLoader(loaderContainer) {
	loaderContainer.style.display = "flex";
}

function hideLoader(loaderContainer) {
	loaderContainer.style.display = "none";
}
function hideLoadMoreBtn() {
	btnShowMore.style.display = "none";
}
function showLoadMoreBtn() {
	btnShowMore.style.display = "block";
}
async function showMoreImages() {
	currentPage++;
	const response = await fetchImage(currentQuery);
	showImagesCards(response.hits);

	smoothScroll();
	if (currentPage * 15 >= response.totalHits) {
		btnShowMore.style.display = "none";
		iziToast.info({
			title: "Sorry",
			message: "We're sorry, but you've reached the end of search results.",
		});
	}
}
function smoothScroll() {
	const cardHeight = document
		.querySelector(".image-card")
		.getBoundingClientRect().height;

	window.scrollBy({
		top: cardHeight * 2,
		behavior: "smooth",
	});
}

hideLoadMoreBtn();
gallery.innerHTML = "";

searchForm.addEventListener("submit", handleSearch);
hideLoader(loaderContainer);

async function handleSearch(event) {
	event.preventDefault();
	gallery.innerHTML = "";
	showLoader(loaderContainer);
	const form = event.currentTarget;
	const query = form.elements.query.value;
	currentQuery = query;
	if (query === "") {
		iziToast.error({
			title: "Error",
			message: "Please enter a search term",
		});
		hideLoader(loaderContainer);
		hideLoadMoreBtn();
		gallery.innerHTML = "";
		return;
	}
	gallery.innerHTML = "";

	try {
		await fetchImage(query)
			.then(data => {
				if (data.hits.length === 0) {
					iziToast.error({
						title: "Error",
						message:
							"Sorry, there are no images matching your search query. Please try again!",
					});
					hideLoadMoreBtn();
				} else showImagesCards(data.hits);
				hideLoader(loaderContainer);
				showLoadMoreBtn();
			})
			.finally(() => {
				searchForm.reset();
			});
	} catch {
		iziToast.error({
			title: "Error",
			message: "Failed to fetch images. Please try again later.",
		});
	}
}
btnShowMore.addEventListener("click", showMoreImages);

async function fetchImage(value) {
	const params = {
		params: {
			key: API_KEY,
			q: value,
			image_type: "photo",
			orientation: "horizontal",
			safesearch: true,
			per_page: 15,
			page: currentPage,
		},
	};

	return await axios(params).then(({ data }) => data);
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
	gallery.insertAdjacentHTML("beforeend", markup);
	const lightbox = new SimpleLightbox(".gallery a", {
		captionsData: "alt",
		captionDelay: 250,
	});

	lightbox.refresh();
}
