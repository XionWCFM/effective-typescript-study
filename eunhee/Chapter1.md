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
```ts
const y = undefined; //허용
const x :number = null; //오류
const heell :number = undefined; //오류
const heell2 :number|undefined = undefined; //해결
```
JS 프로젝트를 TS로 마이그레이션 하는 것이 아니라면 "noImplicitAny"를 설정하는 게 좋고 "undefined는 객체가 아닙니다" 같은 런타입 오류 방지를 위해 "strictNullChecks"를 설정하는 게 좋고 업격한 타입 체크를 원한다면 strict 설정을 하면 됩니다. 

### 아이템 3 :코드 생성과 타입은 관계없음
타입스크립트 컴파일러 역할로 1. 최신 타입스크립트/자바스크립트를 브라우저에서 동작할 수 있도록 구버전의 자바스크립트로 트랜스파일합니다. 2. 코드의 타입 오류를 체크합니다. 이 두 역할은 독립적이여서 타입 오류가 있는 코드도 컴파일이 가능합니다. 그래서  코드에 오류가 있을 때 " 컴파일에 문제가 있다" 라고 말하는 경우는 기술적으로 틀린 말입니다. 타입 오류가 있는 데도 컴파일되는 것은 문제가 된 오류를 수정하지 않더라도 애플리케이션의 다른 부분을 테스트할 수 있는 이점이 있습니다. 만약 `noEmitOnError`를 설정하면 오류가 있을 때 컴파일하지 않습니다. 
```json
{
  "complierOptions" :{
    "noEmitOnError": true
  }
}
```
### 런타임에는 타입 체크가 불가능
instanceof 체크는 런타임에 일어나나, Rectangle 타입은 런타임 이전인 자바스크립트로 컴파일되는 과정에서 제거되버리기 때문에 다음과 같이 코드를 짤 수 없습니다. 
*자바스크립트로 컴파일되는 과정에서 모든 인터페이스, 타입, 타입구문은 제거가된이후 런타임단계로 넘어갑니다. 
```ts
//오류가 나는 코드 
interface Square {
  width:number;
}
interface Rectangle extends Square {
  height:number;
}
type Shape = Square | Rectangle;

function cal(shape: Shape){
  if(shape instanceof Rectangle){ //Rectangle는 타입으로 자바스크립트 컴파일 하는 과정에서 제거되므로 로직에 관여해선 안된다. 
    return shape.width * shape.height;
  }else{
    return shape.width * shape.width;
  }
}
```
속성 체크는 런타임에 접근 가능한 값에만 관련되지만, 타입 체커 역시도 shape의 타입을 Rectangle 로 보정해주기 때문에 오류가 사라집니다. 
```ts
//해결코드
function cal(shape: Shape){
  if("height" in shape){ //shape 변수안에 height이 있다면 타입이 Rectangle로 가정
    return shape.width * shape.height;
  }else{
    return shape.width * shape.width;
  }
}
```
"태그 기법"
```ts
interface Square {
  kind : 'square';
  width:number;
}

interface Rectangle  {
  kind:'rectangle'; //태그된 유니온 
  height:number;
  width: number;
}

type Shape = Square | Rectangle;

function cal(shape: Shape){
  if(shape.kind === "rectangle"){
    return shape.width * shape.height;
  }else{
    return shape.width * shape.width;
  }

}
```
클래스 : 타입(런타임 접근 불가)과 값(런타임 접근 가능)을 둘 다 사용하는 기법
```ts
class Square {
 constructor( public width: number){

 }}
 class Rectangle extends Square {
 constructor(public width: number, public height : number){
  super(width);
 }

 }


type Shape = Square | Rectangle;

function cal(shape: Shape){
  if(shape instanceof Rectangle){
    return shape.width * shape.height;
  }else{
    return shape.width * shape.width;
  }

}
```
type Shape = Square | Rectangle 부분에서 Rectangle은 타입으로 참조되지만, shape instanceof Rectangle 부분에서는 값으로 참조된다. 
- 타입과 타입 연산자는 자바스크립트 변환 시점에 제거되기 때문에 타입스크립트 타입은 런타임 성능에 영향을 주지 않습니다. 따라서 타입스크립트 타입을 런타임에 사용할 수 없습니다.
### 4. 구조적 타이핑에 익숙해지기
자바스크립트의 덕타이핑, 구조적 타이핑을 이해한 상태로 작성해야 합니다. 함수를 작성할 때 호출에 사용되는 매개변수의 속성들이 매개변수의 타입에 선언된 속성만 가질 거라 생각하기 쉽습니다. 하지만 이러한 타입은 "봉인된"/"정확한"타입이라고 불리며, TS 타입 시스템에서는 표현할 수 없습니다. 
### 5. any 타입 지양하기 
any 타입에는 타입 안정성이 없고 함수 *시그니처를 무시합니다. any를 쓰면 쉽게 타입오류를 해결할 수 있지만 자동완성이 지원되지 않고, 진짜 문제점을 감추며, 타입 시스템의 신뢰도를 떨어뜨립니다.

*TypeScript 함수 시그니처는 함수의 매개변수와 반환값의 타입을 정의하는 방법입니다.
