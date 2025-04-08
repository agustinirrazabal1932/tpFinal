sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/f/library",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
], (Controller,JSONModel,fioriLibrary,MessageToast,MessageBox) => {
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
            let aItems =oModel.getProperty("/carritoCompra") || [];
            let fTotal = aItems.reduce(function(sum, item) {
                return sum + (item.price * item.quantity);
            }, 0);
            oModel.setProperty("/total", fTotal.toFixed(2));
        },
        onCheckout: function(){
            this._updateTotal();
        },
        onEliminardelCarrito: function(oEvent){
            this._onDeleteItem(oEvent)
            
        },
        _onDeleteItem: function(oEvent){
            let oBindingContext = oEvent.getParameter("listItem").getBindingContext("carts"),
                oProduct=oBindingContext.getObject(),
                oModel = this.getView().getModel("carts"),
                iProduct=-1,
                aCartItems = oModel.getProperty("/carritoCompra") || [];

            MessageBox.show(("¿Desea eliminar Este Item?"), {
                title: "Aviso",
                actions: [
                    MessageBox.Action.DELETE,
                    MessageBox.Action.CANCEL
                ],
                onClose: function (oAction) {
                    if (oAction !== MessageBox.Action.DELETE) {
                        return;
                    }

                    for (let i = 0; i < aCartItems.length; i++) {
                        let oProductoArray = aCartItems[i];
                        if (oProductoArray.name === oProduct.name) {
                            iProduct=i;
                            break;
                        }
                    }
                    if(iProduct>-1){
                        aCartItems.splice(iProduct, 1);
                        oModel.setProperty("/carritoCompra", aCartItems);
                        
                    }
                    MessageToast.show("Se eliminado el Producto "+ [oProduct.name]);
                    
                }
            });
        }
       
    });
});