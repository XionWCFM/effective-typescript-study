# 2장 타입스크립트의 타입 시스템

## ITEM8. 타입 공간과 값 공간의 심벌 구분하기
- 타입스크립트의 심벌(symbol)은 타입 공간이나 값 공간 중의 한 곳에 존재합니다.
- 일반적으로 `type`, `interface` 다음에 나오는 심벌은 타입인 반면, const나 let 선언에 쓰이는 것은 값입니다.
- `class`, `enum`은 상황에 따라 타입과 값 두 가지 모두 가능한 예약어입니다.
    - `class`가 타입으로 쓰일 때는 *형태*가 사용되는 반면, 값으로 쓰일 때는 *생성자*가 사용됩니다. 
- 연산자 중에서 타입에서 쓰일 때와 값에서 쓰일때 다른 기능을 하는 것들이 있습니다. 대표적인 예는 **`typeof`** 입니다.
    - typescript 관점에서 `typeof`는 값을 읽어서 타입을 반환합니다. 
    - 값의 관점에서 `typeof`는 자바스크립트 런타임의 typeof 연산자가 됩니다. 이는 런타임 타입을 가리키는 **문자열**을 반환합니다.
    - 속성 접근자 []는 타입으로 쓰일 때에도 동일하게 동작합니다. 하지만 `obj['filed']`, `obj.filed`는 값이 동일하더라도 타입은 다를 수 있습니다.  따라서 타입의 속성을 얻을 때에는 반드시 첫 번째 방법(`obj['filed']`)을 사용합니다.

```ts
interface Person {
  first: string;
  last: string;
}
const p: Person = { first: 'Jane', last: 'Jacobs' };
//    -           --------------------------------- Values
//       ------ Type
function email(p: Person, subject: string, body: string): Response {
  //     ----- -          -------          ----  Values
  //              ------           ------        ------   -------- Types
  // COMPRESS
  return new Response();
  // END
}

class Cylinder {
  radius=1;
  height=1;
}

function calculateVolume(shape: unknown) {
  if (shape instanceof Cylinder) {
    shape  // OK, type is Cylinder
    shape.radius  // OK, type is number
  }
}

type T1 = typeof p;  // Type is Person
type T2 = typeof email;
    // Type is (p: Person, subject: string, body: string) => Response

const v1 = typeof p;  // Value is "object"
const v2 = typeof email;  // Value is "function"

```