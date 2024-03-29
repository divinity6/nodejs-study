## GraphQL

- REST ful API 를 구축하는 다른 방법


- 특정 경우에서는 REST API 보다 훨씬 이점이 있다

---

### What is GraphQL?

- REST API : 무상태로 클라이언트와 독립되어 데이터를 교환하는 API
  - View 를 렌더링하거나, 세션을 저장하지 않고, 클라이언트를 고려하지 않으며,
  - 오직 요청을 받고 데이터를 분석한 후 JSON 데이터와 함께 응답을 반환한다


- GraphQL API : 무상태로 클라이언트와 독립되어 데이터를 교환하는 API
  - 중요한점은 REST API 보다 쿼리 유연성이 높다

---

#### REST API Limitations ( REST API 의 한계 )

- 만약, REST API 에서 요청을 보냈을 시 해당 데이터를 반환하는 API 가 존재한다고 가

> **GET/post**

> Fetch Post

> ````json
> {
>   "id" : "1",
>   "title" : "First Post",
>   "content" : "...",
>   "creator" : { ... }
> }
> ````

- 그러나, 클라이언트에서 title 과 id 만 필요하고, content 나 creator 가 필요하지 않은 경우는 어떻게 해야할까?
  - client 가 만약 모바일이라면, 많은 데이터를 전송받을때 문제가 생길 수 있기 때문 
 

- **첫 번째**, 다양한 유형의 데이터를 반환하는 EndPoint 들을 더 만드는 것( 많은 API 를 만드는 것 )
  - 그러나 이때, EndPoint 가 너무 많으면, 지속적으로 업데이트할때 유지보수성이 떨어진다
  - 예를 들어, frontend 에서 새로운 페이지를 추가해야할 경우, backend 에서 알맞는 API 를 작성해줘야한다


- **두 번째**, query 파라미터를 이용하는 것
  - 이 또한, backend 에서 query 에 따라 복잡한 분기처리를 해서 내보내줘야 한다


- **세 번째**, GraphQL
  - 위처럼,클라이언트 앱에서 다양한 요청 요구사항이 있을 경우, 이상적인 해결 방안이다
  - GraphQL 에는 다양한 query 파라미터가 있어서, 필요한 데이터를 검색할 수 있다
  - 즉, Sequelize 나 Mongoose 처럼 DB 에 보내는 다양한 쿼리언어가 Frontend 에 존재하게 된다

> **POST/grapql**
> 
> 클라이언트에서 서버에 HTTP 요청을 보내는 단 하나의 엔드 포인트만 존재한다
> 
> ---
> 
> GraphQL 은 고유의 쿼리 언어를 요청 본문에 정의할 수 있다
> 
> ---
> 
> 이후, 서버는 해당 요청 본문을 해석해서 알맞는 데이터를 반환하는 방법으로 동작한다

> graphQL 은 아래처럼 응답 유형에 따라 query , mutation ,subscription 등에 데이터를 담고,
> 
> 그다음 nested 객체 명은 backend EndPoint API 이름으로 감싸 반환한다
> 
> ````json
> {
>   "query" : {
>     "user" : {
>       "name" : "Max",
>       "age" : "18"
>      }
>   }
> }
> ````

---

### Operation Type

- **Query** : 데이터를 검색하기 위해 POST 요청 사용
  - ( REST API 에서는 일반적으로 GET 요청 )


- **Mutation** : 일반적으로 데이터를 변경하는 모든 경우 사용
  - ( REST API 에서는 POST , PUT , PATCH , DELETE 요청들 )


- **Subscription** : 웹 소켓을 통해 실시간 연결일 경우 사용

---

### GraphQL Big Picture

- 클라이언트에서 서버의 단일 GraphQL EndPoint 에 요청을 보내고,


- 서버에서는 Query , Mutation ,Subscription 등의 응답 데이터 타입 정의 설정
  - ( 일반적인 Application 의 Route 역할 )


- 해당 요청 타입들은 서버 측 논리를 포함한 **Resolver** 함수에 연결된다
  - ( 일반적인 Application 의 Controller 역할 )


- 쿼리 표현을 요청 본문에 넣기 위해 오직 POST 요청만 사용한다

---

### How to Install Server

- graphQL 을 사용할 것이기 때문에, route 폴더( app.js 에서 사용하는 route 들 전부 )와 socket.io 라이브러리를 제거한다


- 그 후 graphql 과 express-graphql 패키지를 설치한다
  - express-graphql 은 graphql 14.7.0 이나, 15.3.0 버전과 호환된다

````shell
# 기본
npm i graphql@15.3.0

# workspaces 를 사용하는 경우
npm i graphql@15.3.0 --workspace=<< 워크스페이스_이름 >>
````

````shell
# 기본
npm i express-graphql

# workspaces 를 사용하는 경우
npm i express-graphql --workspace=<< 워크스페이스_이름 >>
````

- 상위 버전을 사용하려면, express-graphql 이 아닌, graphql-helix 를 사용하면 된다

- 추가되는 패키지 구조
````
server/
|
|– graphql/                          # graphql 관련된 코드들
|   |
|   |– schema.js                     # Query , Mutation, Subscription 등 GraphQL 서비스 유형 정의( router 역할 )
|   |
|   |– resolvers.js                  # 들어오는 Query 를 위해 실행되는 논리등( controller 역할 )
|
|– app.js
````

---

### How to Install Client

- 현재 프로젝트 기준, Feed.js 에서 openSocket 관련된 코드와 addPost , updatePost 메서드들을 제거한다
  - ( 나중에 다르게 작성할 예정 )

- 아래 파일 수정
````
client/
|
|– src/                          
    |
    |– pages/                     
        |
        |– Feed/                 
            |
            |– Feed.js                  # openSocket , addPost , updatePost 제거
````

---

### How to Use?

- GraphQL 의 가장 큰 특징으로 하나의 EndPoint 로 받고자 하는 frontend 데이터를 정의할 수 있다

### Query 를 사용하여 데이터 요청

---

#### schema.js

