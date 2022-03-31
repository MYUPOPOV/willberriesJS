const newGoods = () => {
	const viewAll = document.querySelector(".more"); // Кнопка View All

	/* Функция: рендер товаров на странице */
	const renderGoods = (goods) => {
		const goodsContainer = document.querySelector(".long-goods-list");
		goodsContainer.innerHTML = "";
		goods.forEach((good) => {
			const goodBlock = document.createElement("div");
			goodBlock.classList.add("col-lg-3");
			goodBlock.classList.add("col-sm-6");
			goodBlock.innerHTML = `
		  <div class="goods-card">
		      <span class="label ${good.label ? null : "d-none"}">${good.label}</span>
		      <img src="db/${good.img}"" alt="${good.name}" class="goods-image">
		      <h3 class="goods-title">${good.name}</h3>

		      <p class="goods-description">${good.description}</p>

		      <button class="button goods-card-btn add-to-cart" data-id="${good.id}">
		        <span class="button-price">$${good.price}</span>
		      </button>
		    </div>
	// 	`;
			goodsContainer.append(goodBlock);
		});
	};

	/* Получаем данные с БД */
	const getData = () => {
		fetch("https://test2-6aaeb-default-rtdb.firebaseio.com/db.json")
			.then((res) => res.json())
			.then((data) => {
				console.log("~ data", data);
				const array = data.filter((good) => {
					// Фильтруем все товары по label.toLowerCase() === "new"
					return good.label.toLowerCase() === "new";
				});

				localStorage.setItem("goods", JSON.stringify(array)); // Записываем в localStorage
				window.location.href = "/goods.html"; // Переходим на страницу для отображения товаров
				renderGoods(array); // Рендерим товары

				// }
			});
	};

	/* Слушать кнопку только если она существует на странице (страница не "/goods.html") */
	if (window.location.pathname !== "/goods.html") {
		viewAll.addEventListener("click", () => {
			getData();
		});
	}
};

export default newGoods;
