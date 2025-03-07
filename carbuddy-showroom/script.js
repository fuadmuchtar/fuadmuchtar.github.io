console.log('script loaded')

// =================== Cart Logic ====================
let cart = [];
const cartCount = document.getElementById("cartCount"); // Cart count badge

// Fungsi untuk simpan di local storage
function saveCartToLocalStorage() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Fungsi untuk load cart dari local storage
function loadCartFromLocalStorage() {
  const savedCart = localStorage.getItem("cart");
  if (savedCart) {
    cart = JSON.parse(savedCart);
  }
}

// Load function saat page diload
window.addEventListener("load", () => {
  checkLogin();
  loadCartFromLocalStorage();
  updateCartCount(); // Update cartCount
  displayCart(); // Display item di cart
});

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
  saveCartToLocalStorage(); // Simpan ke local storage
  // alert(`${car.merk} ${car.type} added to cart!`);
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
  saveCartToLocalStorage(); // Simpan ke local storage
}

function updateCartCount() {
  const cartCount = document.getElementById("cartCount");
  cartCount.textContent = cart.length; // Update jumlah item di ikon keranjang
}

function displayCart() {
  const cartItems = document.getElementById("cartItems");
  let html = "";
  if (cart.length === 0) {
    html =
      "<tr><td colspan='8' class='text-center'>Your cart is empty.</td></tr>";
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
              <button class="btn btn-sm btn-outline-secondary" onclick="updateQuantity('${
                item.type
              }', -1)">-</button>
              <span class="mx-2">${item.quantity}</span>
              <button class="btn btn-sm btn-outline-secondary" onclick="updateQuantity('${
                item.type
              }', 1)">+</button>
            </td>
            <td>${formatRupiah(totalPrice)}</td>
            <td>
              <button class="btn btn-danger btn-sm" onclick="removeFromCart('${
                item.type
              }')">
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

