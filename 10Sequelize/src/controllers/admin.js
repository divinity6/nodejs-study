const Product = require( "../models/product" );

/**
 * - Admin Products Controller
 * @param req
 * @param res
 * @param next
 */
exports.getProducts = ( req , res , next )=> {

    Product.findAll()
        .then( products => {
            res.render( 'admin/products' , {
                prods : products ,
                pageTitle : 'Admin Products' ,
                path : '/admin/products' ,
            } );
        } )
        .catch( err => console.log( '<<getDataFetchErr>> :' , err ) );
}

/**
 * - 제품추가 페이지 반환 Controller
 * @param req
 * @param res
 * @param next
 */
exports.getAddProduct = ( req , res , next )=> {
    res.render( 'admin/edit-product' , {
        pageTitle : 'Add Product' ,
        path : "/admin/add-product",
        editing : false,
    } )
}

/**
 * - 제품추가 Controller
 * @param req
 * @param res
 * @param next
 */
exports.postAddProduct = ( req , res , next ) => {

    const { title , imageUrl , description , price } = req.body;

    /**
     * - 해당 데이터를 자동으로 database 에 저장한다
     *
     * --> Sequelize 는 db 에 저장시 비동기로 처리한다
     */
    Product.create( {
        title,
        imageUrl,
        description,
        price
    } )
        .then( result => {
            console.log( '<<Created Product by Database>> :' , result )
        } )
        .catch( err => {
            console.log( '<<AddDataFetchErr>> :' , err )
        } );

}

/**
 * - 제품 수정 페이지 반환 Controller
 * @param req
 * @param res
 * @param next
 */
exports.getEditProduct = ( req , res , next )=> {

    const editMode = req.query.edit;

    if ( !editMode ){
        console.log( "dd" )
        return res.redirect( '/' );
    }
    const prodId = req.params.productId;

    console.log( "req.params" , req.params );

    Product.findByPk( prodId )
        .then( product => {
            if ( !product ){
                console.log( "p" )
                return res.redirect( '/' );
            }

            console.log( "product" , product );

            res.render( 'admin/edit-product' , {
                pageTitle : 'Edit Product' ,
                path : "/admin/edit-product",
                editing : editMode,
                product,
            } )

        } )
        .catch( err => console.log( '<<findDataFetchErr>> :' , err ) )

}

/**
 * - 제품 수정  Controller
 * @param req
 * @param res
 * @param next
 */
exports.postEditProduct = ( req , res , next ) => {
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const updatedImageUrl = req.body.imageUrl;
    const updatedDesc = req.body.description;

    Product.findByPk( prodId )
        .then( product => {
            product.title = updatedTitle;
            product.price = updatedPrice;
            product.description = updatedDesc;
            product.imageUrl = updatedImageUrl;

            /**
             * - 만약, product 가 존재하지 않는다면 새로 생성하지만,
             *   존재한다면 업데이트해준다
             *
             * - Promise 객체를 반환해 then 에 매핑한다
             */
            return product.save();
        } )
        .then( result => {
            console.log( '<<updatedData>> :' , result );
            res.redirect( "/admin/products" );
        } )
        .catch( err =>  console.log( '<<findDataFetchErr>> :' , err ) );


}

/**
 * - 제품 제거 Controller
 * @param req
 * @param res
 * @param next
 */
exports.postDeleteProduct = (  req , res , next ) => {
    const prodId = req.body.productId;

    Product.deleteById( prodId , () => {
    } );

    res.redirect( "/admin/products" );
}