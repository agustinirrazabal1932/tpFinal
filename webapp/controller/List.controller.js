sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/mvc/Controller",
	"sap/f/library",
], function (JSONModel,Controller,fioriLibrary) {
	"use strict";
	// shortcut for sap.f.LayoutType
	var LayoutType = fioriLibrary.LayoutType;

	return Controller.extend("ui5.ShopStarWars.controller.List", {
		onInit: function () {
			this.oRouter = this.getOwnerComponent().getRouter();
			
		},
		onListItemPress: function (oEvent) {
			var sCategory = oEvent.getSource().getSelectedItem().getCells()[0].getTitle(),
				bPhone = this.getOwnerComponent().getModel().getProperty("/isPhone"),
				aProducts = this.getView().getModel("products").getData().productosTodos,
				iProduct = 0;

			for (var i = 0; i < aProducts.length; i++) {
				var oProduct = aProducts[i];

				if (oProduct.Category === sCategory) {
					iProduct = i;
					break;
				}
			}

			if (bPhone) {
				//this.oRouter.navTo("detail", {layout: LayoutType.OneColumn, category: sCategory});
			} else {
				this.oRouter.navTo("listCategory", {category: sCategory, product: iProduct});
			}
		}
	});
});