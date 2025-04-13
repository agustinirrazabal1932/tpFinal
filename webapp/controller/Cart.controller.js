sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
], (Controller,MessageToast,MessageBox) => {
    "use strict";

    return Controller.extend("ui5.ShopStarWars.controller.Cart", {
        onInit() {
            //recupero router
            this.oRouter = this.getOwnerComponent().getRouter();

        },
        //actualizar valor del total de compra
        _updateTotal: function() {
            let oModel = this.getView().getModel("carts");
            let aItems =oModel.getProperty("/carritoCompra") || [];
            let fTotal = aItems.reduce(function(sum, item) {
                return sum + (item.price * item.quantity);
            }, 0);
            console.log([ fTotal.toFixed(2)]);
            oModel.setProperty("/total", fTotal.toFixed(2));
        },
        //para proceder a la compra
        onCheckout: function(){

            let oModel = this.getView().getModel("carts"),
                estado_f= this,
                aCartItems = oModel.getProperty("/carritoCompra") || [];

            MessageBox.show(("¿Esta seguro que desea hacer la compra?"), {
                title: "Aviso",
                actions: [
                    MessageBox.Action.OK,
                    MessageBox.Action.CANCEL
                ],
                onClose: function (oAction) {
                    if (oAction !== MessageBox.Action.OK) {
                        return;
                    }
                    MessageBox.show("!!FELICIDADES SU COMPRA SE EJECUTO CON EXITO¡¡")
                    aCartItems=[];
                    oModel.setProperty("/carritoCompra", aCartItems);
                    estado_f._updateTotal();

                }
            });
        },
        //funcion para eliminar del carrito
        onEliminardelCarrito: function(oEvent){
            let oBindingContext = oEvent.getParameter("listItem").getBindingContext("carts"),
                oProduct=oBindingContext.getObject(),
                sNombre=oProduct.name,
                oModel = this.getView().getModel("carts"),
                estado_f= this,
                aCartItems = oModel.getProperty("/carritoCompra") || [],
                iProduct=-1;
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
                        if (oProductoArray.name === sNombre) {
                            iProduct=i;
                            break;
                        }
                    }
                    if(iProduct>-1){
                        aCartItems.splice(iProduct, 1);
                        oModel.setProperty("/carritoCompra", aCartItems);
                        estado_f._updateTotal();
                    }
                    MessageToast.show("Se eliminado el Producto "+ [sNombre]);
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
                oModel = this.getView().getModel("carts"),
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
			this._updateTotal();
        },
        //funcion que se activa cuando eliminamos del carrito de favorito
        onEliminardelCarritoFav: function(oEvent){
            let oBindingContext = oEvent.getParameter("listItem").getBindingContext("carts"),
                oProduct=oBindingContext.getObject(),
                sNombre=oProduct.name,
                oModel = this.getView().getModel("carts"),
                aCartItems = oModel.getProperty("/carritoGuardar") || [],
                iProduct=-1;
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
                        if (oProductoArray.name === sNombre) {
                            iProduct=i;
                            break;
                        }
                    }
                    if(iProduct>-1){
                        aCartItems.splice(iProduct, 1);
                        oModel.setProperty("/carritoGuardar", aCartItems);
                    }
                    MessageToast.show("Se eliminado el Producto "+ [sNombre]);
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
                oModel = this.getView().getModel("carts"),
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
			this._updateTotal();
        }

    });
});