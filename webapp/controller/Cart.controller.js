sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/f/library",
], (Controller,JSONModel,fioriLibrary) => {
    "use strict";
    var LayoutType = fioriLibrary.LayoutType;

    return Controller.extend("ui5.ShopStarWars.controller.Cart", {
        onInit() {
            this.oRouter = this.getOwnerComponent().getRouter();
            //this._updateTotal();
        },
        onBack: function (oEvent) {
            var oHistory = History.getInstance();
			var oPrevHash = oHistory.getPreviousHash();
			if (oPrevHash !== undefined) {
				window.history.go(-1);
			} else {
                this.oRouter.navTo("inicio");
			}
		},
        _updateTotal: function() {
            let oModel = this.getView().getModel("carts");
            var aItems = oModel.getData().carritoCompra;
            var fTotal = aItems.reduce(function(sum, item) {
                return sum + (item.price * item.quantity);
            }, 0);
            oModel.setProperty("/total", fTotal.toFixed(2));
        },
        onCheckout: function(oEvent){
            this._updateTotal();
        }
       
    });
});