- Rest API 의 Route 역할로, 응답하고자하는 Schema 를 정의한다


- 이때, 벡틱( `` )을 이용하여 선언하는데, GraphQL 에 내장된 유형은 String , Int , Float , Boolean , ID 등이 있다
  - 필드는 콤마( , )를 사용하지 않고, 반환하고자 하는 타입들을 선언한다
  

- **type** :
  - type TestData {}등, 반환하고자 하는 데이터 응답 타입을 정의한다( key : value 형태 )
  - 이때, 응답 타입에 ! 를 붙이면 required 가 된다( String! )


- **schema** :
  - 사용하고자 하는 type 필드를 정의 및 작성한다( 이때, query 로 받을지, Mutation 으로 받을지 등등을 설정한다 )

````javascript
/** ===== graphql/schema.js ===== */

/** Query , Mutation, Subscription 등 GraphQL 서비스 유형 정의 */
const { buildSchema } = require( 'graphql' );

module.exports = buildSchema( `
    type TestData {
        text : String!
        views : Int!
    }

    type RootQuery {
        hello: TestData
    }
    
    schema {
        query: RootQuery
    }
` );
````

---

#### resolvers.js

- Rest API 의 Controller 역할로, 생성한 Schema 의 반환 메서드 및 논리를 정의한다


- 이때, **Schema 에 정의된 각 Query , Mutation 등의 이름과 일치하는 메서드**가 필요하다
  - ( Query 이름이 위의 RootQuery 타입에서는 hello 이기 때문에 hello 메서드가 필요하다 )

````javascript
/** ===== graphql/resolvers.js ===== */

/** 들어오는 Query 를 위해 실행되는 논리 정의 */
module.exports = {
  hello(){
    return {
      text : 'Hello World!',
      views : 1245
    }
  }
};
````

---

#### app.js

- 이제, app.js 에서 graphQL 과 express app 을 연결시켜준다

````javascript
/** ===== app.js ===== */

const { graphqlHTTP } = require( 'express-graphql' );
const graphqlSchema = require( './graphql/schema' );
const graphqlResolver = require( './graphql/resolvers' );

/** post 요청으로 제한하지않고 모든 middleware 타입으로 넘겨준다 */
app.use( '/graphql' , graphqlHTTP( {
  schema : graphqlSchema,
  rootValue : graphqlResolver,
  graphiql : true,        // graphiql 툴 사용 http://localhost:8080/graphql 로 접근하여 테스트 할 수 있다
} ) );

````

- 또한 app.js 에서 graphQL 을 등록할때, { graphiql : true } 값을 입력해 두었다면,


- graphQL 을 등록한 url 로 이동하여 graphQL API 를 테스트해볼수도 있다
  - 위의 예시에서는 http://localhost:8080/graphql


- 해당 url 로 접근하여, 주석아래에 요청할 값들을 작성하고 play( run ) 버튼을 눌러 응답값을 체크할 수 있다

````shell
# 아래 형태로 작성하여 응답값을 왼쪽에서 바로 볼 수 있다

mutation{
  createUser( userInput:{ email :"test@test.com" , name :"Max" , password :"tester" } ) {
    _id
    email
  }
}
````

- 즉, PostMan 보다 테스트하기 용이하다.


- 자동완성이 지원되어, 상호작용이 가능하고, 오른쪽에 참고 DOC 를 지원하여 쉽게 테스트할 수 있다

---

#### frontend

- frontend 에서 이제 요청을 보낼때, app.js 에서 설정한 entryPoint 로 요청을 보내면,


- 요청 query 에 따라 응답을 반환해준다

````javascript
/** ========== frontend request ========== */
fetch( 'http://localhost:8080/graphql' , {
  method : 'POST',
  body : {
      /** 받고자 하는 데이터들을 콤마( , ) 없이 String 형식으로 나열  */
      query : "{ hello { text } }"
  }
} )
````

- 응답값은 아래와 같다

````json
{
  "data": {
    "hello": {
      "text": "Hello World!"
    }
  }
}
````

- 요청 query 에 필드를 추가할 경우


- GraphQL 중 일반 Query 타입일 경우에는, 타입을 명시하지 않고,


- JSON.stringify( { query : ... } ) 형태로 곧바로 보낸다

````javascript
/** ========== frontend request ========== */
fetch( 'http://localhost:8080/graphql' , {
  method : 'POST',
  body : JSON.stringify( {
    /** 받고자 하는 데이터들을 콤마( , ) 없이 String 형식으로 나열  */
    query : "{ hello { text views } }"
  } )
} )
````

- 응답값은 아래와 같다

````json
{
  "data": {
    "hello": {
      "text": "Hello World!",
      "views": 1245
    }
  }
}
````

- 즉, 지금까지의 과정으로 frontend 에서 받고자하는 데이터를 filtering 하는 것이 아니라, express-graphql 에 의해


- 서버에서 받는 데이터가 필터링되어 들어온다
  - ( 응답데이터의 부담이 줄어든다! )

---

### Mutation 을 사용하여 데이터 응답

- 데이터를 요청시 반환하는 것 뿐만이 아니라, 
  - frontend 에서 데이터를 업데이트해야할 경우, 
  - Mutation 을 사용할 수 있다

---

#### schema.js

- type 선언시 queryName( paramName : paramType ) 형태로 입력하면, 요청시 입력한 파라미터를 입력할 수 있다 


- 사용자가 입력한 데이터 타입을 만들경우에는 type 키워드가 아닌, input 키워드를 사용한다


- 또한, GraphQL 타입 중 ID 타입은 GraphQL 이 제공하는 type 으로, ID 로 취급된다


- 기본 GraphQL built-in 타입이 아닌, 레퍼런스 타입들은( Object ,Array 등 ) 
  - 반드시 input, type 등으로 선언해줘야 한다

````javascript
/** ===== graphql/schema.js ===== */

/** Query , Mutation, Subscription 등 GraphQL 서비스 유형 정의 */
const { buildSchema } = require( 'graphql' );

