// =================== Cart Logic ====================
let cart = [];
const cartCount = document.getElementById("cartCount"); // Cart count badge

function addToCart(car) {
    // Cek apakah mobil dengan type yang sama sudah ada di keranjang
    const existingItem = cart.find((item) => item.type === car.type);
  
    if (existingItem) {
      // Jika sudah ada, tambahkan quantity-nya
      existingItem.quantity += 1;
    } else {
      // Jika belum ada, tambahkan item baru dengan quantity 1
      cart.push({ ...car, quantity: 1 });
    }
  
    updateCartCount(); // Update jumlah item di ikon keranjang
    alert(`${car.merk} ${car.type} added to cart!`);
}

function updateQuantity(type, change) {
    const itemIndex = cart.findIndex((item) => item.type === type);
    if (itemIndex === -1) return; // Jika item tidak ditemukan, keluar
  
    const item = cart[itemIndex];
    item.quantity += change;
  
    // Jika quantity <= 0, hapus item dari keranjang
    if (item.quantity <= 0) {
      cart.splice(itemIndex, 1);
    }
  
    updateCartCount(); // Update jumlah item di ikon keranjang
    displayCart(); // Refresh tampilan tabel
  }

function updateCartCount() {
    const cartCount = document.getElementById("cartCount");
    cartCount.textContent = cart.length; // Update jumlah item di ikon keranjang
}

function displayCart() {
    const cartItems = document.getElementById("cartItems");
    let html = "";
    if (cart.length === 0) {
      html = "<tr><td colspan='8' class='text-center'>Your cart is empty.</td></tr>";
    } else {
      cart.forEach((item, index) => {
        const totalPrice = item.price * item.quantity;
        html += `
          <tr>
            <th scope="row">${index + 1}</th>
            <td>${item.merk}</td>
            <td>${item.type}</td>
            <td>${item.year}</td>
            <td>${formatRupiah(item.price)}</td>
            <td>
              <button class="btn btn-sm btn-outline-secondary" onclick="updateQuantity('${item.type}', -1)">-</button>
              <span class="mx-2">${item.quantity}</span>
              <button class="btn btn-sm btn-outline-secondary" onclick="updateQuantity('${item.type}', 1)">+</button>
            </td>
            <td>${formatRupiah(totalPrice)}</td>
            <td>
              <button class="btn btn-danger btn-sm" onclick="removeFromCart('${item.type}')">
                <i class="bi bi-trash"></i> Remove
              </button>
            </td>
          </tr>
        `;
      });
    }
    cartItems.innerHTML = html;
  }
// ===========================================================

// =================== Generate Object Cars ====================
let carsContent = document.getElementById("cars");

function dataContent() {
  let html = "";

  // let car = cars.length;
  for (let i = 0; i < carsArray.length; i++) {
    let harga = formatRupiah(carsArray[i].price)
    html += `
    
    <div class="col">
        <div class="card h-100 shadow card-hover-effect">
            <img src="${carsArray[i].img}" class="card-img-top" alt="">
            <div class="card-body">
                <h5 class="card-title">${carsArray[i].merk} ${carsArray[i].type} ${carsArray[i].year}</h5>
                <p class="card-text">This is a longer card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
                <h5 style="color:black;margin-bottom:1em;">${harga}</h5>
                <a href="#" class="btn btn-warning"><i class="bi bi-fast-forward-circle"></i> Test Drive</a>
               <a href="#" class="btn btn-success add-to-cart" data-index="${i}"><i class="bi bi-cart-plus"></i> Add to Cart</a> 
            </div>
        </div>
    </div>
        `;
  }

  carsContent.innerHTML = html;

  // Menambahkan tombol Eventlistener "Add to Cart"
  document.querySelectorAll(".add-to-cart").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      const index = event.target.getAttribute("data-index");
      addToCart(carsArray[index]); // Tambahkan mobil ke keranjang
    });
  });
}

dataContent();
// ===========================================================

// ================= Function Pembantu =====================

// Function Number to Currency Format
function formatRupiah(angka) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(angka);
}
// ===============================================================

