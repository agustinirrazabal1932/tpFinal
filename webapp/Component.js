sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/model/json/JSONModel",
	"sap/ui/Device",
], function(UIComponent,JSONModel,Device) {
	'use strict';

	return UIComponent.extend("ui5.ShopStarWars.Component", {
		
		metadata: {
			manifest: 'json',
			interfaces: ["sap.ui.core.IAsyncContentCreation"]
		},

		init: function () {
			UIComponent.prototype.init.apply(this, arguments);

			let oModel = new JSONModel();
			this.setModel(oModel);

			// setea los productos en el modelo
			let oProductsModel = new JSONModel(sap.ui.require.toUrl('sap/ui/ui5/model/productosC.json'));
			oProductsModel.setSizeLimit(1000);
			this.setModel(oProductsModel, 'products');
			
			//setea modelo del carrito
			let oCart= new JSONModel(sap.ui.require.toUrl('sap/ui/ui5/model/cart.json'));
			this.setModel(oCart, 'carts');

			//setea el modelo del layout
			let oViewModel = new JSONModel({
				layout : "TwoColumnsMidExpanded",
				smallScreenMode : true
			});
			this.setModel(oViewModel, "appView");
			
			//setea la cantiadad de paginas del carousel dependiendo el dipositivo
			let iPagesCount = 1;
			if (Device.system.desktop) {
				iPagesCount = 2;
			} else if (Device.system.tablet) {
				iPagesCount = 2;
			}

            let oConfiguracionCarruselModel = new JSONModel({ pagesCount: iPagesCount });
			this.setModel(oConfiguracionCarruselModel, "config");


            this.getRouter().initialize();
			
		},

	});
});