sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (Controller) {
	"use strict";

	return Controller.extend("ui5.ShopStarWars.controller.List", {
		onInit: function () {
			//recupero el router
			this.oRouter = this.getOwnerComponent().getRouter();
		},
		//funcion cuando se selecciona una de las categorias
		onListItemPress: function (oEvent) {
			let sCategoria = oEvent.getSource().getSelectedItem().getCells()[0].getTitle(),
				aProductos = this.getView().getModel("products").getData().productosTodos,
				iProduct = 0;

			for (let i = 0; i < aProductos.length; i++) {
				let oProduct = aProductos[i];
				if (oProduct.categories === sCategoria) {
					iProduct = i;
					break;
				}
			}

			this.oRouter.navTo("listCategory", {category: sCategoria, product: iProduct});
			
		}
	});
});