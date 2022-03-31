const getGoods = () => {
	const links = document.querySelectorAll(".navigation-link"); // Все элементы навигации
	const specialOffers = document.querySelector(".mb-4");

	/* Функция: рендер товаров */
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
      `;
			goodsContainer.append(goodBlock);
		});
	};

	/* Получаем данные с БД */
	const getData = (value, category) => {
		fetch("https://test2-6aaeb-default-rtdb.firebaseio.com/db.json")
			.then((res) => res.json())
			.then((data) => {
				console.log("~ data", data);

				const array = category ? data.filter((item) => item[category] === value) : data;
				/*  Берем всю БД (все объекты товаров) как data
        // В новом массиве если категория не null
				то фильтруем data.[(из конпки) либо category либо gender] по совпадению с Содежимым кнопки 
        (WOMENS MENS CLOTHING ACCESSORIES SHOES ALL)
			  Иначе возвращаем всю data */
				localStorage.setItem("goods", JSON.stringify(array)); // Запиыаем в localStorage
				if (window.location.pathname !== "/goods.html") {
					// Если мы не на странице для отображения товара
					window.location.href = "/goods.html"; // То переходим на нее
				} else {
					renderGoods(array); // Если на ней то рендерим нужные товары на странице
				}
			});
	};

	/* Обработчик события "click" для любой навигационной кнопки */
	links.forEach(function (link) {
		link.addEventListener("click", (event) => {
			event.preventDefault();
			const linkValue = link.textContent;
			const category = link.dataset.field;
			getData(linkValue, category);
			// Передаем в функию getData аргументы нав. кпопки: data-field="category" и содержимое тэга
		});
	});

	/* Если в localStorage что-то есть под ключом goods И страница у нас goods.html, то рендерим товары из него */
	if (localStorage.getItem("goods") && window.location.pathname === "/goods.html") {
		renderGoods(JSON.parse(localStorage.getItem("goods")));
	}

	/* Открываем весь список по кнопке viewAll*/
	specialOffers.addEventListener("click", (e) => {
		e.preventDefault();
		if (e.target.classList.contains("viewAll")) {
			getData();
		}
	});
};

export default getGoods;
