let basket = ['Garten Salat', 'Salat Thunfisch', 'Lachs Gegrillt', 'Dorade Gefüllt', 'Ratatouille', 'Aubergine Gebacken'];
let priceList = ['08.00', '12.00', '24.00', '26.00', '14.00', '16.00'];
let amount = ['1', '1', '1', '1', '1', '1'];
let shoppingCart = [];


document.addEventListener('DOMContentLoaded', function() {
    loadCartFromLocalStorage();
    renderBasket(); 
    renderMobileBasket(); 
});



function openDialog() {
    document.getElementById('dialog').classList.remove('d-none');
    document.body.style.overflowY = 'hidden';
}


function closeDialog() {
    document.getElementById('dialog').classList.add('d-none');
    document.body.style.overflowY = 'auto';
}


function syncMobileCart() {
    const mobileCartList = document.querySelector('.right-content-mobile .list');
    if (mobileCartList) {
        mobileCartList.innerHTML = ''; 
        shoppingCart.forEach(item => {
            mobileCartList.innerHTML += generateBasketHTML(item); 
        });
    }
}


function updateMobileTotal() {
    let subtotal = 0;
    shoppingCart.forEach(item => {
        subtotal += parseFloat(item.price) * parseInt(item.quantity);
    });
    let shippingCost = 2.00; // Lieferkosten
    let total = subtotal + shippingCost;

    document.getElementById('mobileSubtotal').textContent = subtotal.toFixed(2).replace('.', ',') + " €";
    document.getElementById('mobileTotal').textContent = total.toFixed(2).replace('.', ',') + " €";
}



function addToBasket(index) {
    if (index >= 0 && index < basket.length) {
        const selectedItem = {
            name: basket[index],
            price: priceList[index],
            quantity: 1 
        };
        const existingItem = shoppingCart.find(item => item.name === selectedItem.name);
        if (existingItem) {
            existingItem.quantity += 1; 
        } else {
            shoppingCart.push(selectedItem);
        }

        renderBasket();
        updateTotal();
        saveCartToLocalStorage();
        syncMobileCart();
        renderMobileBasket();
        updateMobileTotal();
    }
};


function generateBasketHTML(item, index) {
        return `
            <div class="basketItem">
                <div class="over">
                    <div class="counter">${item.quantity}x</div>
                    <div class="oName">${item.name}</div>
                </div>
                
                <div class="under">
                    <div class="basketImageBox">
                        <div onclick="addToBasket(${basket.indexOf(item.name)})" class="counterButton">
                            <img src="img/plus32.png">
                        </div>
                        <div onclick="decreaseQuantity(${index})" class="basketImgBoxDelete counterButton">
                            <img src="img/minus.png">
                        </div>
                        <div>
                            <img src="img/edit.png">
                        </div>
                    </div>
                    <div class="basketSinglePrice">
                        <div>${item.price.replace('.', ',')}€</div>
                        <img onclick="totalDeleteFromBasket('${item.name}')" class="trashImg" src="img/trash.png">
                    </div>
                </div>
                
            </div>`;
};

            syncMobileCart();
            updateMobileTotal();


function renderBasket() {
        let container = document.getElementById('list');
        if (shoppingCart.length === 0) {
            container.innerHTML = `
            <img  class="push" src="img/hinzufugen.png">
            <p class='empty-cart-message'>Der Warenkorb ist leer.<br> Bitte füge ein leckeres Gericht hinzu, welches wir Dir bringen sollen.</p>            
            `;
        } else {
            container.innerHTML = ''; 
            shoppingCart.forEach((item, index) => {
                container.innerHTML += generateBasketHTML(item, index);
            });
        }
}


function deleteFromBasket(item) {
        let index = shoppingCart.findIndex(product => product.name === item); 
        if (index !== -1) {
            shoppingCart.splice(index, 1); 
            renderBasket();
            updateTotal();
            saveCartToLocalStorage();
            syncMobileCart(); 
        }
};


function totalDeleteFromBasket(item) {
        let index = shoppingCart.findIndex(product => product.name === item); 
        if (index !== -1) {
            shoppingCart.splice(index, 1); 
            renderBasket();
            updateTotal();
            saveCartToLocalStorage(); 
            syncMobileCart();
        }
};


