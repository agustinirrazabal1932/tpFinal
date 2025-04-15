sap.ui.define([
	"./BaseController",
	"sap/m/MessageToast"
], function (BaseController,MessageToast) {
	"use strict";

	return BaseController.extend("ui5.ShopStarWars.controller.DetalleProd", {
		onInit: function () {
			//recupero el router y el modelo
			this.oRouter = this.getOwnerComponent().getRouter();
			//macheo el producto de category con esta vista
			this.oRouter.getRoute("listCategory").attachPatternMatched(this._onProductMatched, this);
			this.oRouter.getRoute("detalleProducto").attachPatternMatched(this._onProductMatched, this);
			this.oRouter.getRoute("detalleProductoPhone").attachPatternMatched(this._onProductMatched, this);


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
		//para volver al home del phone
		onHomeDetalle: function(){
			this.oRouter.navTo("inicioPhone");
		},
		//para cargar el producto en el carrito de compra
		onComprar: function(oEvent){
			let oProducto=this._getProduct(),
				bSeEncontro=false,
				bSeEncontroFav=false,
				oModel = this.BgetModel("carts"),
				oResourceBundle = this.BgetResourceBundle(),
            	aCartItems = oModel.getProperty("/carritoCompra") || [],
				aCartFavorito = oModel.getProperty("/carritoGuardar") || [];

			for (let i = 0; i < aCartItems.length; i++) {
				let oProductoArray = aCartItems[i];
				if (oProductoArray.name === oProducto.name) {
					bSeEncontro=true;
					if(oProductoArray.quantity < oProducto.stock){
						oProductoArray.quantity += 1;
					}else{
						MessageToast.show(oResourceBundle.getText("productStatusFullStockMsg"));
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
							MessageToast.show(oResourceBundle.getText("productStatusFullStockMsg"))
						}
						break;
					}
				}
				if(!bSeEncontroFav){
					var oProduct = Object.assign({ name: oProducto.name, image:oProducto.image , price: oProducto.price, quantity: 1 }, oProduct);
					aCartItems.push(oProduct);
					MessageToast.show(oResourceBundle.getText("productMsgAddedToCart", [oProducto.name]));
				}
			}
			//actualizo las listas
			oModel.setProperty("/carritoCompra", aCartItems);
			oModel.setProperty("/carritoGuardar", aCartFavorito);
			this.BupdateTotal();
		},
		//agregar un producto a favorito
		onFavorito: function(oEvent){
			let oProducto=this._getProduct(),
			 	bSeEncontro=false,
			 	bSeEncontroCarrito=false,
				oResourceBundle = this.BgetResourceBundle(),
			 	oModel = this.BgetModel("carts"),
             	aCartItems = oModel.getProperty("/carritoCompra") || [],
			 	aCartFavorito = oModel.getProperty("/carritoGuardar") || [];

			for (let i = 0; i < aCartFavorito.length; i++) {
				let oProductoArray = aCartFavorito[i];
				if (oProductoArray.name === oProducto.name) {
					bSeEncontro=true;
					MessageToast.show(oResourceBundle.getText("productFavoritoError"));
					break;
				}
			}
			//si no se encuentra en la lista de favorito verifica el carrito asi no lo agrega
			if(!bSeEncontro){

				for (let i = 0; i < aCartItems.length; i++) {
					let oProductoArray = aCartItems[i];
					if (oProductoArray.name === oProducto.name) {
						bSeEncontroCarrito=true;
						MessageToast.show(oResourceBundle.getText("productFavoritoCart"));
						break;
					}
				}
				if(!bSeEncontroCarrito){
					var oPro = Object.assign({ name: oProducto.name, image:oProducto.image , price: oProducto.price, quantity: 1 }, oPro);
					aCartFavorito.push(oPro);
					MessageToast.show(oResourceBundle.getText("productMsgAddedToFav", [oPro.name]));
				}
			}
			//actualizo las listas
			oModel.setProperty("/carritoCompra", aCartItems);
			oModel.setProperty("/carritoGuardar", aCartFavorito);
			this.BupdateTotal();
		},
	});
});