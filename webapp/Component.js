sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/model/json/JSONModel",
	"sap/f/library",
	"sap/f/FlexibleColumnLayoutSemanticHelper"
], function(UIComponent,JSONModel,library,FlexibleColumnLayoutSemanticHelper) {
	'use strict';
	var LayoutType = library.LayoutType;

	return UIComponent.extend("ui5.ShopStarWars.Component", {

		//crea una variable layout desde la la libreria
		
		metadata: {
			manifest: 'json'
		},

		init: function () {
			UIComponent.prototype.init.apply(this, arguments);

			var oModel = new JSONModel();
			this.setModel(oModel);

			// setea los productos en el modelo
			var oProductsModel = new JSONModel(sap.ui.require.toUrl('sap/ui/demo/mock/productosC.json'));
			oProductsModel.setSizeLimit(1000);
			this.setModel(oProductsModel, 'products');
					
            this.getRouter().initialize();
			
		},

		
		//crea la funcion getHelper para inicializar
		getHelper: function () {
			var oFCL = this.getRootControl().byId("fcl"),
				oParams = new URLSearchParams(window.location.search),
				oSettings = {
					defaultTwoColumnLayoutType: LayoutType.TwoColumnsMidExpanded,
					initialColumnsCount: oParams.get("initial"),
					maxColumnsCount: oParams.get("max")
				};

			return FlexibleColumnLayoutSemanticHelper.getInstanceFor(oFCL, oSettings);
		}

	});
});