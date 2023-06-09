/**
 * - 매장관리자의 제품생성 처리 관련 라우팅 파일
 */
const express = require( 'express' );

const path = require("path");

const rootDir = require( "../util/path");

const router = express.Router();

const products = [];

// /admin/add-product => GET
router.get( '/add-product' , ( req , res , next )=> {
    // res.sendFile( path.join( rootDir , 'views' , 'add-product.html' ) );
    res.render( 'add-product' , {
        pageTitle : 'Add Product' ,
        path : "/admin/add-product",
        active : true,
        activeAddProduct : true,
        formsCSS : true,
        productCSS : true
    } )
} );

// /admin/add-product => POST
router.post( '/add-product' , ( req , res , next ) => {
    products.push( { title : req.body.title } )
    res.redirect( '/' );
} );

exports.routes = router;
exports.products = products;