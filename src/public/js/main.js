const socket = io();

const productListContainer = document.querySelector('#productList');
const formWebsockets = document.querySelector('#formWebsockets');

// Product Data Template Function
const productData = (data) => {
  if (data.length > 0) {
    const div = document.createElement('div');
    div.className = 'websockets-product-list-container';
    data.forEach((e) => {
      div.innerHTML += `
        <div class="websockets-product">
          <h2>${e.title}</h2> 
          <p>${e.description}</p> 
          <button data-id="${e.id}" class='delete'>Eliminar</button>
        </div>`;
    });

    productListContainer.appendChild(div);

    const btnEliminar = document.querySelectorAll('.delete');
    btnEliminar.forEach((e) => {
      e.addEventListener('click', () => {
        let identificador = e.dataset.id;
        socket.emit('client:idProductoaBorrar', identificador);
      });
    });

    return div;
  } else {
    const h2 = document.createElement('h2');
    h2.textContent = 'NO HAY PRODUCTOS';
    productListContainer.appendChild(h2);
  }
};

// Load initial products from DB
socket.on('server:initialProducts', (data) => {
  while (productListContainer.firstChild) {
    productListContainer.firstChild.remove();
  }
  productData(data);
});

// Delete products
socket.on('server:productoBorrado', (data) => {
  while (productListContainer.firstChild) {
    productListContainer.firstChild.remove();
  }
  productData(data);
});

// MANEJO DE DATOS FORM
formWebsockets.addEventListener('submit', (e) => {
  e.preventDefault();

  // console.log(e.target.title);
  let newProductData = {
    title: e.target.title.value,
    description: e.target.description.value.toLowerCase(),
    code: e.target.code.value.toLowerCase(),
    price: Number(e.target.price.value),
    status: Boolean(e.target.status.value),
    stock: Number(e.target.stock.value),
    category: e.target.category.value.toLowerCase(),
    thumbnails: Array(e.target.thumbnails.value),
  };

  socket.emit('client:newproduct', newProductData);

  socket.on('server:newProductAdded', (data) => {
    while (productListContainer.firstChild) {
      productListContainer.firstChild.remove();
    }

    productData(data);
  });
});
