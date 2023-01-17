const productoContainer = document.getElementById("productoContainer");
const botones = document.querySelectorAll(".buscador")
let a = 0 //swich para los filtros
let b = 0 //swich agregar productos al carrito con el carrito abierto

async function pedirPosts (){ //función que organiza los productos antes de pintarlos
    const resp = await fetch('./API/stock.json')
    let stock = await resp.json()

    if (a == 0) {
        hacerAlgo(stock)
    } else if (a == 1) {
        stock.sort((a, b) => a.precio - b.precio);  
        hacerAlgo(stock)
    } else if (a == 2) {
        stock.sort((a, b) => b.precio - a.precio); 
        hacerAlgo(stock)
    } else if (a == "perifericos") {
        stock = stock.filter((producto) => producto.tipo.includes("Periférico"))
        hacerAlgo(stock)
    } else if (a == "componentes") {
        stock = stock.filter((producto) => producto.tipo.includes("Componente"))
        hacerAlgo(stock)
    } else {
        hacerAlgo(stock)
    } 
}


botones.forEach(boton => { //filtros
    boton.addEventListener("click", (e) => {
        botones.forEach(boton => boton.classList.remove("active"))
        e.currentTarget.classList.add("active")
        
        if (e.currentTarget.id === "todos") {
            a = 0
            pedirPosts()
        } else if(e.currentTarget.id === "precioMenor") {
            a = 1
            pedirPosts()
        } else if (e.currentTarget.id === "precioMayor") {
            a = 2
            pedirPosts()
        } else if (e.currentTarget.id === "perifericos") {
            a = "perifericos"
            pedirPosts()
        } else if (e.currentTarget.id === "componentes") {
            a = "componentes"
            pedirPosts()
        }
    })
})

function hacerAlgo (stock) { //función que pinta los productos (tiene que invocarse en pedirPost para que funcionen los filtos())
    productoContainer.innerHTML = ""

    stock.forEach(producto => {
        const div = document.createElement("div");
        div.classList.add("productoCard");
        div.innerHTML += `
                        <img src="${producto.imagen}" alt="">
                        <div class="datosProducto">
                            <h3 class="linea">${producto.nombre}</h3>
                            <p class="linea">${producto.descripcion}</p>
                            <p class="linea">${producto.tipo}</p>
                            <p class="linea">$ ${producto.precio}</p>
                        </div>
                        
        `
        productoContainer.appendChild(div)

        const comprar = document.createElement("button")
        comprar.innerText = "Comprar",
        comprar.className = "botonComprar"

        div.append(comprar)

        comprar.addEventListener("click", () => { //boton que pushea a los productos al carrito

            const productoRepetido = carrito.some((repetido) => repetido.id === producto.id)
    
            if (productoRepetido) {
                carrito.map((prod) => {
                    if (prod.id === producto.id) {
                        prod.cantidad++
                    }
                })
            } else {
                carrito.push({
                    id: producto.id,
                    nombre: producto.nombre,
                    tipo: producto.tipo,
                    precio: producto.precio,
                    imagen: producto.imagen,
                    descripcion: producto.descripcion,
                    cantidad: producto.cantidad,
                })
            }
    
            Toastify({
                text: "Haz agregado "+producto.nombre+" del carrito",
                duration: 4000,
                gravity: 'bottom',
                position: 'right',
                
            }).showToast();
            guardado()
            carritoContador()
            if (b === 1) {
                ponerCarrito()
            }
        })
    })
}