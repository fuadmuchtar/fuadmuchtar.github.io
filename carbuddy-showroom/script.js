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
                <a href="#" class="btn btn-success"><i class="bi bi-cart-plus"></i> Add to Cart</a>
            </div>
        </div>
    </div>
        `;
    // }
  }

  carsContent.innerHTML = html;
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