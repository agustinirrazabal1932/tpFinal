sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/f/library",
], (Controller,fioriLibrary) => {
    "use strict";
    var LayoutType = fioriLibrary.LayoutType;

    return Controller.extend("ui5.ShopStarWars.controller.Inicio", {
        onInit() {
            
            this.oRouter = this.getOwnerComponent().getRouter();
            
           
        },
        onToggleCart: function (oEvent) {
			var bPressed = oEvent.getParameter("pressed");

            if(bPressed){
                this.getView().getModel("appView").setProperty("/layout", "ThreeColumnsMidExpanded");
            }else{
                this.getView().getModel("appView").setProperty("/layout", "TwoColumnsMidExpanded");
            }

			this.oRouter.navTo(bPressed ? "cart" : "inicio");
		},
    });
});