module.exports = buildSchema( `
    type Post {
        _id : ID!
        title : String!
        content : String!
        imageUrl : String!
        creator : User!
        createdAt : String!
        updatedAt : String!
    }

    type User {
        _id : ID!
        name : String!
        email : String!
        password : String
        status : String!
        posts : [Post!]!
    }

    input UserInputData {
        email : String!
        name : String!
        password : String!
    }
    
    type RootQuery {
        hello : String
    }

    type RootMutation {
        createUser( userInput : UserInputData ): User!
    }
    
    schema {
        query : RootQuery
        mutation : RootMutation
    }
` );
````

---

#### resolver.js

- resolver 에서는 query 에 파라미터를 추가시, 파라미터를 받을 수 있다


- Schema 에 작성했던 parameter 타입과, response 타입을 통하여, 실제 사용자를 생성하는 로직을 작성한다

````javascript
/** ===== graphql/resolvers.js ===== */

const bcrypt = require( 'bcryptjs' );
const User = require( '../models/user' );

/** 들어오는 Query 를 위해 실행되는 논리 정의 */
module.exports = {
    /**
     * - Schema 에 정의했던 arguments 데이터들이 첫 번째 argument 에 들어온다
     *   ( 다수의 arguments 들을 입력할 수 있기 때문에, 첫번째 파라미터에 객체형태로 들어온다 )
     * */
    createUser : async function( { userInput } , req ){
        const existingUser = await User.findOne( { email : userInput.email } );

        /** 사용자가 존재할 경우 에러 생성 */
        if ( existingUser ){
            const error = new Error( 'User exists already!' );
            throw error;
        }

        /** password 를 암호화하고 저장한 후, 응답 값 반환 */
        const hashedPw = await bcrypt.hash( userInput.password , 12 );
        const user = new User( {
            email : userInput.email,
            name : userInput.name,
            password : hashedPw
        } );

        /** DB 에 사용자 저장 */
        const createdUser = await user.save();

        /**
         * - Schema 에 정의된 User 객체와 같은 type 을 반환하도록 한다
         *
         * - _doc 를 사용하면, Mongoose 가 추가한 메타데이터를 제외한 사용자가 입력한 데이터들만 반환한다
         */
        return {
            ...createdUser._doc,
            _id : createdUser._id.toString(),
        }
    }
};
````

--- 

### validation

- Rest API 에서는 express-validator 를 이용해 라우트에 미들웨어로 추가했다


- 그러나, graphQL 의 경우는 단 하나의 endpoint 를 가지기 때문에, 


- 필요에 따라 validation 체크를 수행할 수 있도록 resolver 에서 validation 체크를 수행해야 한다


- 따라서, express-validator 가 아니라 express-validator 의 core package 인 validator 를 설치한다

````shell
# 기본
npm i validator

# workspaces 를 이용하는 경우
npm i validator --workspace=<< 워크스페이스_이름 >>
````

- 설치 후 resolvers.js 에서 로직을 체크할 수 있다 

````javascript
/** ===== graphql/resolvers.js ===== */

/** 들어오는 Query 를 위해 실행되는 논리 정의 */
module.exports = {
  createUser : async function( { userInput } , req ){
    const existingUser = await User.findOne( { email : userInput.email } );

    const errors = [];
    /** email 체크 */
    if ( !validator.isEmail( userInput.email ) ){
      errors.push( { message : 'E-Mail is invalid.' } );
    }

    /** password 체크 */
    if (
        validator.isEmpty( userInput.password ) ||
        !validator.isLength( userInput.password , { min : 5 } )
    ){
      errors.push( { message : 'Password too short!' } );
    }

    if ( 0 < errors.length ){
      const error = new Error( 'Invalid input.' );
      throw error;
    }
    
    /** 그 후 로직 */
  }
}
````

- 해당 validation 체크 결과는 graphql 을 등록했던 주소에서 체크할 수 있다

---

### ErrorHandling

- GraphQL 에서 ErrorFormat 을 지정할 수 있는데, graphql 을 등록하는 객체에 


- customFormatErrorFn 함수를 추가하여 원하는 error 를 반환하게 할 수 있다


- customFormatErrorFn 에서 받는 error 파라미터에는 originalError 프로퍼티가 존재할 수 있는데,


- originalError 에는 graphQL 외에서 발생한 error 객체가 들어간다
  - 즉, graphql query 에 글자가 누락되는 등의 error 가 발생하면, originalError 에 추가되지 않는다

````javascript
/** ===== app.js ===== */

/** post 요청으로 제한하지않고 모든 middleware 타입으로 넘겨준다 */
app.use( '/graphql' , graphqlHTTP( {
  schema : graphqlSchema,
  rootValue : graphqlResolver,
  graphiql : true,        // graphiql 툴 사용 http://localhost:8080/graphql 로 접근하여 테스트 할 수 있다
  customFormatErrorFn( err ){
    console.log( '<< err >>' , err )
    /**
     * - originalError 에는 graphQL 외에서 발생한 error 객체가 들어간다
     *
     * - 즉, graphql query 에 글자가 누락되는 등의 error 가 발생하면,
     *   originalError 에 추가되지 않는다
     */
    if ( !err.originalError ){
      return err;
    }

    const data = err.originalError.data;
    const message = err.message || 'An error occurred.';
    const code = err.originalError.code || 500;

    /** 원하는 error 객체를 생성해서 반환할 수 있다 */
    return {
      message,
      status : code,
      data
    }
  }
} ) );
````

- resolvers.js 에서 error 발생시 data 와 code 필드를 추가하여, 


- grapql 생성시 등록한 customFormatErrorFn 함수에서 받도록 추가한다

````javascript
/** ===== graphql/resolvers.js ===== */

/** 들어오는 Query 를 위해 실행되는 논리 정의 */
module.exports = {
  createUser : async function( { userInput } , req ){

    const errors = [];
    /** email 체크 */

    /** password 체크 */

    if ( 0 < errors.length ){
      const error = new Error( 'Invalid input.' );
      /** 에러 객체의 data 필드에 발생한 error 들 추가 */
      error.data = errors;
      error.code = 422;
      
      throw error;
    }
    
    /** 그 후 로직 */
  }
}
````

