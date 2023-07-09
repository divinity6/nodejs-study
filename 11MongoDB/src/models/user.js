const mongodb = require( 'mongodb' );
/** 해당 함수를 이용하여 Database 와 연결할 수 있다 */
const getDb = require( '../util/database' ).getDb;

const ObjectId = mongodb.ObjectId;

class User {

    static findById( userId ){
        const db = getDb();

        /** _id 와 매치되는 ID prodcut 반환 */
        return db.collection( 'users' )
            /** 1 개의 요소만 찾는것이라면 findOne 메서드를 이용할 수 있다 */
            .findOne( { _id : new ObjectId( userId ) } )
            .then( user => {
                console.log( "<<findById FindUser>>" , user );
                return user;
            } )
            .catch( err => console.log( '<<UserFindErr>> :' , err ) );
    }

    name;
    email;
    _id;

    constructor( username , email , cart , id ) {
        this.name = username;
        this.email = email;
        this.cart = cart;  // { items : [] }
        this._id = id;
    }

    save(){
        const db = getDb();
        return db.collection( 'users' ).insertOne( this );
    }

    /**
     * - 장바구니 추가
     * MongoDB 에서는 사용자가 cart 의 ID 를 들고있게 관계설정을 하여 편하게 설정할 수 있다
     */
    addToCart( product ){
        const cartProductIndex = this.cart.items.findIndex( cp => {
            /** toString 메서드로 ObjectId 의 문자열만 추출하여 사용할 수 있다 */
            return cp.productId.toString() === product._id.toString();
        } );
        let newQuantity = 1;
        const updatedCartItems = [ ...this.cart.items ];

        if ( 0 <= cartProductIndex ){
            newQuantity = this.cart.items[ cartProductIndex ].quantity + 1;
            updatedCartItems[ cartProductIndex ].quantity = newQuantity;
        }
        else {
            updatedCartItems.push( { productId : new ObjectId( product._id ) , quantity : newQuantity } )
        }
        const updatedCart = { items : updatedCartItems };
        const db = getDb();
        /** 기존 Cart 를 새로운 Cart 로 업데이트하여 반환 */
        return db.collection( 'users' ).updateOne(
            { _id : new ObjectId( this._id ) },
            { $set : { cart : updatedCart } }
        );
    }

    /** 사용자가 가진 cart 데이터들로 DB products collection 을 조회하여 product 들 반환 */
    getCart(){
        const db = getDb();
        const productIds = this.cart.items.map( i => i.productId );
        return db.collection( 'products' )
            /** productIds 중 하나라도 일치하는 제품들 전부 반환 */
            .find( { _id : { $in : productIds } } )
            .toArray()
            /** 받은 제품중 제품 수량에 대한 정보를 포함하여 반환 */
            .then( products => {
                return products.map( p => {
                    return {
                        ...p ,
                        /** 자기카트 ID 와 product 의 id 가 맞는 product.quantity 반환 */
                        quantity : this.cart.items.find( cp => {
                            return cp.productId.toString() === p._id.toString();
                        } ).quantity,
                    }
                } )
            } )
            .catch( err => console.log( '<<UserGetCartErr>> :' , err ) );
    }
}

module.exports = User;