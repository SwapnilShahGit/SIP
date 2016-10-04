"use strict";
var router_1 = require('@angular/router');
var product_list_component_1 = require('./product-list.component');
var product_detail_component_1 = require('./product-detail.component');
exports.productRoutes = [
    { path: 'products', component: product_list_component_1.ProductListComponent },
    { path: 'product/:id', component: product_detail_component_1.ProductDetailComponent }
];
exports.productRouting = router_1.RouterModule.forChild(exports.productRoutes);
//# sourceMappingURL=product.routing.js.map