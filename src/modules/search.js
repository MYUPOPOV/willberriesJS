const search = () => {
	const input = document.querySelector(".search-block > input");
	const searchBtn = document.querySelector(".search-block > button");
	const specialOffers = document.querySelector(".mb-4");

	/* Функция: рендер товаров на странице */
	const renderGoods = (goods) => {
		const goodsContainer = document.querySelector(".long-goods-list");
		goodsContainer.innerHTML = "";
		goods.forEach((good) => {
			const goodBlock = document.createElement("div");
			goodBlock.classList.add("col-lg-3");
			goodBlock.classList.add("col-sm-6");
			// console.log(goodBlock);
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
	const getData = (value) => {
		fetch("https://test2-6aaeb-default-rtdb.firebaseio.com/db.json")
			.then((res) => res.json())
			.then((data) => {
				const array = data.filter((good) => {
					return good.name.toLowerCase().includes(value.toLowerCase());
					/* если при переборе data в названии товара (good.name(= data.name)) есть хотя 
          бы часть строки из input (вне зависимости от регистра), 
          то добавляем этот товаар в новый массив */
				});
				localStorage.setItem("goods", JSON.stringify(array)); // Кидаем новый массив в localStorage
				if (window.location.pathname !== "/goods.html") {
					// Если мы не на странице для отображения товара, то переходим на нее
					window.location.href = "/goods.html";
				} else {
					renderGoods(array); // Если на ней то рендерим нужные товары на странице
				}
			});
	};

	/* Слушаем клик по кнопке поиска */
	searchBtn.addEventListener("click", () => {
		getData(input.value); // Запускаем getData() с аргументом: содержимое input
	});

	/* Слушаем кнопки Промо и переходим на вторую страницу */
	specialOffers.addEventListener("click", (e) => {
		e.preventDefault();
		if (e.target.dataset.id === "002") {
			getData("Poplin top");
		}
		if (e.target.dataset.id === "009") {
			getData("Printed Shirt");
		}
	});
};

export default search;
