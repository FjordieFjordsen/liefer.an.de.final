let basket = ['Garten Salat', 'Salat Thunfisch', 'Lachs Gegrillt', 'Dorade Gefüllt', 'Ratatouille', 'Aubergine Gebacken'];
let priceList = ['08.00', '12.00', '24.00', '26.00', '14.00', '16.00'];
let amount = ['1', '1', '1', '1', '1', '1'];
let shoppingCart = [];


document.addEventListener('DOMContentLoaded', function() {
    loadCartFromLocalStorage();
    renderBasket(); // für den normalen Warenkorb
    renderMobileBasket(); // für den mobilen Warenkorb
});



function openDialog() {
    document.getElementById('dialog').classList.remove('d-none');
}


function closeDialog() {
    document.getElementById('dialog').classList.add('d-none');
}


function syncMobileCart() {
    const mobileCartList = document.querySelector('.right-content-mobile .list');
    if (mobileCartList) {
        mobileCartList.innerHTML = ''; // Leere den mobilen Warenkorb, bevor neuen Inhalt hinzugefügt wird
        shoppingCart.forEach(item => {
            mobileCartList.innerHTML += generateBasketHTML(item); // Füge die Elemente zum mobilen Warenkorb hinzu
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

    // Aktualisiere die Zwischensumme und die Gesamtsumme im HTML für den mobilen Warenkorb
    document.getElementById('mobileSubtotal').textContent = subtotal.toFixed(2).replace('.', ',') + " €";
    document.getElementById('mobileTotal').textContent = total.toFixed(2).replace('.', ',') + " €";
}


function addToBasket(index) {
    if (index >= 0 && index < basket.length) {
        const selectedItem = {
            name: basket[index],
            price: priceList[index],
            quantity: 1 // Wir fügen immer eine Einheit hinzu, wenn der Plus-Button gedrückt wird
        };
        const existingItem = shoppingCart.find(item => item.name === selectedItem.name);
        if (existingItem) {
            // Das Gericht ist bereits im Warenkorb vorhanden, aktualisiere die Menge
            existingItem.quantity += 1; // Erhöhe die Menge um eins
        } else {
            // Das Gericht ist noch nicht im Warenkorb, füge es hinzu
            shoppingCart.push(selectedItem);
        }

        renderBasket();
        updateTotal();
        saveCartToLocalStorage();
        syncMobileCart();
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

            syncMobileCart();
            updateMobileTotal();
    };


    function renderBasket() {
        let container = document.getElementById('list');
        if (shoppingCart.length === 0) {
            container.innerHTML = `
            <img  class="push" src="img/hinzufugen.png">
            <p class='empty-cart-message'>Der Warenkorb ist leer.<br> Bitte füge ein leckeres Gericht hinzu, welches wir Dir bringen sollen.</p>            
            `;
        } else {
            container.innerHTML = ''; // Leere den Container, bevor neuen Inhalt hinzugefügt wird
            shoppingCart.forEach((item, index) => {
                container.innerHTML += generateBasketHTML(item, index);
            });
        }
    }


    function deleteFromBasket(item) {
        let index = shoppingCart.findIndex(product => product.name === item); // Suchen Sie den Index des Elements im shoppingCart-Array
        if (index !== -1) {
            shoppingCart.splice(index, 1); // Löschen Sie das Element aus dem shoppingCart-Array
            renderBasket();
            updateTotal();
            saveCartToLocalStorage();
            syncMobileCart(); // Aktualisieren Sie den Warenkorb
        }
    };


    function totalDeleteFromBasket(item) {
        let index = shoppingCart.findIndex(product => product.name === item); // Suchen Sie den Index des Elements im shoppingCart-Array
        if (index !== -1) {
            shoppingCart.splice(index, 1); // Löschen Sie das Element aus dem shoppingCart-Array
            renderBasket();
            updateTotal();
            saveCartToLocalStorage(); // Aktualisieren Sie den Warenkorb
            syncMobileCart();
        }
    };


    function decreaseQuantity(index) {
        console.log('Index:', index);
        if (index >= 0 && index < shoppingCart.length) {
            if (shoppingCart[index].quantity > 1) {
                shoppingCart[index].quantity--; // Reduzieren Sie die Menge des Elements im Warenkorb
            } else {
                shoppingCart.splice(index, 1); // Entfernen Sie das Element aus dem Warenkorb, wenn die Menge 0 erreicht
            }
            renderBasket(); // Aktualisieren Sie den normalen Warenkorb
            updateTotal(); // Aktualisieren Sie die Gesamtsumme für den normalen Warenkorb
            saveCartToLocalStorage(); // Speichern Sie den aktualisierten Warenkorb im lokalen Speicher
            syncMobileCart(); // Synchronisieren Sie den mobilen Warenkorb
            renderMobileBasket(); // Aktualisieren Sie den mobilen Warenkorb
            updateMobileTotal(); // Aktualisieren Sie die Gesamtsumme für den mobilen Warenkorb
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
            container.innerHTML = ''; // Leere den Container, bevor neuen Inhalt hinzugefügt wird
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
        renderMobileBasket();
    }


    


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
    
    
    
    // Funktion zum Speichern des Warenkorbs im lokalen Speicher
    function saveCartToLocalStorage() {
        localStorage.setItem('shoppingCart', JSON.stringify(shoppingCart));

        syncMobileCart();
        renderMobileBasket();
    };


    // Funktion zum Laden des Warenkorbs aus dem lokalen Speicher
    function loadCartFromLocalStorage() {
        const savedCart = localStorage.getItem('shoppingCart');
        if (savedCart) {
            shoppingCart = JSON.parse(savedCart);
            renderBasket(); // Aktualisieren Sie den Warenkorb, um die geladenen Elemente anzuzeigen
            updateTotal(); // Aktualisieren Sie die Gesamtsumme basierend auf den geladenen Elementen
            renderMobileBasket();
        }
        syncMobileCart();
        updateMobileTotal();
    };


    // Rufen Sie die loadCartFromLocalStorage-Funktion auf, um den Warenkorb beim Laden der Seite zu laden
    loadCartFromLocalStorage();
    syncMobileCart();
    updateMobileTotal();