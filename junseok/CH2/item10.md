# 2장 타입스크립트의 타입 시스템

## ITEM10. 객체 래퍼 타입 피하기(avoid-object-wrapper-types)

자바스크립트는 6가지 원시 타입(string, boolean, number, null, undefined, symbol)이 있습니다. 이들은 불변이며 메서드를 가지고 있지 않습니다. 하지만 마치 `'string'.length; 'string'.toUpperCase()` 등으로 프로퍼티 혹은 메서드가 있는 것 같아 보입니다. 이때 자바스크립트에서 적용되는 개념이 **래퍼 객체**입니다. 원시 타입을 활용해 메서드로 호출을 한다면, 기본형을 래퍼 객체(Stringm Boolean, Number)로 래핑하고, 메서드를 호출하고, 마지막에 래핑한 객체를 버립니다.


타입스크립트는 기본적으로 기본형과 객체 래퍼 타입을 별도로 모델링 합니다. 
- string과 String
- number와 Number
- boolean과 Boolean
- symbol과 Symbol
- bigint와 BigInt

따라서 string과 String 타입을 혼동하면 안됩니다. 이 둘을 혼동할 시 다음과 같은 문제가 발생할 수 있습니다. 
```ts
function isGreeting(phrase: String) {
  return [
    'hello',
    'good day'
  ].includes(phrase);
          // ~~~~~~
          // Argument of type 'String' is not assignable to parameter
          // of type 'string'.
          // 'string' is a primitive, but 'String' is a wrapper object;
          // prefer using 'string' when possible
}
```
string은 String에 할당할 수 있지만, String은 string에 할당할 수 없습니다. 