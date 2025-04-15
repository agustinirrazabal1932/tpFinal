sap.ui.define([
	"./BaseController",
	"sap/ui/Device"
], function ( BaseController,Device) {
	"use strict";

	return BaseController.extend("ui5.ShopStarWars.controller.App", {
		onInit: function () {
			this.oRouter = this.getOwnerComponent().getRouter();
			
		},
        //sirve para cargar los datos ante que se vea la interfaz
        //para sincronizar los cambios de estados
		onStateChange: function (oEvent) {
			let sLayout = oEvent.getParameter("layout"),
				iColumns = oEvent.getParameter("maxColumnsCount");

			if (iColumns === 1) {
				this.BgetModel("appView").setProperty("/smallScreenMode", true);
				this.BsetLayout("One");
				this.oRouter.navTo("inicioPhone");
			} else {
				this.BgetModel("appView").setProperty("/smallScreenMode", false);
				if (sLayout === "OneColumn") {
					this.BsetLayout("Two");
					this.oRouter.navTo("inicio");
				}
			}
		},
	});
});