// ============== Function Fitur Test Drive ==================
function showTestDriveModal(videoId) {
  const youtubeVideo = document.getElementById("youtubeVideo");
  youtubeVideo.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`; // Set video URL

  // Tampilkan modal
  new bootstrap.Modal(document.getElementById("testDriveModal")).show();
}

// Function untuk stop YouTube video
function stopYouTubeVideo() {
  const youtubeVideo = document.getElementById("youtubeVideo");
  youtubeVideo.src = ""; // Menghentikan video dengan mengosongkan src
}

// Event listener untuk modal saat ditutup
document
  .getElementById("testDriveModal")
  .addEventListener("hidden.bs.modal", () => {
    stopYouTubeVideo(); // Panggil fungsi untuk menghentikan video
  });
// ===========================================================

// =================== Generate Object Cars ====================
let carsContent = document.getElementById("cars");

function dataContent() {
  let html = "";

  for (let i = 0; i < carsArray.length; i++) {
    let harga = formatRupiah(carsArray[i].price);
    html += `
        <div class="col">
          <div class="card h-100 shadow card-hover-effect">
            <img src="${carsArray[i].img}" class="card-img-top" alt="">
            <div class="card-body">
              <h5 class="card-title">${carsArray[i].merk} ${carsArray[i].type} ${carsArray[i].year}</h5>
              <p class="card-text">This is a longer card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
              <h5 style="color:black;margin-bottom:1em;">${harga}</h5>
              <a href="#" class="btn btn-warning test-drive" data-video-id="${carsArray[i].videoId}">
                <i class="bi bi-fast-forward-circle"></i> Preview
              </a>
              <a href="#" class="btn btn-success add-to-cart" data-index="${i}">
                <i class="bi bi-cart-plus"></i> Add to Cart
              </a>
            </div>
          </div>
        </div>
      `;
  }

  carsContent.innerHTML = html;
  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    },
  });

  // Menambahkan Eventlistener untuk tombol Test Drive
  document.querySelectorAll(".test-drive").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      const videoId = event.target.getAttribute("data-video-id");
      showTestDriveModal(videoId); // Tampilkan modal dengan video YouTube
    });
  });

  // Menambahkan tombol Eventlistener "Add to Cart"
  document.querySelectorAll(".add-to-cart").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      const index = event.target.getAttribute("data-index");
      addToCart(carsArray[index]); // Tambahkan mobil ke keranjang
      Toast.fire({
        icon: "success",
        title: `${carsArray[index].merk} ${carsArray[index].type} ${carsArray[index].year} added to cart!`,
      });
    });
  });
}

dataContent();
// ===========================================================

// ================= Function Pembantu =====================

// Function Number to Currency Format
function formatRupiah(angka) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(angka);
}
// ===============================================================

// ================== Function Display Cart ======================
function displayCart() {
  const cartItems = document.getElementById("cartItems");
  let html = "";
  if (cart.length === 0) {
    html =
      "<tr><td colspan='8' class='text-center'>Your cart is empty.</td></tr>";
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
              <button class="btn btn-sm btn-outline-secondary" onclick="updateQuantity('${
                item.type
              }', -1)">-</button>
              <span class="mx-2">${item.quantity}</span>
              <button class="btn btn-sm btn-outline-secondary" onclick="updateQuantity('${
                item.type
              }', 1)">+</button>
            </td>
            <td>${formatRupiah(totalPrice)}</td>
            <td>
              <button class="btn btn-danger btn-sm" onclick="removeFromCart('${
                item.type
              }')">
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
  Swal.fire({
    title: "Delete Confirmation",
    text: "Are you sure you want to delete this item?",
    icon: "question",
    showCancelButton: true,
    // confirmButtonColor: "#3085d6",
    confirmButtonColor: "#d33",
    // cancelButtonColor: "#d33",
    confirmButtonText: "Confirm"
  }).then((result) => {
    if (result.isConfirmed) {
      isLoggedIn = false;
      localStorage.removeItem("isLoggedIn"); // Hapus status login dari local storage
      Swal.fire({
        title: "Item deleted!",
        // text: "Your file has been deleted.",
        icon: "success"
      });
    
      const itemIndex = cart.findIndex((item) => item.type === type);
  if (itemIndex === -1) return; // Jika item tidak ditemukan, keluar

  cart.splice(itemIndex, 1); // Hapus item dari keranjang
  updateCartCount(); // Update jumlah item di ikon keranjang
  displayCart(); // Refresh tampilan tabel
  saveCartToLocalStorage(); // Simpan ke local storage
  // alert("Item removed from cart!");

      // location.reload()
      // window.location.href = "index.html"; // Ganti dengan URL yang sesuai
    }
  });
}

// Menambahkan Eventlistener saat klik ikon cart
document.getElementById("cartIcon").addEventListener("click", (event) => {
  event.preventDefault();
  displayCart();
  new bootstrap.Modal(document.getElementById("cartModal")).show();
});
// ===============================================================

// =================== Display Checkout ==========================
// Function to show checkout modal
function showCheckoutModal() {
  const checkoutContent = document.getElementById("checkoutContent");

  if (!isLoggedIn) {
    // Tampilkan pesan untuk login terlebih dahulu
    checkoutContent.innerHTML = `
        <div class="text-center">
          <h5>Please login to proceed with checkout.</h5>
          <button class="btn btn-primary" onclick="showLoginModal()">Login</button>
        </div>
        `;
  } else {
    // Tampilkan QRIS dan informasi pembayaran
    const total = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    checkoutContent.innerHTML = `
        <div class="row">
          <div class="col-md-6">
            <h5>Order Summary</h5>
            <table class="table table-striped">
              <thead>
                <tr>
                  <th>Merk</th>
                  <th>Type</th>
                  <th>Quantity</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody id="checkoutItems">
                <!-- Items will be dynamically inserted here -->
              </tbody>
            </table>
            <h5>Total: <span id="checkoutTotal">${formatRupiah(
              total
            )}</span></h5>
          </div>
          <div class="col-md-6 text-center">
            <h5>Scan QRIS to Pay</h5>
            <img src="assets/sample-qr-code.webp" alt="QRIS Code" id="qrisImage" class="img-fluid mb-3">
            <p>Or use this payment code: <strong id="paymentCode">DUMMY1234567890</strong></p>
          </div>
        </div>
        `;

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

    // Tampilkan tombol Payment
    document.getElementById("paymentButton").style.display = "block";
  }

  // Tampilkan modal
  new bootstrap.Modal(document.getElementById("checkoutModal")).show();
}

// Menambahkan Eventlistener untuk tombol Payment
document.getElementById("paymentButton").addEventListener("click", () => {
  confirmPayment(); // Panggil fungsi confirmPayment
});
// ===============================================================

// ================= Function Confirm Payment ====================
function confirmPayment() {
  // Kosongkan keranjang
  cart = [];

  // Update jumlah item di ikon keranjang
  updateCartCount();

  // Refresh tampilan keranjang di modal cart
  displayCart();

  // Hapus data keranjang dari local storage
  localStorage.removeItem("cart");

  // Tutup modal checkout
  const checkoutModal = bootstrap.Modal.getInstance(
    document.getElementById("checkoutModal")
  );
  if (checkoutModal) {
    checkoutModal.hide(); // Tutup modal checkout
  }

  // Tutup modal cart (jika masih terbuka)
  const cartModal = bootstrap.Modal.getInstance(
    document.getElementById("cartModal")
  );
  if (cartModal) {
    cartModal.hide(); // Tutup modal cart
  }

  // Hapus overlay secara manual (opsional)
  const backdrops = document.querySelectorAll(".modal-backdrop");
  backdrops.forEach((backdrop) => {
    backdrop.remove(); // Hapus overlay
  });

  Swal.fire({
    title: "Payment confirmed!",
    text: "Thank you for your purchase.",
    icon: "success"
  });
}
// ===============================================================

// Menambahkan Eventlistener ke tombol checkout dalam cart
document
  .querySelector("#cartModal .btn-primary")
  .addEventListener("click", () => {
    const cartModal = bootstrap.Modal.getInstance(
      document.getElementById("cartModal")
    );
    if (cartModal) {
      cartModal.hide(); // Tutup modal cart
    }
    showCheckoutModal(); // Tampilkan modal checkout
  });
// ===============================================================

// =================== Function Fitur Login ======================
let isLoggedIn = false; // Status login

// Function to handle login
function login(email, password) {
  // event.preventDefault()
  // Contoh validasi sederhana
  if (email === "coba@gmail.com" && password === "123") {
    isLoggedIn = true;
    localStorage.setItem("isLoggedIn", "true"); // Simpan status login di local storage
    Swal.fire({
      title: "Login Successful!",
      text: "Welcome!",
      icon: "success"
    });

    return true;
  } else {
    alert("Invalid email or password.");
    return false;
  }
}

// Function to handle logout
function logout() {
  console.log('logot')
  Swal.fire({
    title: "Logout Confirmation",
    text: "Are you sure you want to do logout?",
    // icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    // cancelButtonColor: "#d33",
    confirmButtonText: "Confirm"
  }).then((result) => {
    if (result.isConfirmed) {
      isLoggedIn = false;
      localStorage.removeItem("isLoggedIn"); // Hapus status login dari local storage
      Swal.fire({
        title: "Logged Out!",
        // text: "Your file has been deleted.",
        icon: "success"
      });
    checkLogin();

      // location.reload()
      // window.location.href = "index.html"; // Ganti dengan URL yang sesuai
    }
  });

  // Sembunyikan tombol Logout
  // document.getElementById("loginLogoutButton").style.display = "none";

  // Redirect ke halaman home atau login
}

// Function to check login status
function checkLogin() {
  const loggedIn = localStorage.getItem("isLoggedIn");
  if (loggedIn === "true") {
    isLoggedIn = true;
    document.getElementById("loginLogoutButton").innerHTML = "Logout";
    return true;
    // Tampilkan tombol Logout
    // document.getElementById("loginLogoutButton").style.display = "inline-block";
  }
  document.getElementById("loginLogoutButton").innerHTML = "Sign Up/Login";

  return false;
}

// Menambahkan Eventlistener untuk tombol Logout
document.getElementById("loginLogoutButton").addEventListener("click", () => {
  const loggedIn = checkLogin();
  if (loggedIn) {
    logout();
  } else {
    showLoginModal();
  }
  // logout(); // Panggil fungsi logout
});

// Function to show checkout modal
function showCheckoutModal() {
  const checkoutContent = document.getElementById("checkoutContent");
  const buttonPayment = document.getElementById("paymentButton");

  if (!isLoggedIn) {
    // Tampilkan pesan untuk login terlebih dahulu
    checkoutContent.innerHTML = `
      <div class="text-center">
        <h5>Please login to proceed with checkout.</h5>
        <button class="btn btn-primary" onclick="showLoginModal()">Login</button>
      </div>
    `;
    buttonPayment.style.display = "none";
  } else {
    // Tampilkan QRIS dan informasi pembayaran
    const total = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    checkoutContent.innerHTML = `
      <div class="row">
        <div class="col-md-6">
          <h5>Order Summary</h5>
          <table class="table table-striped">
            <thead>
              <tr>
                <th>Merk</th>
                <th>Type</th>
                <th>Quantity</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody id="checkoutItems">
              <!-- Items will be dynamically inserted here -->
            </tbody>
          </table>
          <h5>Total: <span id="checkoutTotal">${formatRupiah(total)}</span></h5>
        </div>
        <div class="col-md-6 text-center">
          <h5>Scan QRIS to Pay</h5>
          <img src="assets/sample-qr-code.webp" alt="QRIS Code" id="qrisImage" class="img-fluid mb-3">
          <p>Or use this payment code: <strong id="paymentCode">DUMMY1234567890</strong></p>
        </div>
      </div>
    `;

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
  }

  // Tampilkan modal
  new bootstrap.Modal(document.getElementById("checkoutModal")).show();
}

// Function to show login modal
function showLoginModal() {
  // Tutup modal checkout
  const checkoutModal = bootstrap.Modal.getInstance(
    document.getElementById("checkoutModal")
  );
  if (checkoutModal) {
    checkoutModal.hide();
  }

  // Tampilkan modal login
  new bootstrap.Modal(document.getElementById("loginModal")).show();
}

// Function to handle checkout
function handleCheckout() {
  if (!isLoggedIn) {
    // Tampilkan modal login jika belum login
    showLoginModal();
  } else {
    // Lanjutkan ke checkout jika sudah login
    showCheckoutModal();
  }
}

// Menambahkan Eventlistener ke tombol checkout dalam cart
document
  .querySelector("#cartModal .btn-primary")
  .addEventListener("click", () => {
    const cartModal = bootstrap.Modal.getInstance(
      document.getElementById("cartModal")
    );
    if (cartModal) {
      cartModal.hide(); // Tutup modal cart
    }
    handleCheckout(); // Panggil fungsi handleCheckout
  });

// Menambahkan Eventlistener untuk form login
document.getElementById("loginForm").addEventListener("submit", (event) => {
  event.preventDefault(); // Mencegah form submit default

  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  if (login(email, password)) {
    // Tutup modal login
    const loginModal = bootstrap.Modal.getInstance(
      document.getElementById("loginModal")
    );
    if (loginModal) {
      loginModal.hide();
    }

    checkLogin();
    // return alert('Login Berhasil')

    // Lanjutkan ke checkout
    // showCheckoutModal();
  }
});
// ===============================================================
