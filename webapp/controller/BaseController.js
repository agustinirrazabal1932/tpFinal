sap.ui.define([
	"sap/ui/core/mvc/Controller",
    "sap/ui/core/Core",
], function(Controller,Core) {
    "use strict";

	return Controller.extend("ui5.ShopStarWars.controller.BaseController", {
        //sirve para setear la cantidad de columnas del layout
		BsetLayout: function (sColumns) {
			if (sColumns) {
				this.BgetModel("appView").setProperty("/layout", sColumns + "Column" + (sColumns === "One" ? "" : "sMidExpanded"));
			}
		},

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
        //cambiar el tema de color de blaco a oscuro
        onCambio: function(oEvent){
            if(oEvent.getSource().data("Tema")=="L"){
                Core.applyTheme("sap_horizon")
            }
            else{
                Core.applyTheme("sap_horizon_dark")
            }
        }

    })
})