- 내가 설정한 error 를 반환받아 처리할 수 있다

````json
{
  "errors": [
    {
      "message": "Invalid input.",
      "status": 422,
      "data": [
        {
          "message": "E-Mail is invalid."
        }
      ]
    }
  ],
  "data": null
}
````

#### frontend

- frontend 에서 요청을 보낼때 entryPoint 는 하나기 때문에, graphql entryPoint 로 요청을 보낸다 


- graphql 을 처음 사용하면 요청을 보낼시 Failed to fetch 에러를 만나게 되는데, 
  - 브라우저가 실제 요청을 보내기전 Options 메서드를 전송해 해당 URI 가 유효한지 체크한다
  - 그러나, 문제는 Express GraphQL 이 POST 나 GET 요청을 제외하고 모든 요청을 자동으로 거부한다
  - ( 따라서, Options 요청도 거절된다 )


- 따라서, 서버에서 OPTIONS 메서드로 들어온 요청을 서버 Header 설정에서 OK 로 응답하도록 설정해줘야 한다

````javascript
/** ===== app.js ===== */

/** CORS 이슈를 해결하기 위해 header 에 교차출처 공유 설정 */
app.use( ( req , res , next ) => {

    /** 이전 HTTP Header 설정 코드들... */
    
    /** GraphQL 사용시, OPTIONS 로 URI 체크시 유효한 응답을 반환하도록 설정 */
    if ( 'OPTIONS' === req.method ){
        return res.sendStatus( 200 );
    }
    next();
} );

````

- frontend 에서는 요청을 보낼때, graphql 형식에 맞게 보내줘야하는데,


- 문자열 형태로 모든 데이터를 작성하여 보낸다


- GraphQL 요청 중 일반 query 타입을 제외하고는, 어떤 요청 query 인지 명시하여 보내줘야 한다

````javascript
/** ========== frontend request ========== */
const graphqlQuery = {
  query :`
    mutation {
      createUser( userInput: { 
        email :"${ authData.signupForm.email.value }" , 
        name :"${ authData.signupForm.name.value }" , 
        password :"${ authData.signupForm.password.value }" 
        } ) {
        _id
        email
      }
    }
  `
};

fetch( 'http://localhost:8080/graphql' , {
  method : 'POST',
  body : {
      /** 받고자 하는 데이터들을 콤마( , ) 없이 String 형식으로 나열  */
      query : JSON.stringify( graphqlQuery )
  }
} )
````

---

### Auth

- 로그인은 결국 사용자 데이터를 전송하고, 토큰을 받기 원하는 일반적인 Query 와 같다


- 따라서, RestAPI 의 로그인 방식을 사용할 수 있다

````javascript
/** ===== graphql/schema.js ===== */

const { buildSchema } = require( 'graphql' );

/** 하나의 entryPoint 를 사용하기 때문에, 이곳에 login 관련 Schema 도 정의한다 */
module.exports = buildSchema( `

    type AuthData {
        token : String!
        userId : String!
    }

    type RootQuery {
        login( email : String!, password : String! ) : AuthData!
    }

    schema {
        query : RootQuery
        mutation : RootMutation
    }
` );
````

- 그리고, 정의했던 Schema 를 토대로 login resolver 를 추가해주면 된다

````javascript
/** ===== graphql/resolvers.js ===== */
const bcrypt = require( 'bcryptjs' );
const jwt = require( 'jsonwebtoken' );
const User = require( '../models/user' );

/** 들어오는 Query 를 위해 실행되는 논리 정의 */
module.exports = {
  /** 로그인 resolver  */
  login : async ( { email , password } ) => {
    const user = await User.findOne( { email } );

    /** 유효한 사용자가 없을 경우 */
    if ( !user ){
      const error = new Error( 'User not found.' );
      error.code = 401;
      throw error;
    }

    /** 사용자의 password 와 DB password 를 검사한다 */
    const isEqual = await bcrypt.compare( password, user.password );
    if ( !isEqual ){
      const error = new Error( 'Password is incorrect.' );
      error.code = 401;
      throw error;
    }

    /**
     * - sign 메서드를 이용해 새로운 서명( 시그니처 )생성
     *
     * @param { any } payload - 토큰에 이메일, 사용자 아이디등등
     *   ( 그러나, 비밀번호를 포함하는것은 보안상 좋지 않다 )
     *
     * @param { string } secretOrPrivateKey - 서명에 사용할 private key 를 사용한다
     *                                        ( 이 값을 이용해 난수화해서 해독할 수 없게한다 )
     *
     * @param { any } options - 유효기간등 옵션을 설정할 수 있다
     *                          ( expiresIn : '1h' => 1시간 유효 )
     */
    const token = jwt.sign( {
      userId : user._id.toString(),
      email : user.email
    } , 'somesupersecretsecret' , { expiresIn : '1h' } );
    return { token , userId : user._id.toString() }
  }
}
````

- 다시한번 말하지만, GraphQL 에서 일반 query 타입은 query 를 생략할 수 있다


- 따라서, frontend request 에서 query 를 생략하고 데이터를 요청할 수 있다

````javascript
/** ========== frontend request ========== */
const graphqlQuery = {
  query : `{ 
    login( email : "${ authData.email }" , password : "${ authData.password }" ) {
      token
      userId
    } 
  }`
}

fetch( 'http://localhost:8080/graphql' , {
  method : 'POST',
  body : {
      /** 받고자 하는 데이터들을 콤마( , ) 없이 String 형식으로 나열  */
      query : JSON.stringify( graphqlQuery )
  }
} )
````

---

### createPost

- 게시물 추가할때도, Schema 에 게시물 타입을 정의한다

````javascript
/** ===== graphql/schema.js ===== */

const { buildSchema } = require( 'graphql' );

