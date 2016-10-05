"use strict";
var router_1 = require('@angular/router');
var main_component_1 = require('./main.component');
var product_detail_component_1 = require('./product-detail.component');
exports.productRoutes = [
    { path: 'main', component: main_component_1.ProductListComponent },
    { path: 'main/:id', component: product_detail_component_1.ProductDetailComponent }
];
exports.productRouting = router_1.RouterModule.forChild(exports.productRoutes);
//# sourceMappingURL=product.routing.js.map