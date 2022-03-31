import Swiper, { Navigation, Pagination } from "swiper";

Swiper.use([Navigation, Pagination]);
// swiper.use([Navigation]);

const slider = () => {
	const swiper = new Swiper(".swiper-container", {
		loop: true,
		navigation: {
			nextEl: ".slider-button-next",
			prevEl: ".slider-button-prev",
		},
	});
};

export default slider;