/** 하나의 entryPoint 를 사용하기 때문에, 이곳에 정의한다 */
module.exports = buildSchema( `

    type Post {
        _id : ID!
        title : String!
        content : String!
        imageUrl : String!
        creator : User!
        createdAt : String!
        updatedAt : String!
    }
    
    input PostInputData {
        title : String!
        content : String!
        imageUrl : String!
    }

    type RootMutation {
        createPost( postInput : PostInputData ) : Post!
    }

    schema {
        query : RootQuery
        mutation : RootMutation
    }
` );
````

- 그리고, 정의한 타입에 따라 내보내주는 resolver 를 추가한다 

````javascript
/** ===== graphql/resolvers.js ===== */
const validator = require( 'validator' );
const Post = require( '../models/post' );

/** 들어오는 Query 를 위해 실행되는 논리 정의 */
module.exports = {
  /** 게시물 추가하기 */
  createPost : async ( { postInput } , req ) => {
    const errors = [];
    /** title validation 체크 */
    if ( validator.isEmpty( postInput.title ) ||
            !validator.isLength( postInput.title , { min : 5 } ) ){
      errors.push( { message : 'Title is invalid.' } );
    }

    /** content validation 체크 */
    if ( validator.isEmpty( postInput.content ) ||
            !validator.isLength( postInput.content , { min : 5 } ) ){
      errors.push( { message : 'Content is invalid.' } );
    }

    if ( 0 < errors.length ){
      const error = new Error( 'Invalid input.' );
      /** 에러 객체의 data 필드에 발생한 error 들 추가 */
      error.data = errors;
      error.code = 422;

      throw error;
    }

    /** 새로운 게시물 생성 */
    const post = new Post( {
      title : postInput.title,
      content : postInput.content,
      imageUrl : postInput.imageUrl,
    } );
    const createdPost = await post.save();
    // Add post to user's posts
    return {
      ...createdPost._doc ,
      _id : createdPost._id.toString(),
      /**
       * - 작성일시등은 Date 타입으로 저장되는데 GraphQL 은 읽지 못하기 때문에,
       *   String 으로 변환해주면 된다
       */
      createdAt : createdPost.createdAt.toISOString(),
      updatedAt : createdPost.updatedAt.toISOString(),
    }
  }
}
````

- 그런데, 게시물을 추가하거나, 가져올때, 요청하는 사람이 인증된 사람인지,


- 즉, 검증된 사람인지 검증하는 작업이 필요하다


- 따라서, 기존 토큰 검증 미들웨어에서 검증하는데, 검증처리시 에러처리는
  - ( 예를들어, 검증되지 않은사람이거나, 유효하지 토큰이거나등등... )


- GraphQL resolver 에서 던지는게 맞으므로, 에러를 직접 던지지 않고, 식별할 수 있는 flag 만 설정해둔다
  - 예) isAuth = false 등

````javascript
/** ===== middleware/auth.js ===== */
const jwt = require( 'jsonwebtoken' );

/**
 * - JSON Web Token 인증 미들웨어
 * @param req
 * @param res
 * @param next
 */
module.exports = ( req , res , next ) => {
  const authHeader = req.get( 'Authorization' );

  /** 인증헤더를 부착하지 않았을 경우 */
  if ( !authHeader ){
    /**
     * - 일반 Error Handler 에서 처리하는것이 아닌,
     *   GraphQL resolver 에서 처리하도록 수정
     */
    req.isAuth = false;
    return next();
  }

  /** Authorization 헤더 반환 Bearer 부분을 잘라서 사용 */
  const [ _ , token ] = authHeader.split( ' ' );
  let decodedToken;
  try {
    /**
     * - verify() 메서드는 토큰을 해석할뿐만 아니라, 체크하는 과정도 거친다
     *
     * - decoded 메서드도 존재하지만, 해독만하지, 유효한지는 체크하지 않기 때문에
     *   반드시 verify 메서드를 사용한다
     *
     * --> verify 메서드는 토큰과 비공개 인증키를 함께 넣어줘야한다
     */
    decodedToken = jwt.verify( token , 'somesupersecretsecret' );
  }
  catch ( err ){
    /**
     * - 일반 Error Handler 에서 처리하는것이 아닌,
     *   GraphQL resolver 에서 처리하도록 수정
     */
    req.isAuth = false;
    return next();
  }

  /** 해독은 잘되었지만, 토큰이 유효하지 않을 경우 */
  if ( !decodedToken ){
    /**
     * - 일반 Error Handler 에서 처리하는것이 아닌,
     *   GraphQL resolver 에서 처리하도록 수정
     */
    req.isAuth = false;
    return next();
  }

  /** 인증이 되었다면 해당 토큰의 userId 를 요청에 부착하여 사용 */
  req.userId = decodedToken.userId;
  /** 복호화를 성공한 경우에만 true 로 설정 */
  req.isAuth = true;
  console.log( '<< JWT Auth UserId>>' , req.userId );

  next();
}
````

- 그러므로, 해당 검증처리는 GraphQL 미들웨어보다 먼저 실행되어야 하므로, 


- GraphQL 상위 미들웨어에 등록해준다


- 즉, 인증처리 미들웨어에서 처리하는것은 isAuth flag 가 인증되었는지 여부와 사용자를 설정하는 것이다

````javascript
/** ===== app.js ===== */
const express = require( 'express' );
const { graphqlHTTP } = require( 'express-graphql' );
const auth = require( './middleware/auth' );
const app = express();

/** GraphQL 동작전 token 체크 미들웨어에서 먼저 체크 */
app.use( auth );

/** post 요청으로 제한하지않고 모든 middleware 타입으로 넘겨준다 */
app.use( '/graphql' , graphqlHTTP( { ... } ) );

````

- 그 후, resolver 에서 인증처리가 되어있는지 validation 체크하고,


- userId 정보가 제공되므로,  Post Model 의 creator 필드를 업데이트할 수 있다

````javascript
/** ===== graphql/resolvers.js ===== */
const validator = require( 'validator' );
const User = require( '../models/user' );
const Post = require( '../models/post' );

