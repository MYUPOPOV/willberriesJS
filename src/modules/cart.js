const cart = () => {
	const cartBtn = document.querySelector(".button-cart");
	const cart = document.querySelector("#modal-cart");
	const cartClose = cart.querySelector(".modal-close");
	const goodsContainer = document.querySelector(".long-goods-list");
	const tableGoods = document.querySelector(".cart-table__goods");
	const totalPrice = document.querySelector(".card-table__total");
	const modalForm = document.querySelector(".modal-form");
	// const overlay = document.querySelector(".overlay");

	/* Функция удаление строчки коризны */
	const deleteCartItem = (id) => {
		const cart = JSON.parse(localStorage.getItem("cart"));
		const newCart = cart.filter((good) => {
			return good.id !== id;
		});
		localStorage.setItem("cart", JSON.stringify(newCart));
		renderCartGoods(JSON.parse(localStorage.getItem("cart")));
	};

	/* Функция добавление товара на + */
	const plusCartItem = (id) => {
		const cart = JSON.parse(localStorage.getItem("cart"));
		const newCart = cart.map((good) => {
			if (good.id === id) {
				good.count++;
			}
			return good;
		});
		localStorage.setItem("cart", JSON.stringify(cart));
		renderCartGoods(newCart);
	};

	/* Функция убавления товара на - */
	const minusCartItem = (id) => {
		const cart = JSON.parse(localStorage.getItem("cart"));
		const newCart = cart.map((good) => {
			if (good.id === id) {
				if (good.count > 0) {
					good.count--;
				}
			}
			return good;
		});
		localStorage.setItem("cart", JSON.stringify(newCart));
		renderCartGoods(newCart);
	};

	/* Рендер товаров */
	const renderCartGoods = (goods) => {
		tableGoods.innerHTML = "";
		goods.forEach((good) => {
			// console.log(good);
			const tr = document.createElement("tr");
			tr.innerHTML = `
        <tr></tr>
					<td>${good.name}</td>
					<td>${good.price}$</td>
					<td><button class="cart-btn-minus"">-</button></td>
					<td>${good.count}</td>
					<td><button class=" cart-btn-plus"">+</button></td>
					<td>${+good.count * +good.price}</td>
					<td><button class="cart-btn-delete"">x</button></td>
				</tr>
      `;
			tableGoods.append(tr);

			/* Слушаем в корзине [+] [-] [х] */
			tr.addEventListener("click", (e) => {
				if (e.target.classList.contains("cart-btn-minus")) {
					minusCartItem(good.id);
				} else if (e.target.classList.contains("cart-btn-plus")) {
					plusCartItem(good.id);
				} else if (e.target.classList.contains("cart-btn-delete")) {
					deleteCartItem(good.id);
				}
			});
		});

		/* Расчет полной стоимости товаров */
		totalPrice.innerHTML =
			goods.reduce((sum, current) => {
				return sum + current.price * current.count;
			}, 0) + "$";
	};

	/* Добавление товара в корзину (из id кнопки товара) */
	const addToCart = (id) => {
		const goods = JSON.parse(localStorage.getItem("goods")); // Находим нужный товар в localStorage('goods')
		const clickedGood = goods.find((good) => good.id === id);
		const cart = localStorage.getItem("cart") // Если localStorage('cart') существует, то берем данные оттуда
			? JSON.parse(localStorage.getItem("cart")) // Если не существует, то создаем новый массив
			: [];
		if (cart.some((good) => good.id === id)) {
			// Если такой товар в localStorage('cart') уже есть, то увеличиваем счетчик
			cart.map((good) => {
				if (good.id === id) {
					good.count++;
				}
			});
		} else {
			// Если в localStorage('cart') его нет, то добавляем в корзину
			clickedGood.count = 1;
			cart.push(clickedGood);
		}
		localStorage.setItem("cart", JSON.stringify(cart)); // Записываем в 	localStorage
	};

	/* Отправка товара на сервер */
	const sendForm = () => {
		const cartArray = localStorage.getItem("cart")
			? JSON.parse(localStorage.getItem("cart"))
			: [];

		const name = modalForm.querySelector(".nameCustomer");
		const phone = modalForm.querySelector(".phoneCustomer");
		fetch("https://jsonplaceholder.typicode.com/posts", {
			method: "POST",
			body: JSON.stringify({
				cart: cartArray,
				name: name.value,
				phone: phone.value,
			}),
		}).then(() => {
			const clearCart = [];
			localStorage.setItem("cart", JSON.stringify(clearCart));
			cart.style.display = "";
		});
	};

	/* Слушаем отправку заказа */
	modalForm.addEventListener("submit", (e) => {
		e.preventDefault();
		sendForm();
		// console.log("~ submit");
	});

	/* Слушаем открытие и закрытие корзины */
	cartBtn.addEventListener("click", () => {
		cart.style.display = "flex";
		const cartArray = JSON.parse(localStorage.getItem("cart"));
		renderCartGoods(cartArray);
		// console.log("Она открылась");
	});
	cartClose.addEventListener("click", () => {
		cart.style.display = "";
	});

	/* Закрытие корзины при нажатии вне модального окна */
	cart.addEventListener("click", (event) => {
		// console.log(event.target);

		if (
			!event.target.closest(".modal") &&
			event.target.classList.contains(overlay)
		) {
			cart.style.display = "";
		}
	});

	/* Закрытие корзины при нажатии на escape */
	window.addEventListener("keydown", (e) => {
		console.log(e);
		if (e.key === "Escape") {
			cart.style.display = "";
		}
	});

	/* Слушаем нажатие на кнопку покупки товара => отправляем его id в addToCart */
	if (goodsContainer) {
		goodsContainer.addEventListener("click", (event) => {
			event.preventDefault();
			if (event.target.closest(".add-to-cart")) {
				const buttonToCart = event.target.closest(".add-to-cart");
				const goodId = buttonToCart.dataset.id;
				addToCart(goodId);
			}
		});
	}
};

export default cart;
