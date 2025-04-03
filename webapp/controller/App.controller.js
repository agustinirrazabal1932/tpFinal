sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function ( Controller) {
	"use strict";

	return Controller.extend("ui5.ShopStarWars.controller.App", {
		onInit: function () {
            //inicializa el router
			this.oRouter = this.getOwnerComponent().getRouter();
			this.oRouter.attachRouteMatched(this.onRouteMatched, this);
			this.oRouter.attachBeforeRouteMatched(this.onBeforeRouteMatched, this);
		},
        //sirve para cargar los datos ante que se vea la interfaz
		onBeforeRouteMatched: function(oEvent) {

			var oModel = this.getOwnerComponent().getModel();

			var sLayout = oEvent.getParameters().arguments.layout;

			// si no existe el layaout significa q le asigna que tenga 1 columna
			if (!sLayout) {
				var oNextUIState = this.getOwnerComponent().getHelper().getNextUIState(0);
				sLayout = oNextUIState.layout;
			}

			//si el rout es igual a list lo borra de la primer columna
			if (this.currentRouteName === "list") { 
				var oListView = this.oRouter.getView("ui5.ShopStarWars.view.List");
				this.getView().byId("fcl").removeBeginColumnPage(oListView);
			}

			//si existe lo carga en el modelo
			if (sLayout) {
				oModel.setProperty("/layout", sLayout);
			}
		},
        
        //por si machea la url y guarda los nombres y los argumentos
		onRouteMatched: function (oEvent) {
			var sRouteName = oEvent.getParameter("name"),
				oArguments = oEvent.getParameter("arguments");

			this._updateUIElements();

			
			this.currentRouteName = sRouteName;
			this.currentProduct = oArguments.product;
			this.currentSupplier = oArguments.supplier;
			this.currentCategory = oArguments.category;
		},
		
		_updateLayout: function(sLayout) {
			var oModel = this.getOwnerComponent().getModel();

			// If there is no layout parameter, query for the default level 0 layout (normally OneColumn)
			if (!sLayout) {
				var oNextUIState = this.getOwnerComponent().getHelper().getNextUIState(0);
				sLayout = oNextUIState.layout;
			}

			// Update the layout of the FlexibleColumnLayout
			if (sLayout) {
				oModel.setProperty("/layout", sLayout);
			}
		},
        
        //para sincronizar los cambios de estados
		onStateChanged: function (oEvent) {
			var bIsNavigationArrow = oEvent.getParameter("isNavigationArrow"),
				sLayout = oEvent.getParameter("layout");

			this._updateUIElements();

			
			if (bIsNavigationArrow) {
				this.oRouter.navTo(this.currentRouteName,
					{
						layout: sLayout, 
						category: this.currentCategory, 
						product: this.currentProduct, 
						supplier: this.currentSupplier
					}, true);
			}
		},

		// actualizar el modelo y la vista
		_updateUIElements: function () {
			var oModel = this.getOwnerComponent().getModel();
			var oUIState = this.getOwnerComponent().getHelper().getCurrentUIState();
			oModel.setData(oUIState, true);
		},
        //para cerrar el router y liberar memoria
		onExit: function () {
			this.oRouter.detachRouteMatched(this.onRouteMatched, this);
			this.oRouter.detachBeforeRouteMatched(this.onBeforeRouteMatched, this);
		}
	});
});
