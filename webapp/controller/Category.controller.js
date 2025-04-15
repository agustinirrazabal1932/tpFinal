sap.ui.define([
	"./BaseController",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function (BaseController, Filter, FilterOperator) {
	"use strict";

	return BaseController.extend("ui5.ShopStarWars.controller.Category", {
        onInit: function () {
			//recupero el router
			this.oRouter = this.getOwnerComponent().getRouter();
			//machea el router y la vista con la categoria que se le envio de list
			this.oRouter.getRoute("listCategory").attachPatternMatched(this._onCategoryMatched, this);
			this.oRouter.getRoute("detalleProducto").attachPatternMatched(this._onCategoryMatched, this);
			this.oRouter.getRoute("detalleProductoPhone").attachPatternMatched(this._onCategoryMatched, this);
			
		},
		//funcion para seleccionar el producto y verlo en detalleProducto
		onListItemPress: function (oEvent) {

			let productPath = oEvent.getSource().getSelectedItem().getBindingContext("products").getPath(),
				product = productPath.split("/").slice(-1).pop(),
				bSmallScreen=this.BgetModel("appView").getProperty("/smallScreenMode");
			if(bSmallScreen){
		
				this.oRouter.navTo("detalleProductoPhone", {category: this._category, product: product});

			}else{
				this.oRouter.navTo("detalleProducto", {category: this._category, product: product});
			}


		},
		//funcion para volver al la vista de list de phone
		onAtrasPhone: function(){
			this.oRouter.navTo("listPhone");
		},
		//funcion para volver al la vista inicio
		onAtras: function(){
			this.oRouter.navTo("inicio");
		},
		//funcion para buscar un producto en la tabla rimeo por nombre y despues por categoria
		onSearch: function (oEvent) {
			let oTableSearchState = [],
				sQuery = oEvent.getParameter("query");

			if (sQuery && sQuery.length > 0) {
				oTableSearchState = [
					new Filter("name", FilterOperator.Contains, sQuery)];
			}

			oTableSearchState.push(new Filter("categories", FilterOperator.Contains, this._category));
			this.getView().byId("productsTable").getBinding("items").filter(oTableSearchState, "Application");
		},
		//funcion donde actualiza la tabla para q se filtre por categoria
		_onCategoryMatched: function (oEvent) {
			let oTableSearchState,
				oTable = this.getView().byId("productsTable"),
				oTableBindingItems = oTable.getBinding("items"),
				oEventArgs = oEvent.getParameter("arguments");

			this._category = oEventArgs.category || this._category;//carga el elemento que pase de categoria con navTO ah this.categoria para no perderlo
			oTableSearchState = [new Filter("categories", FilterOperator.Contains, this._category)];//crea una tabla aplicando un flitro por la categoria
			oTableBindingItems.filter(oTableSearchState, "Application");//modifica la tablab para aplicar la tabla con los items filtrados
		}
	});
});