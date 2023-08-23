## 1장
### 아이템 1 :TS와 JS의 관계 이해
타입스크립트는 JS의 슈퍼셋이며 고수준의 언어,JS로 트랜스파일하며, JS로 실행하는 특징을 가졌습니다. 문법의 유효성과 동작 이슈는 독립적인 문제로 바라보는 경향이 있어 코드상에 오류가 있더라도 타입체킹이 통과된다면 JS로 변환이 가능합니다. 모든 자바스크립트는 타입스크립트이지만, 일부 자바스크립트(그리고 타입스크립트)만이 타입 체크를 통과합니다.
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
어떻게 설정하느냐에 따라 완전히 다른 언어처럼 느껴질 수 있기 때문에 `noImplicitAny` 와 `strictNullChecks`를 이해봅시다. `noImplicitAny` 는 변수들이 미리 정의된 타입을 가져야 하는지 여부를 제어합니다. 만약 `noImplicitAny`가 true로 설정되었다면 명시적으로 :any라고 선언해 주거나 분명한 타입의 사용으로 오류를 막아야 합니다. 
```json
{
  "complierOptions" :{
    "noImplicitAny": true
  }
}
```
`strictNullChecks`는 null과 undefined가 모든 타입에서 허용되는 지 확인하는 설정입니다. 
```js
const x: number =null;
// `strictNullChecks` 미설정시 유효하나, 설정하면 오류가 발생합니다.
// ~ "null"의 형식은 'number'형식에 할당할 수 없습니다. 
```
