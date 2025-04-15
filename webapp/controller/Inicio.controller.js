sap.ui.define([
    "./BaseController",
    "sap/m/library"
], (BaseController,library) => {
    "use strict";

    return BaseController.extend("ui5.ShopStarWars.controller.Inicio", {
        onInit() {
            //recupero el router
            this.oRouter = this.getOwnerComponent().getRouter();

            //funcion que permite que el carousel se mueva solo las cartas  cada 3 seg
            let oCarousel = this.byId("carouselInicio");
            setInterval(function() {
                oCarousel.next();
            }, 3000);

            //seteo para que el carousel se pueda mover de pagina en pagina y no de carta en carta
            const CarouselScrollMode = library.CarouselScrollMode;
            let sScrollMode = CarouselScrollMode.VisiblePages
            this.byId("carouselInicio").getCustomLayout()?.setScrollMode(sScrollMode);
            
           
        },
        onCart: function (){
            this.oRouter.navTo("cartPhone");

        },
        //funcion del boton para acceder al carrito
        onToggleCart: function (oEvent) {
			let bPressed = oEvent.getParameter("pressed");

            if(bPressed){
                this.BgetModel("appView").setProperty("/layout", "ThreeColumnsMidExpanded");
            }else{
                this.BgetModel("appView").setProperty("/layout", "TwoColumnsMidExpanded");
            }

			this.oRouter.navTo(bPressed ? "cart" : "inicio");
		},
        //funcion para apretar el header y que te mande al detalle del producto
		onCardPress: function (oEvent) {
            // Obtener el contexto de la tarjeta seleccionada
            let oHeader = oEvent.getSource(),
                oBindingContext = oHeader.getBindingContext("products"),
                oProduct = oBindingContext.getObject(),
                productPath = oBindingContext.getPath(),//obtiene la ruta del producto seleccionado
				product = productPath.split("/").slice(-1).pop();//limpia la ruta para solo devolver el producto
            let bSmallScreen=this.BgetModel("appView").getProperty("/smallScreenMode");
            
            if(bSmallScreen){
                this.oRouter.navTo("detalleProductoPhone", {category: oProduct.categories, product: product});
            }else{
                this.oRouter.navTo("detalleProducto", {category: oProduct.categories, product: product});
            }
		},
        //para ir a la list en versiones de phone
        onListPhone: function(){
            this.oRouter.navTo("listPhone");
        }
    });
});