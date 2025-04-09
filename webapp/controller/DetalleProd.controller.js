sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/mvc/Controller",
	"sap/f/library",
	"sap/m/MessageToast",
], function (JSONModel, Controller, fioriLibrary,MessageToast) {
	"use strict";

	// shortcut for sap.f.LayoutType
	var LayoutType = fioriLibrary.LayoutType;

	return Controller.extend("ui5.ShopStarWars.controller.DetalleProd", {
		onInit: function () {
			var oExitButton = this.getView().byId("exitFullScreenBtn"),
				oEnterButton = this.getView().byId("enterFullScreenBtn");

			this.oRouter = this.getOwnerComponent().getRouter();
			this.oModel = this.getOwnerComponent().getModel();

			//this.oRouter.getRoute("list").attachPatternMatched(this._onProductMatched, this);
			this.oRouter.getRoute("listCategory").attachPatternMatched(this._onProductMatched, this);
			this.oRouter.getRoute("detalleProducto").attachPatternMatched(this._onProductMatched, this);

			// [oExitButton, oEnterButton].forEach(function (oButton) {
			// 	oButton.addEventDelegate({
			// 		onAfterRendering: function () {
			// 			if (this.bFocusFullScreenButton) {
			// 				this.bFocusFullScreenButton = false;
			// 				oButton.focus();
			// 			}
			// 		}.bind(this)
			// 	});
			// }, this);
		},
		// handleItemPress: function (oEvent) {
		// 	var supplierPath = oEvent.getSource().getSelectedItem().getBindingContext("products").getPath(),
		// 		supplier = supplierPath.split("/").slice(-1).pop();

		// 	this.oRouter.navTo("detailDetailDetail", {layout: LayoutType.ThreeColumnsMidExpanded, category: this._category, product: this._product, supplier: supplier});
		// },
		// handleFullScreen: function () {
		// 	this.bFocusFullScreenButton = true;
		// 	//var sNextLayout = this.oModel.getProperty("/actionButtonsInfo/benginColumn/fullScreen");
		// 	this.navigateToView( "detalleProductoGrande");
		// },
		// handleExitFullScreen: function () {
		// 	this.bFocusFullScreenButton = true;
		// 	var sNextLayout = this.oModel.getProperty("/actionButtonsInfo/midColumn/exitFullScreen");
		// 	this.navigateToView(sNextLayout, "listCategory");
		// },
		handleClose: function () {
			//var sNextLayout = this.oModel.getProperty("/actionButtonsInfo/beginColumn/closeColumn");
			//this.navigateToView("inicio");
			this.oRouter.navTo("listCategory", {category: this._category, product: this._product});
		},
		navigateToView: function (sNextView) {
			this.oRouter.navTo(sNextView);
		},
		_onProductMatched: function (oEvent) {
			this._product = oEvent.getParameter("arguments").product || this._product || "0";
			this._category = oEvent.getParameter("arguments").category || this._category;

			this.getView().bindElement({
				path: "/productosTodos/" + this._product,
				model: "products"
			});
		},
		_getProduct: function() {
			// Obtener el contexto del elemento vinculado en la vista
			var oBindingContext = this.getView().getBindingContext("products");
			
			// Verificar si hay un contexto y un producto seleccionado
			if (oBindingContext && this._product) {
				// Obtener los datos del producto desde el modelo
				var oProduct = oBindingContext.getObject();
				// Asumiendo que el nombre del producto está en una propiedad llamada "name"
				return oProduct || null;
			} else {
				return "Producto no seleccionado";
			}
		},
		onComprar: function(oEvent){
			var oProducto=this._getProduct();
			var bSeEncontro=false;
			let bSeEncontroFav=false;
			var oModel = this.getView().getModel("carts");
            var aCartItems = oModel.getProperty("/carritoCompra") || [];
			var aCartFavorito = oModel.getProperty("/carritoGuardar") || [];
			for (var i = 0; i < aCartItems.length; i++) {
				var oProductoArray = aCartItems[i];
				if (oProductoArray.name === oProducto.name) {
					bSeEncontro=true;
					oProductoArray.quantity += 1;
					break;
				}
			}
			if(!bSeEncontro){

				for (let i = 0; i < aCartFavorito.length; i++) {
					let oProductoArray = aCartFavorito[i];
					if (oProductoArray.name === oProducto.name) {
						bSeEncontroFav=true;
						oProductoArray.quantity += 1;
						break;
					}
				}
				if(!bSeEncontroFav){
					var oProduct = Object.assign({ name: oProducto.name, image:oProducto.image , price: oProducto.price, quantity: 1 }, oProduct);
					aCartItems.push(oProduct);
					MessageToast.show("Se cargo el producto "[oProduct.name]+" en el carrito");
				}
			}
			oModel.setProperty("/carritoCompra", aCartItems);
			oModel.setProperty("/carritoGuardar", aCartFavorito);
			this._updateTotal();
		},
		onFavorito: function(oEvent){
			var oProducto=this._getProduct();
			let bSeEncontro=false;
			let bSeEncontroCarrito=false;
			let oModel = this.getView().getModel("carts");
            let aCartItems = oModel.getProperty("/carritoCompra") || [];
			let aCartFavorito = oModel.getProperty("/carritoGuardar") || [];

			for (let i = 0; i < aCartFavorito.length; i++) {
				let oProductoArray = aCartFavorito[i];
				if (oProductoArray.name === oProducto.name) {
					bSeEncontro=true;
					// oProductoArray.quantity += 1;
					MessageToast.show("Ya esta cargado en la lista de favorito");
					break;
				}
			}
			if(!bSeEncontro){

				for (let i = 0; i < aCartItems.length; i++) {
					let oProductoArray = aCartItems[i];
					if (oProductoArray.name === oProducto.name) {
						bSeEncontroCarrito=true;
						// oProductoArray.quantity += 1;
						MessageToast.show("el producto esta cargado en el carrito");
						break;
					}
				}
				if(!bSeEncontroCarrito){
					var oProduct = Object.assign({ name: oProducto.name, image:oProducto.image , price: oProducto.price, quantity: 1 }, oProduct);
					aCartFavorito.push(oProduct);
					MessageToast.show("Se cargo el producto "[oProduct.name]+" a favoritos");
				}
			}
			oModel.setProperty("/carritoCompra", aCartItems);
			oModel.setProperty("/carritoGuardar", aCartFavorito);
			this._updateTotal();
		},
		_updateTotal: function() {
            let oModel = this.getView().getModel("carts");
            let aItems = oModel.getData().carritoCompra;
            let fTotal = aItems.reduce(function(sum, item) {
                return sum + (item.price * item.quantity);
            }, 0);
            oModel.setProperty("/total", fTotal.toFixed(2));
        },
	});
});