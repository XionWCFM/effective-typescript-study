## 1장
### 아이템 1 :TS와 JS의 관계 이해
타입스크립트는 JS의 슈퍼셋이며 고수준의 언어,JS로 트랜스파일하며, JS로 실행하는 특징을 가졌습니다. 문법의 유효성과 동작 이슈는 독립적인 문제로 바라보는 경향이 있어 코드상에 오류가 있더라도 JS로 변환이 가능합니다. 모든 자바스크립트는 타입스크립트이지만, 일부 자바스크립트(그리고 타입스크립트)만이 타입 체크를 통과합니다.
<img src="https://www.dgmunit1.com/static/d471854b8ba722df848a7d2f2c49e092/a430b/typechecker.jpg" alt="모든 자바스크립트는 타입스크립트이지만, 일부 자바스크립트(그리고 타입스크립트)만이 타입 체크를 통과">

```js
const a = null +7;
// JS는 오류 x -> 7, TS에서 오류 0
const b = [] +12;
// JS는 오류 x -> '12', TS에서 오류 0
aler('Hello','TypeScript');
// JS는 오류 x -> 'Hello' 그리고 경고 표시, TS에서 오류 0 -> "0-1개의 인수가 필요한데 2개를 가져왔습니다."
```

### 아이템 2 :TS 설정 이해
타입스크립트 설정은 커맨드 라인을 이용하기 보다 협업시 설정들을 쉽게 파악할 수 있는`tsconfig.json`파일을 사용하는 것이 좋고`noImplicitAny` 는 변수들이 미리 정의된 타입을 가져야 하는지 여부를 제어합니다. 만약 `noImplicitAny`가 true로 설정되었다면 명시적으로 :any라고 선언해 주거나 분명한 타입의 사용으로 오류를 막아야 합니다. 
```json
{
  "complierOptions" :{
    "noImplicitAny": true
  }
}
```
`strictNullChecks`는 null과 undefined가 모든 타입에서 허용되는 지 확인하는 설정입니다.`strictNullChecks` 설정시  `noImplicitAny` 를 먼저 설정해야 하며, null과 undefined사용시 의도를 명시적으로 드러내야 합니다.
```json
{
  "complierOptions" :{
    "strictNullChecks": true
  }
}
```
```js
const x: number =null;
// `strictNullChecks` 미설정시 유효하나, 설정하면 오류가 발생합니다.
// ~ "null"의 형식은 'number'형식에 할당할 수 없습니다.
const x: number|null =null;
```
JS 프로젝트를 TS로 마이그레이션 하는 것이 아니라면 "noImplicitAny"를 설정하는 게 좋고 "undefined는 객체가 아닙니다" 같은 런타입 오류 방지를 위해 "strictNullChecks"를 설정하는 게 좋고 업격한 타입 체크를 원한다면 strict 설정을 하면 됩니다. 

### 아이템 3 :코드 생성과 타입은 관계없음
타입스크립트 컴파일러 역할로 1. 최신 타입스크립트/자바스크립트를 브라우저에서 동작할 수 있도록 구버전의 자바스크립트로 트랜스파일합니다. 2. 코드의 타입 오류를 체크합니다. 이 두 역할은 독립적이여서 타입 오류가 있는 코드도 컴파일이 가능합니다. 오직 코드 생성만이 "컴파일"이라고 할 수 있기 때문에 코드에 오류가 있을 때 " 컴파일에 문제가 있다" 라고 말하는 경우는 기술적으로 틀린 말입니다. 타입 오류가 있는 데도 컴파일되는 것은 문제가 된 오류를 수정하지 않더라도 애플리케이션의 다른 부분을 테스트할 수 있는 이점이 있습니다. 만약 `noEmitOnError`를 설정하면 오류가 있을 때 컴파일하지 않습니다. 



