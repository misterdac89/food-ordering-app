import { menuArray } from "/data.js";

const foodSection = document.getElementById("food-section");
const orderContainer = document.getElementById("order-container");
const divider = document.getElementById("divider");
const totalEl = document.getElementById("total");
const orderSection = document.getElementById("order-section");
const orderBtn = document.querySelector(".order-btn");
const modalContainer = document.getElementById("modal-container");

let foodNamesAndPrices = [];
let totalPrices = [];

orderSection.style.display = "none";
modalContainer.style.display = "none";

function getOrderItems(items) {
  return items
    .map((item) => {
      // destructuring the item object
      const { name, ingredients, price, emoji, id } = item;

      // constructing the food components in is normal format. Ex: 'pepperoni, mushrom, mozarella'
      const getIngredientsArrElements = (elements) => {
        let string = ``;
        for (let i = 0; i < elements.length; i++) {
          if (elements[i] === elements[elements.length - 1]) {
            string += elements[i];
          } else {
            string += elements[i] + ", ";
          }
        }
        return string;
      };

      const ingredientElements = getIngredientsArrElements(ingredients);

      // Rendering html for all available food
      return `
                <div class='food-container'>
                    <p class='food-emoji'>${emoji}</p>
                    <div class='food-info'>
                        <div class='info'>
                            <p class='food-name'>${name}</p>
                            <p class='food-ingredients'>${ingredientElements}</p>
                            <p class='food-price'>$${price}</p>
                        </div>
                        <i class="fa-solid fa-plus select-btn" id=${id} data-plus="${id}"></i>
                    </div>
                </div>
        `;
    })
    .join(" ");
}

function render() {
  foodSection.innerHTML = getOrderItems(menuArray);
}

render();

document.addEventListener("click", function (e) {
  if (e.target.id) {
    displayOrderHtml(e.target.id);
  }
});

function displayOrderHtml(objId) {
  // targeting the object of the selected item.
  const targetObj = menuArray[objId];

  //The object destructuring
  const { name: foodName, ingredients, id, price, emoji } = targetObj;

  // Pushing the variables name and price to the foodNamesAndPrices array
  foodNamesAndPrices.push(foodName, price);

  // Pushing the variable price to the foodPrice array
  totalPrices.push(price);

  // destructuring foodNamesAndPrices array
  const [firstElement, secondElement] = foodNamesAndPrices;

  // Render HTML for the order container
  orderContainer.innerHTML += `
            <div class='order-wrapper flex'>
                <p class='bold'>${firstElement}
                    <span class='remove'>remove</span>
                </p>
                <p class='bold prices'>$${secondElement}</p>
            </div>
                        `;

  //Displaying the order section on the DOM
  orderSection.style.display = "block";

  // foodNamesAndPrices array reassignment
  foodNamesAndPrices = [];

  divider.style.display = "block";

  // Looking for the total price of the selected items.
  let total = totalPrices.reduce((accumulator, currentelement) => {
    return accumulator + currentelement;
  });

  //displaying the total price on the DOM
  totalEl.innerHTML = `
            <div class='flex'>
                <p class='bold'>Total price :</p>
                <p class='bold'>$${total}</p>
            </div>
    `;

  const removes = document.getElementsByClassName("remove");
  // remove the selected item from the DOM and update the total price
  for (let remove of removes) {
    remove.addEventListener("click", function () {
      const first = remove.closest(".bold");
      const second = first.closest(".order-wrapper");
      second.remove();

      const pricesArr = document.getElementsByClassName("prices");
      let newTotalArr = [];

      if (pricesArr.length > 0) {
        for (let priceEl of pricesArr) {
          let priceElValue = priceEl.innerHTML;
          priceElValue = Number(priceElValue.replace("$", ""));
          newTotalArr.push(priceElValue);

          const newTotal = newTotalArr.reduce((accumulator, currentelement) => {
            return accumulator + currentelement;
          });

          totalEl.innerHTML = `
                        <div class='flex'>
                            <p class='bold'>Total price :</p>
                            <p class='bold'>$${newTotal}</p>
                        </div>`;
        }
      } else {
        totalEl.innerHTML = `
                        <div class='flex'>
                            <p class='bold'>Total price :</p>
                            <p class='bold'>$0</p>
                        </div>`;
        totalPrices = [];
        orderSection.style.display = "none";
      }
    });
  }
}

// Displaying the modal container
orderBtn.addEventListener("click", () => {
  modalContainer.style.display = "inline";
});

// Order confirmation
document.addEventListener("submit", (e) => {
  e.preventDefault();
  const paymentForm = document.getElementById("payment-form");
  const paymentFormData = new FormData(paymentForm);
  const name = paymentFormData.get("clientName");
  modalContainer.style.display = "none";
  orderSection.innerHTML = `
        <div class='confirmation'>
            <p>Thanks, ${name}! Your order is on its way!</p>
        </div>
    `;
});