/** 들어오는 Query 를 위해 실행되는 논리 정의 */
module.exports = {
  /** 게시물 추가하기 */
  createPost : async ( { postInput } , req ) => {
    /** 검증되지 않은 사용자일 경우 처리 */
    if ( !req.isAuth ){
      const error = new Error( 'Not authenticated!' );
      error.code = 401;
      throw error;
    }

    /** validation 체크 로직... */

    /** 여기에서 찾은 User 는 현재 로그인 중인 사용자다 */
    const user = await User.findById( req.userId );
    if ( !user ){
      const error = new Error( 'Invalid user.' );
      error.code = 422;
      throw error;
    }

    /** 새로운 게시물 생성 */
    const post = new Post( {
      title : postInput.title,
      content : postInput.content,
      imageUrl : postInput.imageUrl,
      /** creator 필드에 DB 에서 가져온 User 설정 */
      creator : user,
    } );
    const createdPost = await post.save();

    /** 해당 사용자의 posts 목록도 업데이트 해준다 */
    user.posts.push( post );

    // await user.save();

    return {
      ...createdPost._doc ,
      _id : createdPost._id.toString(),
      /**
       * - 작성일시등은 Date 타입으로 저장되는데 GraphQL 은 읽지 못하기 때문에,
       *   String 으로 변환해주면 된다
       */
      createdAt : createdPost.createdAt.toISOString(),
      updatedAt : createdPost.updatedAt.toISOString(),
    }
  }
}
````

- 서버의 GraphQL 작업이 완료되었다면, 이제 frontend 에서 게시물 생성 요청을 보내면 된다


- 이때, 응답받는 데이터 중 중첩된 필드에서 받을 필드를 지정해서, 원하는 필드만 필터링해서 받아올 수 있다

````javascript
/** ========== frontend request ========== */
let graphqlQuery = {
          query : `
        mutation {
          createPost( postInput : { 
            title : "${ postData.title }" , 
            content : "${ postData.content }" , 
            imageUrl: "some url" 
          } ) {
            _id
            title
            content
            imageUrl
            creator {
              name
            }
            createdAt
          }
        }
      `
        }

/** 서버측 어플리케이션에 컨텐츠 전송 */
fetch( `http://localhost:8080/graphql` , {
  method : 'POST',
  body : JSON.stringify( graphqlQuery ),
  headers : {
    Authorization : `Bearer ${ this.props.token }`
  }
} )
````

- 전체 게시물을 반환할때는, 전체 게시물 뿐만아니라, 반환하는 게시물 갯수도 반환해야 하기 때문에, 


- 게시물 반환용 새로운 type 을 생성하여 반환한다

````javascript
/** ===== graphql/schema.js ===== */

const { buildSchema } = require( 'graphql' );

/** 하나의 entryPoint 를 사용하기 때문에, 이곳에 정의한다 */
module.exports = buildSchema( `

    type Post {
        _id : ID!
        title : String!
        content : String!
        imageUrl : String!
        creator : User!
        createdAt : String!
        updatedAt : String!
    }
    
    type RootQuery {
        login( email : String!, password : String! ) : AuthData!
        posts : PostData!
    }
    
    type PostData {
        posts : [ Post! ]!
        totalPosts : Int!
    }

    schema {
        query : RootQuery
        mutation : RootMutation
    }
` );
````

- 마찬가지로, resolver 에 해당 schema 에서 정의한 데이터를 반환해주면 된다

````javascript
/** ===== graphql/resolvers.js ===== */
const validator = require( 'validator' );
const User = require( '../models/user' );
const Post = require( '../models/post' );

/** 들어오는 Query 를 위해 실행되는 논리 정의 */
module.exports = {
  /** 게시물 전부 가져오기 */
  posts : async ( args , req ) => {

    /** 검증되지 않은 사용자일 경우 처리 */
    if ( !req.isAuth ){
      const error = new Error( 'Not authenticated!' );
      error.code = 401;
      throw error;
    }

    /** 전체 Post 를 가지고 온후, 전체 갯수를 반환함 */
    const totalPosts = await Post.find().countDocuments();

    const posts = await Post.find()
            /** sort : 데이터를 내림차순 정렬 - 최근에 작성된 순으로 정렬하여 반환 */
            .sort( { createdAt : -1 } )
            /** 참조 중인 User 테이블에서 creator 필드를 채워서 반환 */
            .populate( 'creator' )

    return {
      posts : posts.map( p => ( {
        ...p._doc ,
        _id : p._id.toString(),
        /**
         * - 작성일시등은 Date 타입으로 저장되는데 GraphQL 은 읽지 못하기 때문에,
         *   String 으로 변환해주면 된다
         */
        createdAt : p.createdAt.toISOString(),
        updatedAt : p.updatedAt.toISOString(),
      } ) ),
      totalPosts,
    };
  },
}
````

- 그 후, frontend 에서 아래처럼 게시물을 요청할 수 있는데, 모든 필드를 가져오고 싶다면 원하는 필드를 일일히 입력해야 하는데,


- 추후, 필드 전체를 한번에 가져올 수 있는 방법이 있는지 체크해야 한다다


- 또한, Graphql 을 이용하여 필요한 데이터만 추출하여 가지고올 수 있다

````javascript
/** ========== frontend request ========== */
let graphqlQuery = {
  query : `
    posts {
      posts {
        _id
        title
        content
        creator {
          name 
        }
        createdAt
      }
      totalPosts
    }
  `
}

/** 서버측 어플리케이션에 컨텐츠 전송 */
fetch( `http://localhost:8080/graphql` , {
  method : 'POST',
  body : JSON.stringify( graphqlQuery ),
  headers : {
    Authorization : `Bearer ${ this.props.token }`,
    'Content-Type' : 'application/json'
  }
} )
````

### pagination

- 페이지네이션의 경우 frontend 에서 보여줄 페이지 갯수와 현재 페이지를 받아 해당 값으로 계산한 페이지네이션을 구현할 수 있다


- RootQuery 에 page 파라미터를 받아 resolvers 에서 처리한다

````javascript
/** ===== graphql/schema.js ===== */

const { buildSchema } = require( 'graphql' );

