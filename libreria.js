
const obtenerCatalogo = async  () => { 
    const res = await fetch("./json/catalogo.json")
    return await res.json()
}

let libros_Libreria = [];


obtenerCatalogo().then(libros_Items =>{
   libros_Items.forEach((item) => {
     let {id, nombre, precio : valor, autor, categoria, img, stock} = item;
     let agregar_Libro = {                //Objeto que agrega propiedad de cantidad. No usada en la base de datos JSON por ser solo necesaria en el carrito de compras.  
       id, nombre, valor, valor, autor, categoria, img, stock, 
       cantidad : 0
     }  
     libros_Libreria.push(agregar_Libro)
   })
})

const run = async () => {
      await obtenerCatalogo();    
      
      let libros_Seleccionados = [];
      let selec_Orden = document.getElementById('Ordenar');
      let b_comprar = document.getElementById("b_comprar");
      let lista_carrito = document.getElementById("lista_carrito");
      let carrito_modal = document.getElementById("carrito_Modal");
      let mensaje = document.getElementById("mensaje_finalcompra");
      const checkboxes = document.querySelectorAll(".checkbox");
      const checkbox_Todo = document.getElementById("checkbox_todos");
      let pagina_actual = 1;
      let resultado_busqueda = true;
      checkboxes.forEach( e =>{ e.indeterminate = true})  


      const stock_carrito = ()=>{
        //Chequea si el carrito tiene items al reiniciarse el navegador 
        let carrito;
        if(JSON.parse(localStorage.getItem('carrito')) == null){
        carrito = [];
        }  else {
        carrito = JSON.parse(localStorage.getItem('carrito'))
        }
        libros_Libreria.forEach(libro_de_libreria =>{
          for(libro_catalogo of carrito){
              if(libro_de_libreria.id == libro_catalogo.id){
                libro_de_libreria.stock = libro_catalogo.stock;
                libro_de_libreria.cantidad = libro_catalogo.cantidad;
              }
          }
        }) 
      }

      const num_Carrito = () => {
        let num_Mostrar = document.getElementById("num_Carrito");
        let compras = JSON.parse(localStorage.getItem("carrito"));
        let total_compras = 0;
        if (compras == null || compras == 0){
            num_Mostrar.innerHTML = ``
        } else{
          for(i of compras){
            total_compras = total_compras + i.cantidad;
          }
          num_Mostrar.innerHTML = `${total_compras}`
        }
      }

      const listar = (catalogo) => {
          let botones_paginas = document.getElementById("paginas");
          botones_paginas.innerHTML = "";
          let items_pagina = 10;
          let n_paginas = Math.ceil(catalogo.length / items_pagina);
          
          
          for(let i=0; i < n_paginas; i++){
            botones_paginacion(i+1, catalogo, items_pagina);           
          }
          
         if (botones_paginacion.length != 0){ 
            const botones_pagina = document.querySelectorAll(".b_paginas");
            botones_pagina.forEach( boton => {
              boton.addEventListener("click", (e)=>{
                botones_pagina.forEach( e => {e.style.backgroundColor = '#e5e5e5'})
                boton.style.backgroundColor = '#d9caca';
                pagina_actual = boton.id;
                mostrar_pagina(catalogo,boton.id,items_pagina)
              })
            })
            
        }     

          mostrar_pagina(catalogo,pagina_actual,items_pagina);       
          num_Carrito();       
      }

      const mostrar_pagina = (catalogo,pagina,items_pagina) =>{
        let elemento = document.getElementById("libros");
        pagina--;
       //Numero indica la cantidad de items por pagina
        let inicio = items_pagina * pagina; 
        let final = inicio + items_pagina;
        elemento.innerHTML = "";
        let array_pagina = catalogo.slice(inicio,final)
        array_pagina.forEach( libro => {
           
          if (libro.stock > 0){
            elemento.innerHTML += `
                            <div class="item_Individual" ${libro.nombre}  id=${libro.id} >
                              <img src="img/${libro.img}" alt="${libro.nombre}">
                              <ul>  
                                <li><p> ${libro.nombre}</p></li>
                                <li><p>  ${libro.autor}</p></li>
                            
                                <li><b> ${libro.stock > 1 ? libro.stock + " libros disponibles": "1 libro disponible" } </b></li> 
                                <li><b> $ ${libro.valor}</b></li>              
                              </ul>
                              <br>                         
                              <label for="quantity">Cantidad:</label>
                              <input type="number" id="cantidad${libro.id}" name="quantity" value="1" min="1" max=${libro.stock}>
                              <br>
                              <br>
                              <button type="button" class="b_comprar lined thin">Agregar al carrito</button>
                            </div>                      `           
          } else {             
              elemento.innerHTML += `
                            <div class="item_Individual" ${libro.nombre}  id=${libro.id} >
                              <img src="img/${libro.img}" alt="${libro.nombre}">
                              <ul>  
                                <li><p> ${libro.nombre}</p></li>
                                <li><p> ${libro.autor}</p></li>
                                <br>
                                <li><b> $ ${libro.valor}</b></li>                
                              </ul>                               
                              <br>
                              <b> Libro sin Stock</b>
                              <br>                                
                              </div>                      `  
          }
        
      });
        botones_agregar();
      }
      
      const buscar = ()=>{
        const libro_ingresado = document.getElementById("buscador");       
        let libros_buscados = [];
        libros_Libreria.forEach(libro => {
          if (libro_ingresado.value.length > 3 ){
              let libro_a_buscar = libro.nombre.toLowerCase();
              let autor_a_buscar = libro.autor.toLowerCase();
              let libro_buscado = libro_ingresado.value.toLowerCase();            
              if (autor_a_buscar.includes(libro_buscado) || libro_a_buscar.includes(libro_buscado)){ 
                libros_buscados.push(libro);                 
              }           
        }
        })   
        if (libros_buscados == 0){
          libro_ingresado.value = null;
          resultado_busqueda = false;
          return libros_Libreria;
        }     
        return libros_buscados;         
     
      }

      const botones_paginacion = (pagina, catalogo, items_paginas) =>{
        let botones_paginas = document.getElementById("paginas");
        if (catalogo.length > items_paginas){
          if (pagina == 1){
            botones_paginas.innerHTML += `<button id="${pagina}" type="button" class="b_paginas" style="background-color:#d9caca;">${pagina}</button>`     
          }else {
          botones_paginas.innerHTML += `<button id="${pagina}" type="button" class="b_paginas" style="background-color:#e5e5e5;">${pagina}</button>`
        }    
        }               
      }
      const listar_carrito = () => {   
        let elemento = document.getElementById("lista_carrito");
        let catalogo = JSON.parse(localStorage.getItem("carrito"));
        const carrito_bottom = document.getElementById("carrito_bottom")
      // let valor_Libros;
        if (catalogo == null || catalogo.length == 0){  
          elemento.innerHTML = `<br><p>...esta vacio</p> `;
          carrito_bottom.innerHTML = ` `;  
          b_comprar.style.display ="none";
        } else {         
              b_comprar.style.display ="block";
              catalogo.forEach( libro => {          
               let valor_maximo = libro.stock - libro.cantidad;
               if (valor_maximo < 1){valor_maximo = 1}   
              elemento.innerHTML += `
                                  <div class=${libro.nombre} id=${libro.id} >                     
                                      <li><p>${libro.nombre} - ${libro.autor} - <b> ${libro.cantidad} - ($${libro.valor}) $${libro.valor * libro.cantidad} </b></p></li>
                                      <label for="quantity">Cantidad:</label>
                                      <input type="number" id="cantidad_Carrito"${libro.id} name="quantity" class="b_Sumar" value=${libro.cantidad} min="1" max=${libro.stock + libro.cantidad}>                                                                               
                                      <button type="button" class="b_Vaciar">Borrar elemento</button>
                                      <br>
                                      <br>                                
                                    </div>
                `
            });     
            carrito_bottom.innerHTML = `<br><h3>Total: ${gasto_Total(catalogo)}</h3>  `;     
            botones_vaciar();       
            botones_sumar();                          
        }
      }

      /////////////////////////
      const botones_sumar = () => {
          const botones = document.querySelectorAll(".b_Sumar"); 
          botones.forEach(boton => {	
                let boton_valor_anterior = parseInt(boton.value,10);
                console.log(boton_valor_anterior) 
                boton.addEventListener("change", e =>{                 
                let carrito = JSON.parse(localStorage.getItem('carrito'));                  
                let l_Click = e.target.parentElement.id;
                let libro = libros_Libreria.find( i => i.id == l_Click);
               
                for (i of carrito){
                  if(i.id == l_Click){
                    let stock = i.stock + i.cantidad;
                    console.log("s"+stock)
                    if(parseInt(e.target.value,10) > stock){
                      Swal.fire({
                        position: 'center',
                        title: `No hay suficiente Stock`,
                        showConfirmButton: false,  
                        timer: 3000      
                      })
                    }else{ 
                      i.cantidad = parseInt(e.target.value,10);                       
                      i.stock = stock - i.cantidad ;  
                      libro.cantidad = parseInt(e.target.value,10);                       
                      libro.stock = stock - i.cantidad ;  
                      console.log(libro)   
                    }                                       
                  }
                }       
                localStorage.setItem('carrito', JSON.stringify(carrito));              
                let listado = document.getElementById("lista_carrito");           
                listado.innerHTML = ` `;
               // console.log(libros_Libreria)
                listar_carrito();
                num_Carrito();  

                orden_Intems();
                

              });
            });
      };

      const ordenar = (array, opc) => {      
            if (opc === "nombre"){
                  return array.sort((a,b) => { //sigue devolviendo un objeto
                                  if (a.nombre > b.nombre){
                                    return 1;
                                  } 
                                  if (a.nombre < b.nombre ){
                                    return -1;  
                                  }
                                  return 0;
                                });       
              }        
            if (opc === "autor"){
                return  array.sort((a,b) => {
                                if (a.autor > b.autor){
                                  return 1;
                                } 
                                if (a.autor < b.autor ){
                                  return -1;  
                                }
                                return 0;
                              });          
            }
            if (opc === "menor"){
              return  array.sort((a,b) => {
                              if (a.valor > b.valor){
                                return 1;
                              } 
                              if (a.valor < b.valor ){
                                return -1;  
                              }
                              return 0;
                            });        
          } 

          if (opc === "mayor"){
            return  array.sort((a,b) => {
                            if (a.valor < b.valor){
                              return 1;
                            } 
                            if (a.valor > b.valor ){
                              return -1;  
                            }
                            return 0;
                          });     
        } 
      }

      const pagar = (pago, gasto_Total) => { 
        let vuelto =0;
        if (pago < gasto_Total){
            Swal.fire({
              position: 'center',
              title: `Debe introducir un valor mayor o igual a ${gasto_Total}</p>`,
              showConfirmButton: false,  
              timer: 3000      
            })
            return false;
        } else if (isNaN(pago)){
            Swal.fire({
              position: 'center',
              title: `Debe introducir un numero`,
              showConfirmButton: false,  
              timer: 3000         
            })
          return false;
        } else {
              meshMove_fast(2);  
              meshMove(1,0);
              vuelto = pago - gasto_Total;
              Swal.fire({
                position: 'center',
                title: `<p>Felicitaciones ha realizado su compra con exito, <h4>el vuelto es $${vuelto.toFixed(2)}</h4></p>`,
                showConfirmButton: false,
                timer: 3000,               
              })
          return true;
        }
      }

      const gasto_Total = (carrito) =>{
        let gasto_Total = 0;
        for (let item of carrito){    
            gasto_Total += item.valor * item.cantidad;
          }
        return gasto_Total;    
      }

      const Iva = (total) => (total * 21) / 100;

      const botones_agregar = () => {
        let agregado = document.getElementById("agregado_Modal");
        let close = document.getElementById("agregado_Close");
        let item = document.getElementById("agregado_item");  
        const botones = document.querySelectorAll(".b_comprar");
        botones.forEach(boton => {	
                  boton.addEventListener("click", e =>{
                   carrito = JSON.parse(localStorage.getItem('carrito'));  
                   if(JSON.parse(localStorage.getItem('carrito')) == null){
                    carrito = [];
                   }  else {
                    carrito = JSON.parse(localStorage.getItem('carrito'))
                   }     
                  let libro;
                  let l_Click = e.target.parentElement.id;
                  let cantidad_Comprada = document.getElementById("cantidad" + l_Click); 
                  meshMove_fast(2);      
                  libro = libros_Libreria.find( i => i.id == l_Click);
               //---------------------
                  if(cantidad_Comprada.value > libro.stock){
                    Swal.fire({
                      position: 'bottom-end',
                      title: `No hay Stock suficiente`,
                      showConfirmButton: false,   
                      timer: 2000,
                      showClass: { 
                        popup: 'animate__animated animate__backInUp'
                      }             
                    })  
                
                  } else{
                 
                        Swal.fire({
                          position: 'bottom-end',
                          title: `Usted ha agregado ${cantidad_Comprada.value} ${(cantidad_Comprada.value == 1 ? "libro" : "libros")} a su carrito de compras`,
                          showConfirmButton: false,   
                          timer: 2000,
                          showClass: { 
                            popup: 'animate__animated animate__backInUp'
                          }             
                        })         
                        let libro_Index = carrito.findIndex( e => e.id == libro.id);   
                        
                        if(libro_Index >= 0){                
                          carrito[libro_Index].cantidad += (parseInt(cantidad_Comprada.value,10));   
                          carrito[libro_Index].stock -= cantidad_Comprada.value; 
                          libro.cantidad += (parseInt(cantidad_Comprada.value,10));
                          libro.stock -= cantidad_Comprada.value;
                        
                          }  else {
                            libro.cantidad =  (parseInt(cantidad_Comprada.value,10));
                            libro.stock -= cantidad_Comprada.value;                       
                            carrito.push(libro);                                      
                          }
                      //  console.log(parseInt(cantidad_Comprada.value))
                        localStorage.setItem("carrito", JSON.stringify(carrito));
                        num_Carrito();                  
                        carrito = [];                        
                        orden_Intems();
                        close.addEventListener("click", ()=>{
                            agregado.style.display = "none";
                            lista_carrito.innerHTML = ` `;
                      } );  
            }     
          });
        });       
      };

      const actualiza_stock =(libro) =>{ //actualiza el stock del catalogo
            for(l of libros_Libreria){
              if (l.id == libro.id){
                l.stock = libro.stock + libro.cantidad;
                l.cantidad = 0; 
              }
            } 
      }

      const botones_vaciar = () => {

        const botones = document.querySelectorAll(".b_Vaciar");  
          botones.forEach(boton => {	
          boton.addEventListener("click", e =>{
            let carrito = JSON.parse(localStorage.getItem('carrito'));       
            let libro;
            let l_Click = e.target.parentElement.id;  
            carrito.forEach(l =>{
              if (l.id == l_Click){
                libro = l;
              }
            }) 
            let libro_index = carrito.indexOf(libro);
            console.log(libro_index)
            actualiza_stock(libro);
            
            carrito.splice(libro_index,1);       
            localStorage.setItem('carrito', JSON.stringify(carrito));
            orden_Intems();
            let listado = document.getElementById("lista_carrito");        
            listado.innerHTML = ` `;            
            listar_carrito();
            num_Carrito();         
            });
          });
      };
      
      const organiza_busqueda = () => {
        const b_buscador = document.getElementById("b_buscador");
          const libro_ingresado = document.getElementById("buscador");
          
          b_buscador.addEventListener("click",()=>{     
           if(libro_ingresado.value.length != 0){
              let resultado_busqueda = buscar();                
              if (resultado_busqueda.length != libros_Libreria.length){
                pagina_actual = 1;
                funcion_Ordenar(selec_Orden, resultado_busqueda); 
               
                checkboxes.forEach(e => {
                  e.indeterminate =false;
                  e.checked = false
                })
                checkbox_Todo.checked = false;
              }  else{
                    Swal.fire({
                    position: 'center',
                    title: `Resultado no encontrado`,
                    showConfirmButton: false,   
                    timer: 2000,
                    showClass: { 
                      popup: 'animate__animated animate__backInUp'
                    } }) 
                    
              }
            }                       
          });        
      }


      const orden_Intems = () => {
        let chequea_checkbox = 0;
        checkboxes.forEach( e =>{
         if(e.checked == false){ chequea_checkbox++}  
        })  
       
        if (checkbox_Todo.checked == false && chequea_checkbox ==4){
      //    pagina_actual = 1;
         
          funcion_Ordenar(selec_Orden, buscar())  
         
        } else {
       //   pagina_actual = 1;
          organiza_busqueda();
                                                
          selec_Orden.addEventListener('change', (e) => {
              funcion_Ordenar(selec_Orden, buscar());
          });
    
          orden_checkbox(selec_Orden);
        }
      }

      const funcion_Ordenar = (selec_Orden, array_ordenar) =>{
        let listado = document.getElementById("libros");               
        let o = ordenar(array_ordenar, selec_Orden.value);///
     
        listado.innerHTML = ` `;
        listar(o);
       // botones_agregar();
      }

      const orden_checkbox = (selec_Orden) => {
            const checkboxes = document.querySelectorAll(".checkbox");
            const checkbox_Todo = document.getElementById("checkbox_todos");
            const libro_ingresado = document.getElementById("buscador");
            let checkedCount = 0;
            if (checkbox_Todo.checked){
              libros_Seleccionados = libros_Libreria;
            }
              
        //    libro_ingresado.value = null; //// fijarse puede ser la solucion 
         
         /*   checkboxes.forEach(e => {e.indeterminate = true
                              e.checked = false});*/
            funcion_Ordenar(selec_Orden, libros_Seleccionados);

            checkbox_Todo.addEventListener("click", e =>{
                  pagina_actual = 1;
                  libro_ingresado.value = null;
                  libros_Seleccionados = libros_Libreria;           
                  console.log(libros_Seleccionados)
                  checkbox_Todo.checked = true;
                  checkboxes.forEach(e => {e.indeterminate = true
                      e.checked = false
                  });
                  
                  checkedCount = 0;
                  funcion_Ordenar(selec_Orden, libros_Seleccionados);
            })

            checkboxes.forEach(checkbox => {
                  checkbox.addEventListener("click", e =>{  
                    pagina_actual = 1;
                    libro_ingresado.value = null;
                    libros_Seleccionados = [];                        
                    checkboxes.forEach(e =>{                
                        e.indeterminate = false  
                        checkbox_Todo.checked = false;                            
                        if(e.checked) {
                          checkedCount++; 
                          for (i of libros_Libreria){
                              if(i.categoria === e.value){
                                libros_Seleccionados.push(i);}
                            }           
                          }           
                      });
                  if (checkedCount === checkboxes.length || checkedCount === 0){
                    libro_ingresado.value = null;
                    libros_Seleccionados = libros_Libreria;
                    checkbox_Todo.checked = true;
                    checkboxes.forEach(e => {e.indeterminate = true
                      e.checked = false
                    });
                              
                  }
                  funcion_Ordenar(selec_Orden, libros_Seleccionados);        
                  checkedCount = 0;
                
                  });
            
          });
      }

    
      const ver_Carrito = () =>{
        let b_carrito = document.getElementById("b_carrito");
        let carrito_modal = document.getElementById("carrito_Modal");
        let close = document.getElementById("carrito_Close");
        b_carrito.addEventListener("click", () =>{   
              meshMove_fast(1);            
              carrito_modal.style.display = "block";     
              listar_carrito();
        });
        b_comprar.addEventListener("click", () =>{
              meshMove(0,1);
              comprar();
              carrito_modal.style.display = "none";
              lista_carrito.innerHTML = ` `;
        });
        close.addEventListener("click", ()=>{     
          meshMove_fast(2);   
          carrito_modal.style.display = "none";
              lista_carrito.innerHTML = ` `;           
        } );
      }

      const comprar = () =>{
        const elemento = document.getElementById("libros");
        const paginas = document.getElementById("paginas");
        let gastos;
        let iva ;
        let total_Iva;
        let carrito = JSON.parse(localStorage.getItem("carrito"));
        let mostrar_Compra = document.getElementById("valor_compra");
        let valor_pago = document.getElementById("valor_pago");
        let b_pagar = document.getElementById("b_pagar");
        let close = document.getElementById("compra_Close");
        let comprar_modal = document.getElementById("comprar_Modal");
        valor_pago.value = null;  
        comprar_modal.style.display = "block";
        if(carrito.length == 0 ){
            mostrar_Compra.innerHTML = ` <p>Su carrito esta vacio</p>`; 
          } else {  
            gastos = gasto_Total(carrito);
            iva = Iva(gastos);
            total_Iva = gastos + iva;
            elemento.style.display = "none"
            paginas.style.display = "none"
            mostrar_Compra.innerHTML = ` <p>El valor a pagar es $${gastos} + $${iva} (IVA) = <h2>$${total_Iva}</h2><br></p>`; 
        }
        
        b_pagar.addEventListener("click", ()=>{
              
              if(pagar(valor_pago.value,total_Iva)){               
                console.log(pagar(valor_pago.value,total_Iva))
                lista_carrito.innerHTML = ` `;
                comprar_modal.style.display = "none";
                elemento.style.display = "flex"
                paginas.style.display = "flex"
                localStorage.clear();  
                num_Carrito();
              }       
        })

        close.addEventListener("click", ()=>{  
          meshMove_fast(2);  
          meshMove(1.2,0);
          elemento.style.display = "flex"
          paginas.style.display = "flex"
          comprar_modal.style.display = "none";
          valor_pago.value ="";
          lista_carrito.innerHTML = ` `;  
          mensaje.innerHTML = ` `;                      
        } );
      }
      

       stock_carrito();      
       orden_Intems(); 
       ver_Carrito();
      
}

run();




