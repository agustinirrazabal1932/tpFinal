sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/Device",
    "sap/f/library",
    "sap/ui/model/json/JSONModel",
    "sap/m/library"
], (Controller,Device,fioriLibrary,JSONModel,library) => {
    "use strict";
    var LayoutType = fioriLibrary.LayoutType;

    return Controller.extend("ui5.ShopStarWars.controller.Inicio", {
        onInit() {
            
            this.oRouter = this.getOwnerComponent().getRouter();
            let iPagesCount = 1;
			if (Device.system.desktop) {
				iPagesCount = 2;
			} else if (Device.system.tablet) {
				iPagesCount = 2;
			}
            let oCarousel = this.byId("carouselInicio");
            setInterval(function() {
                oCarousel.next();
            }, 3000);

            let oConfiguracionCarruselModel = new JSONModel({ pagesCount: iPagesCount });
			this.getView().setModel(oConfiguracionCarruselModel, "config");

            const CarouselScrollMode = library.CarouselScrollMode;
            let sScrollMode = CarouselScrollMode.VisiblePages
            this.byId("carouselInicio").getCustomLayout()?.setScrollMode(sScrollMode);
            
           
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