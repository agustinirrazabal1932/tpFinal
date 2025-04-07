sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel"
], function ( Controller,JSONModel) {
	"use strict";

	return Controller.extend("ui5.ShopStarWars.controller.App", {
		onInit: function () {
            var oViewModel,

			oViewModel = new JSONModel({
				layout : "TwoColumnsMidExpanded",
				smallScreenMode : true
			});

			this.getView().setModel(oViewModel, "appView");
			
		},
        //sirve para cargar los datos ante que se vea la interfaz
        //para sincronizar los cambios de estados
		onStateChange: function (oEvent) {
			var sLayout = oEvent.getParameter("layout"),
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

		/**
		 * Sets the flexible column layout to one, two, or three columns for the different scenarios across the app
		 * @param {string} sColumns the target amount of columns
		 * @private
		 */
		_setLayout: function (sColumns) {
			if (sColumns) {
				this.getView().getModel("appView").setProperty("/layout", sColumns + "Column" + (sColumns === "One" ? "" : "sMidExpanded"));
			}
		},

        // //para cerrar el router y liberar memoria
		// onExit: function () {
		// 	this.oRouter.detachRouteMatched(this.onRouteMatched, this);
		// 	this.oRouter.detachBeforeRouteMatched(this.onBeforeRouteMatched, this);
		// }
	});
});