function decreaseQuantity(index) {
        if (index >= 0 && index < shoppingCart.length) {
            if (shoppingCart[index].quantity > 1) {
                shoppingCart[index].quantity--; 
            } else {
                shoppingCart.splice(index, 1); 
            }
            renderBasket(); 
            updateTotal(); 
            saveCartToLocalStorage(); 
            syncMobileCart(); 
            renderMobileBasket(); 
            updateMobileTotal(); 
        }
}
    

function renderMobileBasket() {
        console.log('renderMobileBasket aufgerufen');
        console.log('shoppingCart:', shoppingCart);
        let container = document.getElementById('mobileList');
        if (shoppingCart.length === 0) {
            console.log('Warenkorb ist leer');
            container.innerHTML = `

            <img  class="push" src="img/hinzufugen.png">
            <p class='empty-cart-message'>Der Warenkorb ist leer.<br> Bitte füge ein leckeres Gericht hinzu, welches wir Dir bringen sollen.</p>
            
            `;
        } else {
            console.log('Warenkorb hat Artikel');
            container.innerHTML = ''; 
            shoppingCart.forEach((item, index) => {
                container.innerHTML += generateBasketHTML(item, index);
            });
        }
}
    
    
function generateMobileBasketHTML(item, index) {
        return `
            <div class="mobile-basket-item">
                <div class="item-info">
                    <span class="item-name">${item.name}</span>
                    <span class="item-price">${item.price.replace('.', ',')}€</span>
                </div>
                <div class="item-quantity">
                    <button onclick="decreaseQuantity(${index})">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="addToBasket(${index})">+</button>
                </div>
            </div>
        `;
}

    renderMobileBasket();


function updateTotal() {
        let subtotal = 0;
        
        // Berechne die Zwischensumme
        for (let i = 0; i < shoppingCart.length; i++) {
            subtotal += parseFloat(shoppingCart[i].price) * parseInt(shoppingCart[i].quantity);
        }
        // Aktualisiere die Zwischensumme im HTML
        document.getElementById('subtotal').textContent = subtotal.toFixed(2).replace('.', ',') + " €";
        // Berechne die Gesamtsumme (Zwischensumme + Lieferkosten)
        let shippingCost = 2.00; // Lieferkosten
        let total = subtotal + shippingCost;
        // Aktualisiere die Gesamtsumme im HTML
        document.getElementById('total').textContent = total.toFixed(2).replace('.', ',') + " €";

        let endsumme = subtotal;
        document.getElementById('updateCardTotal').innerHTML = "Total: € " + endsumme.toFixed(2).replace('.', ',');
        syncMobileCart();
        updateMobileTotal();
        renderMobileBasket();
};


function done() {
        if (shoppingCart.length === 0) {
            alert("Der Warenkorb ist leer. Bitte fügen Sie Artikel hinzu, bevor Sie eine Bestellung aufgeben.");
            return;
        }
    
        document.getElementById('send').innerHTML = "Bestellung abgeschickt ...";
        alert("Deine Bestellung ist soeben bei uns eingegangen, lehn Dich zurück und lies in der Zeit ein Kochbuch :)")
        localStorage.removeItem('shoppingCart');
        shoppingCart = [];
    
        renderBasket();
        updateTotal();
    
        document.getElementById('cart').style.display = 'none';
    
        setTimeout(function() {
            document.getElementById('send').innerHTML = "Bestellung abschicken";
        }, 2000);
};
    
    
    
function saveCartToLocalStorage() {
        localStorage.setItem('shoppingCart', JSON.stringify(shoppingCart));

        syncMobileCart();
        renderMobileBasket();
};


function loadCartFromLocalStorage() {
        const savedCart = localStorage.getItem('shoppingCart');
        if (savedCart) {
            shoppingCart = JSON.parse(savedCart);
            renderBasket();
            updateTotal(); 
            renderMobileBasket();
        }
        syncMobileCart();
        updateMobileTotal();
};


    loadCartFromLocalStorage();
    syncMobileCart();
    updateMobileTotal();



      





