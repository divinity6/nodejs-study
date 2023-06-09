## Workflow

- Debugging & Easier Development

---

### NPM 스크립트

- Node.js 프로젝트에 몇가지 스크립트를 정의해서, 


- 직접 node 로 실행하는 것이 아니라 npm 을 이용해 도움을 받을 수 있다


- npm 을 이용하여 node 의 초기 프로젝트 설정을 할 수 있다

---

### package.json


- script 값에 원하는 명령어를 추가하여 손쉽게 사용할 수 있다


- start 는 특별한 경우라서 npm start 로 바로 실행이 가능하지만, 


- 다른 스크립트 명령어들을 추가하면 run 을 붙여야한다


- 다른 npm 패키지들은 npm Repository 라는 클라우드 패키지 저장소를 이용해 사용할 수 있다 


- npm i 로 라이브러리를 설치하면 node_modules 에 설치한 모듈의 dependencies 패키지들도 전부 설치가 된다


- terminal 에서 nodemon 패키지를 설치해도 **nodemon 명령어를 사용할 수 없다**


- **Terminal 은 기본적으로 전역( global dependency )에서 해당 명령을 검색**하기 때문에 package.json 의 script 에 명령어로 추가해줘야 사용할 수 있다
  - ( script 는 로컬에서 검색 후 해당 패키지를 실행한다 )

---

### Types of Errors

- Syntax Errors
  - 가장 많이 발생하는 오류 유형


- Runtime Errors
  - 코드 실행이 멈춰버리는 유형


- Logical Errors
  - 가장 찾아내기 어려움
  - 앱은 제대로 작동하지 않지만, 오류 메시지는 뜨지 않을 경우

---

### nodemon

- nodejs 환경에서 디버깅 중이나 실행 중 변경사항이 일어날 경우 자동으로 서버를 재시작해준다


- configuration : nodemon 설치경로 입력 
  - 예) Node parameter : node_modules/nodemon/bin/nodemon.js

---

- Node.js 디버깅에 대한 추가 정보:
  - https://nodejs.org/en/docs/guides/debugging-getting-started/



- Visual Studio Code에서 노드 디버깅하기: 
  - https://code.visualstudio.com/docs/nodejs/nodejs-debugging