/** 하나의 entryPoint 를 사용하기 때문에, 이곳에 정의한다 */
module.exports = buildSchema( `

    type Post {
        _id : ID!
        title : String!
        content : String!
        imageUrl : String!
        creator : User!
        createdAt : String!
        updatedAt : String!
    }
    
    type RootQuery {
        login( email : String!, password : String! ) : AuthData!
        posts( page : Int ) : PostData!
    }
    
    type PostData {
        posts : [ Post! ]!
        totalPosts : Int!
    }

    schema {
        query : RootQuery
        mutation : RootMutation
    }
` );
````

- resolver 에서는 전달받은 page 값을 이용하여 서버에서 skip 할 값만큼 제외하고, 


- 해당 페이지의 데이터를 조회후 frontend 에 반환한다

````javascript
/** ===== graphql/resolvers.js ===== */
const validator = require( 'validator' );
const User = require( '../models/user' );
const Post = require( '../models/post' );

/** 들어오는 Query 를 위해 실행되는 논리 정의 */
module.exports = {
  /** 해당 페이지의 게시물 가져오기 */
  posts : async ( { page } , req ) => {

    /** 검증되지 않은 사용자일 경우 처리 */
    if ( !req.isAuth ){
      const error = new Error( 'Not authenticated!' );
      error.code = 401;
      throw error;
    }

    /** page 를 전송하지 않았을 경우에는 무조건 1페이지부터 시작 */
    if ( !page ){
      page = 1;
    }
    /** 보여줄 페이지 갯수 */
    const perPage = 2;
    /** 전체 Post 를 가지고 온후, 전체 갯수를 반환함 */
    const totalPosts = await Post.find().countDocuments();

    const posts = await Post.find()
            /** sort : 데이터를 내림차순 정렬 - 최근에 작성된 순으로 정렬하여 반환 */
            .sort( { createdAt : -1 } )
            /**
             * - skip 메서드를 추가하면,
             *   find 로 찾은 결과중 첫 번째부터 skip 갯수만큼 생략한다
             */
            .skip( ( page - 1 ) * perPage  )
            /** limit 메서드는 find 로 가져오는 데이터양을 지정할 수 있다 */
            .limit( perPage )
            /** 참조 중인 User 테이블에서 creator 필드를 채워서 반환 */
            .populate( 'creator' );
    return {
      posts : posts.map( p => ( {
        ...p._doc ,
        _id : p._id.toString(),
        /**
         * - 작성일시등은 Date 타입으로 저장되는데 GraphQL 은 읽지 못하기 때문에,
         *   String 으로 변환해주면 된다
         */
        createdAt : p.createdAt.toISOString(),
        updatedAt : p.updatedAt.toISOString(),
      } ) ),
      totalPosts,
    };
  },
}
````

- frontend 에서는 받을 페이지를 전달하면, 서버에서는 해당 페이지에 맞는 데이터틀 계산해 DB 에 요청 후 반환해준다

````javascript
/** ========== frontend request ========== */
let graphqlQuery = {
  query : `
    posts( page : ${ page } ) {
      posts {
        _id
        title
        content
        creator {
          name 
        }
        createdAt
      }
      totalPosts
    }
  `
}

/** 서버측 어플리케이션에 컨텐츠 전송 */
fetch( `http://localhost:8080/graphql` , {
  method : 'POST',
  body : JSON.stringify( graphqlQuery ),
  headers : {
    Authorization : `Bearer ${ this.props.token }`,
    'Content-Type' : 'application/json'
  }
} )
````

---

### uploadImage

- GraphQL 은 JSON 데이터로만 작업할 수 있다


- 따라서, image formData 처리는, GraphQL 을 사용하는 것보다, REST API 를 사용하는 것이 효율적이다

- 이미지를 반환하는 엔드포인트에서 이미지를 저장하고 경로를 반환하게하는 것이 가장 깔끔하다

````javascript
/** ===== app.js ===== */
const path = require( 'path' );
const fs = require("fs");
const express = require( 'express' );
const multer = require( 'multer' );
const app = express();
const auth = require( './middleware/auth' );

/** 파일을 어디에 설정할지 설정 */
const fileStorage = multer.diskStorage( {
  /** multer 에서 처리한 파일을 저장할 위치 */
  destination : ( req , file , callback ) => {
    /**
     * - 첫번째 param - 에러 메시지( 존재하면, 에러가 있는것으로 판단 )
     *
     * - 두번째 param - 파일을 저장할 경로
     */
    callback( null , path.join( __dirname , 'images' ) );
  },
  /** multer 에서 처리한 파일의 파일이름 */
  filename : ( req , file , callback ) => {
    /**
     * - 첫번째 param - 에러 메시지( 존재하면, 에러가 있는것으로 판단 )
     *
     * - 두번째 param - 파일 이름
     */
    callback( null , `${ uuidv4() }-${ file.originalname }` );
  }
} );

const fileFilter = ( req , file , callback ) => {
  /**
   * - 첫번째 param - 에러 메시지( 존재하면, 에러가 있는것으로 판단 )
   *
   * - 두번째 param - 해당 파일을 저장할지 여부
   */
  if ( 'image/png' === file.mimetype ||
          'image/jpg' === file.mimetype ||
          'image/jpeg' === file.mimetype ){
    callback( null , true );
  }
  else {
    callback( null , false );
  }
}

/** image body 필드값을 가져온다 */
app.use( multer( { storage : fileStorage , fileFilter } ).single( 'image' ) );

/** GraphQL 및 REST API 동작전 token 체크 미들웨어에서 먼저 체크 */
app.use( auth );

