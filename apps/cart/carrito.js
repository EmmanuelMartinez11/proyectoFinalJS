let carrito = JSON.parse(localStorage.getItem("carritoCompleto")) || []
const verCarrito = document.getElementById("verCarrito")
const modalContainer = document.getElementById("modalContainer")
const cantidadCarrito = document.getElementById("cantidadCarrito")
let botonesFooter = document.querySelectorAll(".botonFooter")




function ponerCarrito() {
    b = 1
    modalContainer.innerHTML = ""
    modalContainer.style.display = "block"
    const modalHeader = document.createElement("div")
   
    //Modal header
    modalHeader.className ="modalHeader"
    modalHeader.innerHTML = `
                            <h1 class="titulo modalHeaderTitulo"> Carrito </h1>
    `
    modalContainer.append(modalHeader);

    const salir = document.createElement("button")
    salir.innerHTML = `
                            <i class="bi bi-x-lg"></i>
    `
    salir.className = "salir"
    salir.addEventListener("click", () => {
        modalContainer.style.display = "none"
        b = 0
    })
    modalHeader.appendChild(salir)

    //Modal main
    const modalMain = document.createElement("div") //esto lo puse para dale una altura al main pero, al hacerlo y tratar de modificar algo dentro del carrito, sube al principio del carrito
    modalMain.className = "modalMain"
    modalContainer.append(modalMain)

    carrito.forEach((producto) => { //crea los objetos dentro del carrito
        let carritoContent = document.createElement("div")
        carritoContent.className = "modalProductos"
        carritoContent.innerHTML = `
                                    <img src="${producto.imagen}" alt="" class="imagenCarrito">
                                    <h3 class="nombreProductoModal">${producto.nombre} <button class="botonCarrito eliminarProducto"><i class="bi bi-trash"></i></button></h3>
                                    <p>Precio por unidad: $${producto.precio}</p>
                                    
                                    <p>
                                    <button class="botonCarrito restar"><i class="bi bi-dash-circle-fill"></i></button>
                                    Cantidad: ${producto.cantidad}
                                    <button class="botonCarrito sumar"><i class="bi bi-plus-circle-fill"></i></button>
                                    </p>
                                    
                                    <p>Total:$${producto.cantidad * producto.precio}</p>
                                    
        `
        modalMain.appendChild(carritoContent)

        //Acciones de los botones de los prodcutos en el carrito
        let restar = carritoContent.querySelector(".restar")
        restar.addEventListener("click", () => {
            if (producto.cantidad !== 1) {
                producto.cantidad--
            }
            guardado()
            ponerCarrito()
        })

        let sumar = carritoContent.querySelector(".sumar")
        sumar.addEventListener("click", () => {
            producto.cantidad++
            guardado()
            ponerCarrito()
        })

        let eliminar = carritoContent.querySelector(".eliminarProducto")
        eliminar.addEventListener("click", () => {
            Toastify({
                text: "Eliminaste "+producto.nombre+" del carrito",
                duration: 4000,
                gravity: 'bottom',
                position: 'right',
                
            }).showToast();
        
            eliminarProducto(producto.id)
            guardado()
            ponerCarrito()
        })
    })
    
    const total = carrito.reduce((acc, el) => acc + el.precio * el.cantidad, 0)

    //Modal footer
    const modalFooter = document.createElement("div")
    modalFooter.className = "modalFooter"
    modalFooter.innerHTML = `
                            <div>Total: $${total}</div>
                            <button class="botonFooter volverTienda">Cerrar carrito</button>
                            <button class="botonFooter eliminarCarrito">Vaciar carrito</button>
                            <button class="botonFooter comprado">Comprar</button>
    `
    modalContainer.appendChild(modalFooter)
    actualizarBotonesFooter()

    //Acciones de los botones del footer del carrito
    let volverTienda = document.querySelector(".volverTienda")
    volverTienda. addEventListener("click", () => {
        modalContainer.style.display = "none"
        b = 0
    })

    let eliminarCarrito = document.querySelector(".eliminarCarrito")
    eliminarCarrito.addEventListener("click", () => {
        if (carrito.length != 0) {
            Swal.fire({
                title: 'Está seguro de vaciar el carrito?',
                text: "Deberá seleccionar todos los productos nuevamente",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Sí, seguro',
                confirmButtonColor: "#3085d6",
                cancelButtonText: 'No, no quiero',
                cancelButtoncolor: "#d33"
            }).then((result) => {
                if (result.isConfirmed) {
                    Swal.fire({
                        title: 'Borrado!',
                        icon: 'success',
                        text: 'Se ha vaciado el carrito',
                    })
                    vaciarCarrito()
                }
            })    
        } else {
            Swal.fire({
                title: 'El carrito está vacio',
                icon: 'error',
                confirmButtonText: 'Volver a la tienda'
            })
        }
    })

    let comprado = document.querySelector(".comprado")
    comprado.addEventListener("click", () => {
        if (carrito.length != 0) {
            b = 0
            Swal.fire({
                title: 'Está seguro de comprar todo el carrito?',
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Sí, seguro',
                confirmButtonColor: "#3085d6",
                cancelButtonText: 'No, seguir comprando',
                cancelButtoncolor: "#d33"
            }).then((result) => {
                if (result.isConfirmed) {
                    Swal.fire({
                        title: 'Muchas gracias por su compra',
                        text: 'Pronto se le enviará un correo con los datos de su compra',
                        icon: 'success',
                        confirmButtonText: 'Genial'
                    })
                    vaciarCarrito()
                }
            })
        } else {
            Swal.fire({
                title: 'El carrito está vacio',
                icon: 'error',
                confirmButtonText: 'Volver a la tienda'
            })
        }    
    })


}
    

verCarrito.addEventListener("click", ponerCarrito)


//Funciones que uso en el carrito
function guardado() {
    localStorage.setItem("carritoCompleto", JSON.stringify(carrito))
}


function carritoContador() {
    cantidadCarrito.style.display = "inline-block"
    let carritoLength = carrito.length
    localStorage.setItem("carritoLength", JSON.stringify(carritoLength))
    cantidadCarrito.innerText = JSON.parse(localStorage.getItem("carritoLength"))
}


function eliminarProducto(id) {
    const foundId = carrito.find((element) => element.id === id)
    carrito = carrito.filter((carritoId) => {
        return carritoId !== foundId
    })
    carritoContador()
    guardado()
    ponerCarrito()
}


function actualizarBotonesFooter() { //función que actualiza los botones del footer para que pueda darles funciones
    botonesFooter = document.querySelectorAll(".botonFooter")
}


function vaciarCarrito() {
    localStorage.clear()
    modalContainer.style.display = "none"
    carrito = []
    carritoContador()
}