sap.ui.define([
    "./BaseController",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
], (BaseController,MessageToast,MessageBox) => {
    "use strict";

    return BaseController.extend("ui5.ShopStarWars.controller.Cart", {
        onInit() {
            //recupero router
            this.oRouter = this.getOwnerComponent().getRouter();

        },
        //vuelvo al home del Phone
        onHome: function(){
			this.oRouter.navTo("inicioPhone");
		},
        
        //para proceder a la compra
        onCheckout: function(){
            let oModel = this.BgetModel("carts"),
                estado_f= this,
                oResourceBundle = this.BgetResourceBundle(),
                aCartItems = oModel.getProperty("/carritoCompra") || [];

            MessageBox.show(oResourceBundle.getText("questionMsgBox"), {
                title: oResourceBundle.getText("titleMsgBox"),
                actions: [
                    MessageBox.Action.OK,
                    MessageBox.Action.CANCEL
                ],
                onClose: function (oAction) {
                    if (oAction !== MessageBox.Action.OK) {
                        return;
                    }
                    MessageBox.show(oResourceBundle.getText("purchaseMadeMsgBox"))
                    aCartItems=[];
                    oModel.setProperty("/carritoCompra", aCartItems);
                    estado_f.BupdateTotal();

                }
            });
        },
        //funcion para eliminar del carrito
        onEliminardelCarrito: function(oEvent){
            let oBindingContext = oEvent.getParameter("listItem").getBindingContext("carts"),
                oProduct=oBindingContext.getObject(),
                sNombre=oProduct.name,
                oModel = this.BgetModel("carts"),
                oResourceBundle = this.BgetResourceBundle(),
                estado_f= this,
                aCartItems = oModel.getProperty("/carritoCompra") || [],
                iProduct=-1;
            MessageBox.show(oResourceBundle.getText("textDeleteMsgBox"), {
                title: oResourceBundle.getText("titleDeleteMsgBox"),
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
                        if (oProductoArray.name === sNombre) {
                            iProduct=i;
                            break;
                        }
                    }
                    if(iProduct>-1){
                        aCartItems.splice(iProduct, 1);
                        oModel.setProperty("/carritoCompra", aCartItems);
                        estado_f.BupdateTotal();
                    }
                    MessageToast.show(oResourceBundle.getText("productDelete", [sNombre]));
                }
                
            });
           
            
        },
        //funcion del boton para cambiar de la lista del carrito a la lista de favoritos
        onCambiarListCarrito: function(oEvent){
            let oButton = oEvent.getSource();
            let oListItem = oButton.getParent(); // El HBox
            oListItem = oListItem.getParent();   // El CustomListItem

            // Obtener el contexto de binding
            let oBindingContext = oListItem.getBindingContext("carts"),
                oProducto=oBindingContext.getObject(),
                oModel = this.BgetModel("carts"),
                aCartItems = oModel.getProperty("/carritoCompra") || [],
                aCartFavorito=oModel.getProperty("/carritoGuardar") || [],
                iProduct=-1,
                bSeEncontro=false;
            for (var i = 0; i < aCartItems.length; i++) {
				var oProductoArray = aCartItems[i];
				if (oProductoArray.name === oProducto.name) {
					bSeEncontro=true;
                    iProduct=i;
					break;
				}
			}
			if(bSeEncontro){

				var oProduct = Object.assign({ name: oProducto.name, image:oProducto.image , price: oProducto.price, quantity: oProducto.quantity }, oProduct);
				aCartFavorito.push(oProduct);
                aCartItems.splice(iProduct, 1);
               
			}
            oModel.setProperty("/carritoCompra", aCartItems);
			oModel.setProperty("/carritoGuardar", aCartFavorito);
			this.BupdateTotal();
        },
        //funcion que se activa cuando eliminamos del carrito de favorito
        onEliminardelCarritoFav: function(oEvent){
            let oBindingContext = oEvent.getParameter("listItem").getBindingContext("carts"),
                oProduct=oBindingContext.getObject(),
                sNombre=oProduct.name,
                oModel = this.BgetModel("carts"),
                oResourceBundle = this.BgetResourceBundle(),
                aCartItems = oModel.getProperty("/carritoGuardar") || [],
                iProduct=-1;
            MessageBox.show(oResourceBundle.getText("textDeleteMsgBox"), {
                title: oResourceBundle.getText("titleDeleteMsgBox"),
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
                        if (oProductoArray.name === sNombre) {
                            iProduct=i;
                            break;
                        }
                    }
                    if(iProduct>-1){
                        aCartItems.splice(iProduct, 1);
                        oModel.setProperty("/carritoGuardar", aCartItems);
                    }
                    MessageToast.show(oResourceBundle.getText("productDelete", [sNombre]));
                }
            });
        },
        // funcion del boton para cambiar de la lista del favorito a la lista de carrito
        onCambiarListFav: function(oEvent){
            let oButton = oEvent.getSource();
            let oListItem = oButton.getParent(); // El HBox
            oListItem = oListItem.getParent();   // El CustomListItem

            // Obtener el contexto de binding
            let oBindingContext = oListItem.getBindingContext("carts"),
                oProducto=oBindingContext.getObject(),
                oModel = this.BgetModel("carts"),
                aCartItems = oModel.getProperty("/carritoGuardar") || [],
                aCartCompra=oModel.getProperty("/carritoCompra") || [],
                iProduct=-1,
                bSeEncontro=false;
            for (var i = 0; i < aCartItems.length; i++) {
				var oProductoArray = aCartItems[i];
				if (oProductoArray.name === oProducto.name) {
					bSeEncontro=true;
                    iProduct=i;
					break;
				}
			}
			if(bSeEncontro){

				var oProduct = Object.assign({ name: oProducto.name, image:oProducto.image , price: oProducto.price, quantity: oProducto.quantity }, oProduct);
				aCartCompra.push(oProduct);
                aCartItems.splice(iProduct, 1);
               
			}
            oModel.setProperty("/carritoCompra", aCartCompra);
			oModel.setProperty("/carritoGuardar", aCartItems);
			this.BupdateTotal();
        }

    });
});