sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	'sap/ui/model/Sorter',
	'sap/m/MessageBox',
	'sap/f/library'
], function (JSONModel, Controller, Filter, FilterOperator, Sorter, MessageBox, fioriLibrary) {
	"use strict";

	// shortcut for sap.f.LayoutType
	var LayoutType = fioriLibrary.LayoutType;

	return Controller.extend("ui5.ShopStarWars.controller.Category", {
        onInit: function () {
			this.oRouter = this.getOwnerComponent().getRouter();

			//this.oRouter.getRoute("list").attachPatternMatched(this._onCategoryMatched, this);
			this.oRouter.getRoute("listCategory").attachPatternMatched(this._onCategoryMatched, this);
			this.oRouter.getRoute("detalleProducto").attachPatternMatched(this._onCategoryMatched, this);
		},
		onListItemPress: function (oEvent) {
			var productPath = oEvent.getSource().getSelectedItem().getBindingContext("products").getPath(),//obtiene la ruat del producto seleccionado
				product = productPath.split("/").slice(-1).pop();//devuelve el indice del producto

			this.oRouter.navTo("detalleProducto", {category: this._category, product: product});
			
		},
		onAtras: function(){
			this.oRouter.navTo("inicio");
		},
		onSearch: function (oEvent) {
			var oTableSearchState = [],
				sQuery = oEvent.getParameter("query");

			if (sQuery && sQuery.length > 0) {
				oTableSearchState = [
					new Filter("name", FilterOperator.Contains, sQuery)];
			}

			oTableSearchState.push(new Filter("categories", FilterOperator.Contains, this._category));
			this.getView().byId("productsTable").getBinding("items").filter(oTableSearchState, "Application");
		},

		// onAdd: function (oEvent) {
		// 	MessageBox.show("This functionality is not ready yet.", {
		// 		icon: MessageBox.Icon.INFORMATION,
		// 		title: "Aw, Snap!",
		// 		actions: [MessageBox.Action.OK]
		// 	});
		// },

		// onSort: function (oEvent) {
		// 	this._bDescendingSort = !this._bDescendingSort;
		// 	var oView = this.getView(),
		// 		oTable = oView.byId("productsTable"),
		// 		oBinding = oTable.getBinding("items"),
		// 		oSorter = new Sorter("Name", this._bDescendingSort);

		// 	oBinding.sort(oSorter);
		// },

		_onCategoryMatched: function (oEvent) {
			var oTableSearchState,
				oTable = this.getView().byId("productsTable"),
				oTableBindingItems = oTable.getBinding("items"),
				oEventArgs = oEvent.getParameter("arguments");

			this._category = oEventArgs.category || this._category;//carga el elemento que pase de categoria con navTO ah this.categoria para no perderlo
			oTableSearchState = [new Filter("categories", FilterOperator.Contains, this._category)];//crea una tabla aplicando un flitro por la categoria
			oTableBindingItems.filter(oTableSearchState, "Application");//modifica la tablabinding para aplicar la tabla con los items filtrados
		}
	});
});