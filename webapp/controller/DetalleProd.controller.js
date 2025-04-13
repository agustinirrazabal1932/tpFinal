sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast"
], function (Controller,MessageToast) {
	"use strict";

	return Controller.extend("ui5.ShopStarWars.controller.DetalleProd", {
		onInit: function () {
			//recupero el router y el modelo
			this.oRouter = this.getOwnerComponent().getRouter();
			this.oModel = this.getOwnerComponent().getModel();
			//macheo el producto de category con esta vista
			this.oRouter.getRoute("listCategory").attachPatternMatched(this._onProductMatched, this);
			this.oRouter.getRoute("detalleProducto").attachPatternMatched(this._onProductMatched, this);


		},
		//recupera el producto y la categoria y le indica a la vista el productor seleccionado
		_onProductMatched: function (oEvent) {
			this._product = oEvent.getParameter("arguments").product || this._product || "0";
			this._category = oEvent.getParameter("arguments").category || this._category;

			this.getView().bindElement({
				path: "/productosTodos/" + this._product,
				model: "products"
			});
		},
		//para selecionar el objeto producto
		_getProduct: function() {
			let oBindingContext = this.getView().getBindingContext("products");

			if (oBindingContext && this._product) {
				let oProduct = oBindingContext.getObject();
				return oProduct || null;
			} else {
				return "Producto no seleccionado";
			}
		},
		//para cargar el producto en el carrito de compra
		onComprar: function(oEvent){
			let oProducto=this._getProduct(),
				bSeEncontro=false,
				bSeEncontroFav=false,
				oModel = this.getView().getModel("carts"),
            	aCartItems = oModel.getProperty("/carritoCompra") || [],
				aCartFavorito = oModel.getProperty("/carritoGuardar") || [];

			for (let i = 0; i < aCartItems.length; i++) {
				let oProductoArray = aCartItems[i];
				if (oProductoArray.name === oProducto.name) {
					bSeEncontro=true;
					if(oProductoArray.quantity < oProducto.stock){
						oProductoArray.quantity += 1;
					}else{
						MessageToast.show("No se puede agregar mas producto porque no hay stock suficiente")
					}
					break;
				}
			}
			//si no se encuntra en el carrito verifica que no este en favorito asi lo agrega y si no le suma uno en cantidad
			if(!bSeEncontro){

				for (let i = 0; i < aCartFavorito.length; i++) {
					let oProductoArray = aCartFavorito[i];
					if (oProductoArray.name === oProducto.name) {
						bSeEncontroFav=true;
						if(oProductoArray.quantity < oProducto.stock){
							oProductoArray.quantity += 1;
						}else{
							MessageToast.show("No se puede agregar mas producto porque no hay stock suficiente")
						}
						break;
					}
				}
				if(!bSeEncontroFav){
					var oProduct = Object.assign({ name: oProducto.name, image:oProducto.image , price: oProducto.price, quantity: 1 }, oProduct);
					aCartItems.push(oProduct);
					MessageToast.show("Se cargo el producto "+[oProducto.name]+" en el carrito");
				}
			}
			//actualizo las listas
			oModel.setProperty("/carritoCompra", aCartItems);
			oModel.setProperty("/carritoGuardar", aCartFavorito);
			this._updateTotal();
		},
		//agregar un producto a favorito
		onFavorito: function(oEvent){
			let oProducto=this._getProduct(),
			 	bSeEncontro=false,
			 	bSeEncontroCarrito=false,
			 	oModel = this.getView().getModel("carts"),
             	aCartItems = oModel.getProperty("/carritoCompra") || [],
			 	aCartFavorito = oModel.getProperty("/carritoGuardar") || [];

			for (let i = 0; i < aCartFavorito.length; i++) {
				let oProductoArray = aCartFavorito[i];
				if (oProductoArray.name === oProducto.name) {
					bSeEncontro=true;
					MessageToast.show("Ya esta cargado en la lista de favorito");
					break;
				}
			}
			//si no se encuentra en la lista de favorito verifica el carrito asi no lo agrega
			if(!bSeEncontro){

				for (let i = 0; i < aCartItems.length; i++) {
					let oProductoArray = aCartItems[i];
					if (oProductoArray.name === oProducto.name) {
						bSeEncontroCarrito=true;
						MessageToast.show("el producto esta cargado en el carrito");
						break;
					}
				}
				if(!bSeEncontroCarrito){
					var oPro = Object.assign({ name: oProducto.name, image:oProducto.image , price: oProducto.price, quantity: 1 }, oPro);
					aCartFavorito.push(oPro);
					MessageToast.show("Se cargo el producto "+[oPro.name]+" a favoritos");
				}
			}
			//actualizo las listas
			oModel.setProperty("/carritoCompra", aCartItems);
			oModel.setProperty("/carritoGuardar", aCartFavorito);
			this._updateTotal();
		},
		//funcion para actualizar el precio total del carrito
		_updateTotal: function() {
            let oModel = this.getView().getModel("carts"),
            	aItems = oModel.getData().carritoCompra,
            	fTotal = aItems.reduce(function(sum, item) {
                return sum + (item.price * item.quantity);
            }, 0);
            oModel.setProperty("/total", fTotal.toFixed(2));
        },
	});
});