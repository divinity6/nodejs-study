const fs = require( 'fs' );
const path = require( 'path' );
const Cart = require( './cart' );

/**
 * - 파일에서부터 제품을 가져오는 helper 함수
 *
 * @param {
 *      ( products : { [ fileName : string ] : any }[] , path? : string ) => void
 * } callback - 파일을 가져온 후 실행할 콜백
 *
 * @return void;
 */
const getProductsFromFile = ( callback ) => {
    /**
     * - Data 폴더의 products.json path
     */
    const _path = path.join(
        path.dirname( process.mainModule.filename ) ,
        'data' ,
        'products.json'
    );

    fs.readFile( _path ,( err, fileContent ) => {
        let products = [];

        if ( !( err ) ){
            products = JSON.parse( fileContent );
        }

        callback( products , _path );
    } );
}

/**
 * - 제품 단일 Model
 */
module.exports = class Product {
    /** fs 에서 제품을 읽어 callback 으로 전송 */
    static fetchAll( callback ){
        getProductsFromFile( callback );
    }

    /** fs 에서 전체 제품을 읽어 해당 id 의 제품을 찾아 callback 으로 전송 */
    static findById( id , callback ){
        getProductsFromFile( ( products ) => {

            const product = products.find( p => p.id === id );

            callback( product );
        } );
    }

    /** fs 에서 전체 제품을 읽어 해당 id 의 제품을 제거 */
    static deleteById( id ){
        getProductsFromFile( ( products , _path ) => {
            const product = products.find( p => p.id === id );
            const updatedProducts = products.filter( p => p.id !== id );

            fs.writeFile( _path , JSON.stringify( updatedProducts ) , ( err ) => {
                if ( !err ){
                    Cart.deleteProduct( id , product.price );
                }
                else {
                    console.log( "err" , err );
                }

            } );
        } );
    }

    title;
    imageUrl;
    description;
    price;
    id;

    constructor( id , title , imageUrl , description , price ) {
        this.id = id;
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
    }

    save(){

        getProductsFromFile( ( products , _path ) => {
            if ( this.id ){
                const existingProductIndex = products.findIndex( p => p.id === this.id );
                products[ existingProductIndex ] = this;
            }
            else {
                /**
                 * - 기존 파일에 새로운 파일을 추가하고, 파일시스템에 저장
                 */
                products.push( this );

                this.id = Math.random().toString();
            }

            fs.writeFile( _path , JSON.stringify( products ) , ( err ) => {
                console.log( "err" , err );
            } );
        } );
    }


}