// ================== Function Display Cart ======================
function displayCart() {
    const cartItems = document.getElementById("cartItems");
    let html = "";
    if (cart.length === 0) {
      html = "<tr><td colspan='8' class='text-center'>Your cart is empty.</td></tr>";
    } else {
      cart.forEach((item, index) => {
        const totalPrice = item.price * item.quantity;
        html += `
          <tr>
            <th scope="row">${index + 1}</th>
            <td>${item.merk}</td>
            <td>${item.type}</td>
            <td>${item.year}</td>
            <td>${formatRupiah(item.price)}</td>
            <td>
              <button class="btn btn-sm btn-outline-secondary" onclick="updateQuantity('${item.type}', -1)">-</button>
              <span class="mx-2">${item.quantity}</span>
              <button class="btn btn-sm btn-outline-secondary" onclick="updateQuantity('${item.type}', 1)">+</button>
            </td>
            <td>${formatRupiah(totalPrice)}</td>
            <td>
              <button class="btn btn-danger btn-sm" onclick="removeFromCart('${item.type}')">
                <i class="bi bi-trash"></i> Remove
              </button>
            </td>
          </tr>
        `;
      });
    }
    cartItems.innerHTML = html;
}
  
function removeFromCart(type) {
    const itemIndex = cart.findIndex((item) => item.type === type);
    if (itemIndex === -1) return; // Jika item tidak ditemukan, keluar

    cart.splice(itemIndex, 1); // Hapus item dari keranjang
    updateCartCount(); // Update jumlah item di ikon keranjang
    displayCart(); // Refresh tampilan tabel
    alert("Item removed from cart!");
}

// Menambahkan Eventlistener saat klik ikon cart
document.getElementById("cartIcon").addEventListener("click", (event) => {
    event.preventDefault();
    displayCart();
    new bootstrap.Modal(document.getElementById("cartModal")).show();
});
// ===============================================================

// =================== Display Checkout ==========================
function showCheckoutModal() {
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }
  
    // Hitung total harga
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  
    // Tampilkan item di tabel checkout
    const checkoutItems = document.getElementById("checkoutItems");
    let html = "";
    cart.forEach((item) => {
      html += `
        <tr>
          <td>${item.merk}</td>
          <td>${item.type}</td>
          <td>${item.quantity}</td>
          <td>${formatRupiah(item.price)}</td>
        </tr>
      `;
    });
    checkoutItems.innerHTML = html;
  
    // Tampilkan total harga
    document.getElementById("checkoutTotal").textContent = formatRupiah(total);
  
    // Tampilkan QRIS Dummy
    document.getElementById("qrisImage").src = "assets/sample-qr-code.webp";
    document.getElementById("paymentCode").textContent = "DUMMY1234567890";
  
    // Tampilkan modal
    new bootstrap.Modal(document.getElementById("checkoutModal")).show();
}
// ===============================================================

// ================= Function Confirm Payment ====================
function confirmPayment() {
    // Kosongkan keranjang
    cart = [];
  
    // Update jumlah item di ikon keranjang
    updateCartCount();
  
    // Refresh tampilan keranjang di modal cart
    displayCart();
  
    // Tutup modal checkout
    const checkoutModal = bootstrap.Modal.getInstance(document.getElementById("checkoutModal"));
    if (checkoutModal) {
      checkoutModal.hide();
    }
  
    // Tutup modal cart
    const cartModal = bootstrap.Modal.getInstance(document.getElementById("cartModal"));
    if (cartModal) {
      cartModal.hide();
    }
  
    // Tampilkan pesan sukses
    alert("Payment confirmed! Thank you for your purchase.");
}
// ===============================================================

// Menambahkan Eventlistener ke tombol checkout dalam cart
document.querySelector("#cartModal .btn-primary").addEventListener("click", () => {
  const cartModal = bootstrap.Modal.getInstance(document.getElementById("cartModal"));
  if (cartModal) {
    cartModal.hide(); // Tutup modal cart
  }
  showCheckoutModal(); // Tampilkan modal checkout
});