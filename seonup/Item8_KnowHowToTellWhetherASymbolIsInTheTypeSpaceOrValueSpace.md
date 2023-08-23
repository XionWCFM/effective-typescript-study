# 아이템8. 타입 공간과 값 공간의 심벌 구분하기

타입의 영역이나 값의 영역 중 한 곳에 존재하는 타입스크립트의 심벌(symbol)은 심벌은 이름이 같더라도 속하는 영역에 따라 다른 것을 나타낼 수 있기 때문에 혼란을 야기할 수 있다. 때문에 타입 공간과 값의 공간, 두 곳에서 사용되지만 다르게 쓰이는 것을 구별하여 사용할 수 있어야 한다.

## 다르게 쓰이는 경우

### `typeof`

연산자 중에서 타입으로 쓰일 때와 값에서 쓰일 때 다른 기능을 하는 것들이 있다. 그 중 typeof가 있다.

- 타입에서: 값을 읽어서 타입스크립트의 타입을 반환함.
- 값에서: 자바스크립트 런타임의 typeof 연산자가 됨.

```ts
class Cylinder {
  radius = 1;
  height = 1;
}

/**
 * 값으로 해석되는 경우로, 런타임에 자바스크립트의 typeof 연산자로 읽힘.
 * (런타임 타입: "string" | "number" | "bigint" | "boolean" | "symbol" | "undefined" | "object" | "function")
 *
 * 출력: const v = function
 */
const v = typeof Cylinder;

/**
 * 클래스 자체는 생성자 함수이기 때문에 타입으로 해석되는 경우 인스턴스 객체 타입이 아닌 생성자 함수로 해석됨
 *
 * 출력: type T = typeof Cylinder
 */
type T = typeof Cylinder;

/**
 * 클래스를 인스턴스 타입으로 전환하기 위해서는 InstanceType 연산자를 사용해야 함.
 *
 * 출력: type C = Cylinder
 */
type C = InstanceType<typeof Cylinder>;
```

### 그 외

|         | 값                         | 타입                                                                                                        |
| ------- | -------------------------- | ----------------------------------------------------------------------------------------------------------- |
| this    | 자바스크립트의 this 키워드 | 다형성(polymorphic) this 라고 불리는 thisdml 타입스크립트 타입. 서브클래스의 메서드 체인을 구현할 때 유용함 |
| &       | AND 비트 연산자            | 인터섹션                                                                                                    |
| \|      | OR 비트 연산자             | 유니온                                                                                                      |
| const   | 변수 선언                  | const 어서션. 리터럴 또는 리터럴 표현식의 추론된 타입을 변경함                                              |
| extends | 서브클래스 정의            | 서브 타입, 제너릭 타입의 한정자 정의                                                                        |

## 동일하게 쓰이는 경우

### 속성 접근자(`[]`)

속성 접근자(`[]`)는 값이나 타입에서 사용될 때 모두 객체의 속성값에 접근할 수 있는 동일한 기능을 한다. 타입스크립트에서는 객체의 속성을 타입으로 사용하고자 하면 반드시 속성 접근자(`[]`)를 사용해야 한다.

```ts
const first: Person['first'] = p['first'];
```

타입스크립트에서는 닷 연산자(`.`)로 type의 속성에 접근할 수 없다. interface나 type으로 선언된 타입은 실제 프로퍼티를 가지고 있는 객체가 아니기 때문에 타입의 속성에 접근하려면 타입스크립트가 지정한 속성 접근자(`[]`)로 접근해야 한다.

```ts
interface Person {
  first: string;
  last: string;
}

const p: Person['first'] = ''; //=> const p: string;
const p2: Person.first = ''; //=> ts Error: Cannot access 'Person.first' because 'Person' is a type, but not a namespace.
```