/** put 요청으로 이미지를 받아옴 */
app.put( '/post-image' , ( req , res , next ) => {
  /** 인증되지 않았다면, return 시키고 라우트 보호 */
  if ( !req.isAuth ){
    throw new Error( 'Not authenticated!' );
  }
    
  /**
   * - 이미지를 전송하면 multer 에서 받은 이미지를 가공해서 file 객체에 넣어주기 때문에,
   *   이미지가 들어오지 않았다면 이미지가 들어오지 않았다는 응답을 보내주면 된다
   * */
  if ( !req.file ){
    return res.status( 200 ).json( { message : 'No file provided!' } )
  }

  /** 이미지 경로가 multer 에 들어왔다면( fileStorage 에 저장되었다면 ), 기존 파일에서 이미지를 제거한다 */
  if ( req.body.oldPath ){
    clearImage( req.body.oldPath );
  }
  /** 절대 경로로 저장했기 때문에 split 으로 잘라서 도메인 위치부터 불러와야 한다 */
  const fullPath = req.file.path.split( '/' );
  const imageUrl = `${ fullPath[ fullPath.length - 2 ] }/${ fullPath[ fullPath.length - 1 ] }`;
  /** 파일이 저장된 경로를 반환한다 */
  return res.status( 201 ).json( { message : 'File stored.' , filePath : imageUrl } );

} );

/**
 * - Image 삭제 헬퍼함수
 *
 * @param filePath
 */
const clearImage = filePath => {
  /** 현재 path 에서 한단계 상위로 올라가서 */
  filePath = path.join( __dirname , '..' , filePath );
  /** 파일을 삭제하고, 오류 로그를 남긴다 */
  fs.unlink( filePath , err => {
    console.log( '<< image delete error >>' , err );
  } )
};

````

- 그 후 frontend 에서는 formData 에 image 를 채워서 보내주면 된다


- frontend 에서 이미지 파일을 보낼때는 'Content-Type' : 'application/json' 필드를 제거해줘야 한다


- 해당 이미지 바이너리 데이터가 너무크기 때문에 파싱하지 못한다

````javascript
/** ========== frontend request ========== */
const formData = new FormData();
// formData.append( 'title' , postData.title );
// formData.append( 'content' , postData.content );
formData.append( 'image' , postData.image );

/** GraphQL 을 보내기전에, Image 를 저장하기 위해, 일반적인 http-request query 를 보낸다 */
fetch( `http://localhost:8080/post-image` , {
  method : 'PUT',
  headers : {
    Authorization : `Bearer ${ this.props.token }`,
  },
  body : formData
} )
  .then( res => res.json() )
  .then( fileResData => {
    /** 서버에서 전송한 filePath 필드를 가져옴 */
    const imageUrl = fileResData.filePath;

    let graphqlQuery = {
      query : `
              mutation {
                createPost( postInput : { 
                  title : "${ postData.title }" , 
                  content : "${ postData.content }" , 
                  imageUrl: "${ imageUrl }" 
                } ) {
                  _id
                  title
                  content
                  imageUrl
                  creator {
                    name
                  }
                  createdAt
                }
              }
            `
    }

    /** 서버측 어플리케이션에 컨텐츠 전송 */
    return fetch( `http://localhost:8080/graphql` , {
      method : 'POST',
      headers : {
        Authorization : `Bearer ${ this.props.token }`,
        'Content-Type' : 'application/json'
      },
      body : JSON.stringify( graphqlQuery ),
    } ) 
  } );
````

---

### getPost

- 게시물 단건 가져오기


- 단건의 게시물을 가져올때는, 서버 Schema 에 단건 게시물을 정의해주고, 프론트에서 해당 graphQL 에 요청하면 된다


- schema 에 가져올 post 를 정의해야 entryPoint 로 이용할 수 있다

````javascript
/** ===== graphql/schema.js ===== */

const { buildSchema } = require( 'graphql' );

/** 하나의 entryPoint 를 사용하기 때문에, 이곳에 정의한다 */
module.exports = buildSchema( `

    type Post {
        _id : ID!
        title : String!
        content : String!
        imageUrl : String!
        creator : User!
        createdAt : String!
        updatedAt : String!
    }
    
    type RootQuery {
        login( email : String!, password : String! ) : AuthData!
        posts( page : Int ) : PostData!
        post( id : ID! ) : Post!
    }
    
    type PostData {
        posts : [ Post! ]!
        totalPosts : Int!
    }

    schema {
        query : RootQuery
        mutation : RootMutation
    }
` );
````

- 그 후, 해당 post 의 데이터를 처리할 Resolver 를 추가해준다

````javascript
/** ===== graphql/resolvers.js ===== */
const validator = require( 'validator' );
const User = require( '../models/user' );
const Post = require( '../models/post' );

/** 들어오는 Query 를 위해 실행되는 논리 정의 */
/** id 로 단일 게시물 가져오기 */
post : async ( { id } , req ) => {
  /** 검증되지 않은 사용자일 경우 처리 */
  if ( !req.isAuth ){
    const error = new Error( 'Not authenticated!' );
    error.code = 401;
    throw error;
  }

  const post = await Post.findById( id )
          /** 참조 중인 User 테이블에서 creator 필드를 채워서 반환 */
          .populate( 'creator' );

  /** 가져온 게시물이 없다면 에러를 띄운다 */
  if ( !post ){
    const error = new Error( 'No post found!' );
    error.code = 404;
    throw error;
  }

  return {
    ...post._doc,
    _id : post._id.toString(),
    createdAt : post.createdAt.toISOString(),
    updatedAt : post.updatedAt.toISOString(),
  }
}
````

- frontend 에서는 해당 메시지를 보낼때, graphql 에 요청하도록하면 된다


- 요청을 보낼때 헷갈리지말아야할게 rootQuery 는 문자열로 반드시 {} 객체로 감싸야한다...
  - 이거 깜빡해서 한참찾음...


````javascript
/** ========== frontend request ========== */
const postId = this.props.match.params.postId;
const graphqlQuery = {
          query : `
            {
                post( id : "${ postId }" ) {
                    title
                    content
                    imageUrl
                    creator {
                      name
                    }
                    createdAt
                }
            }
        `
        }
fetch(`http://localhost:8080/graphql`, {
  method : 'POST',
  headers : {
    Authorization : `Bearer ${ this.props.token }`,
    'Content-Type' : 'application/json'
  },
  body : JSON.stringify( graphqlQuery )
} );
````