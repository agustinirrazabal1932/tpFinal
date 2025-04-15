sap.ui.define([
	"sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
], function(Controller,UIComponent) {
    "use strict";

	return Controller.extend("ui5.ShopStarWars.controller.BaseController", {
        //funcion para ver el router
        // BgetRouter: function () {
		// 	return UIComponent.getRouterFor(this);
		// },

        //funcion para ver el modelo
        BgetModel: function (sNombre) {
			return this.getView().getModel(sNombre);
		},
		//funcion para ver el ResouceBundleS
		BgetResourceBundle: function () {
			return this.getOwnerComponent().getModel("i18n").getResourceBundle();
		},
        //actualizar valor del total de compra
        BupdateTotal: function() {
            let oModel =  this.BgetModel("carts");
            let aItems =oModel.getProperty("/carritoCompra") || [];
            let fTotal = aItems.reduce(function(sum, item) {
                return sum + (item.price * item.quantity);
            }, 0);
            
            oModel.setProperty("/total", fTotal.toFixed(2));
        },

    })
})