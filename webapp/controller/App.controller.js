sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function ( Controller) {
	"use strict";

	return Controller.extend("ui5.ShopStarWars.controller.App", {
		onInit: function () {
			
		},
        //sirve para cargar los datos ante que se vea la interfaz
        //para sincronizar los cambios de estados
		onStateChange: function (oEvent) {
			let sLayout = oEvent.getParameter("layout"),
				iColumns = oEvent.getParameter("maxColumnsCount");

			if (iColumns === 1) {
				this.getView().getModel("appView").setProperty("/smallScreenMode", true);
			} else {
				this.getView().getModel("appView").setProperty("/smallScreenMode", false);
				// swich back to two column mode when device orientation is changed
				if (sLayout === "OneColumn") {
					this._setLayout("Two");
				}
			}
		},

		//sirve para setear la cantidad de columnas del layout
		_setLayout: function (sColumns) {
			if (sColumns) {
				this.getView().getModel("appView").setProperty("/layout", sColumns + "Column" + (sColumns === "One" ? "" : "sMidExpanded"));
			}
		},
	});
});
