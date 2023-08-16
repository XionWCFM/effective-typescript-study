# 타입스크립트의 타입시스템

> _**타입스크립트의 가장 중요한 역할은 타입시스템에 있다.**_

| 타입시스템이란 무엇인가?                  |
| ----------------------------------------- |
| 타입 시스템을 어떻게 사용해야할까?        |
| 무엇을 결정해야하는가?                    |
| 가급적 사용하지 말아야할 기능은 무엇일까? |

### 타입이 값들의 집합이라고 생각하기

{% hint style="info" %}
**never 타입은 언제 사용하는 걸까?**

- 아무 값도 포함하지 않는 **공집합**
- never 타입으로 선언된 변수에는 아무런 값도 할당할 수 없다.

```typescript
function hello(): never {
  throw new Error('Error');
}
```

_**never는 따로 return하지 않고, 오류를 발생시키는 함수에 타입을 지정할 때 사용한다.**_

**unknown**

- 변수의 타입을 모를때 unknown으로 지정할 수 있다.

```typescript
let a: unknown;
if (typeof a === number) {
  let b = a + 1;
}
```

<mark style="color:red;">**any와 unknown를 분리해놓은 이유가 무엇일까?**</mark>

이 둘의 차이점은 무엇일까? any와 unknwon 둘 다 모든 타입을 허용하는 것은 동일하다. 하지만 any를 사용하게 되면 타입검사를 느슨하게 하므로 개발과정에서 오류를 발생시키지 않는다. 반면 unknown의 경우에는 프로퍼티를 사용하거나 연산을 하게 될 경우, 타입체크를 하게된다. 그러므로 문제가 되는 코드를 미리 예방할 수 있다.
{% endhint %}

#### union, 합집합

```typescript
type A = 'A';
type B = 'B';
type Twlve = 12;

type AB = 'A' | 'B';
type AB12 = 'A' | 'B' | 12;
```

#### intersection, 교집합

> _타입 연산자는 인터페이스의 속성이 아닌, **값의 집합**에 적용된다._

```typescript
interface Person {
  name: string;
}
interface Lifespan {
  birth: Date;
  death?: Date;
}
type PersonSpan = Person & Lifespan;

const ps: PersonSpan = {
  name: 'Alan',
  birth: new Date('1912/12/01'),
  death: new Date('2023/08/11'),
}; // ok
```

- 세 개의 속성보다 더 많은 값을 가지더라도 PersonSpan 타입에 속한다.
- 인터섹션 타입의 값은 각 타입 내의 속성을 모두 포함하는 것이 일반적인 규칙

{% hint style="info" %}
**typeof / keyof의 차이점**

**`typeof`**

: 데이터를 데이터 타입으로 변환해주는 연산자

```typescript
let str1 = 'hello';
let str2: typeof str = 'hi';
// === let str2: string ="hi"
```

**`keyof`**

: 객체 형태의 타입을, 따로 속성들만 뽑아 모아 **유니온** 타입으로 만들어주는 연산자

```typescript
type Type = {
  name: string;
  age: number;
  married: boolean;
};

type Union = keyof Type;
// type Union = name | age | married
```

{% endhint %}

유니온 타입에서는 다르게 동작한다.

```typescript
type K = keyof (Person | Lifespan); // never
```

유니온 타입에 속하는 값은 어떠한 키도 없기 때문에 유니온에 대한 keyof는 공집합(never)이어야만 한다.

```typescript
keyof (A&B) = (keyof A) | (keyof B)
keyof (A|B) = (keyof A) & (keyof B)
```

---

### 타입 공간과 값 공간의 심벌 구분하기

심벌(symbol)은 타입 공간이나 값 공간 중의 한 곳에 존재한다. (이 문장만으로는 정확하게 이해가 가지 않으니, 예시를 살펴보자.)

```typescript
interface Cylinder {
  radius: number;
  height: number;
}

const Cylinder = (radius: number, height: number) => ({ radius, height });
```

- interface Cylinder에서 Cylinder는 타입
- const Cylinder에서 Cylinder와 이름은 같지만 값으로 사용하고 있으며, 아무런 관련이 없다.
- 이런 점이 가끔 오류를 야기함

```typescript
function CalculateVolume(shape: unknown) {
  if (shape instanceof Cylinder) {
    return shape.radius;
  }
}
```

<figure><img src="../../.gitbook/assets/스크린샷 2.png" alt=""><figcaption></figcaption></figure>

- instanceof는 런타임 연산자로 값에 대해서 연산을 한다.
- 그렇기 때문에 타입이 아닌 함수를 참조한다.

> _**class와 enum은 상황에 따라 타입과 값 두 가지 모두 가능한 예약어**_

```typescript
class Cylinder {
  radius: number;
  height: number;
}

function calculateVolume(shape: unknown) {
  if (shape instanceof Cylinder) {
    shape; // ok, type은 Cylinder
    shape.radius; // ok, type은 number
  }
}
```

- 클래스가 타입으로 쓰일 때는 속성과 메서드가 사용된다.
- 반면에 값으로 쓰일 때는 생성자가 사용된다. (표로 만들기)

#### 연산자 typeof도 다른 기능을 한다.

- 타입으로 쓰일 때는 타입을 반환한다.
- 값으로 쓰일 때는 런타임의 typeof 연산자가 된다.

```typescript
function email(p: Person, subject: string, body: string): Response {}

type T1 = typeof p; // type은 Person
type T2 = typeof email; // type은 (p: Person, subject: string, body: string) => Response

const v1 = typeof p; // 값은 object
const v2 = typeof email; // 값은 function
```

#### 두 공간 사이에서 다른 의미를 가지는 코드패턴들

|         | 값                       | 타입                                                                                           |
| ------- | ------------------------ | ---------------------------------------------------------------------------------------------- |
| this    | 자바스크립트 키워드 this | 다형성(polymorphic) this라고 불리는 this의 타입스크립트 타입                                   |
| &와 \|  | 비트 연산                | 인터섹션과 유니온                                                                              |
| const   | 변수 선언                | 리터럴 또는 리터럴 표현식의 추론된 타입을 바꿈                                                 |
| extends | `class A extends B`      | <p><code>interface A extends B </code> 또는<br><code>Generic&#x3C;T extends number></code></p> |
| in      | for(key in object)       | 매핑된 타입                                                                                    |

_<mark style="color:red;">**타입스크립트가 정상적으로 동작하지 않는다면 타입 공간과 값 공간을 혼동해 잘못 작성했을 가능성이 크다.**</mark>_

이 코드의 문제점은 무엇일까?

```typescript
export default function eamil({
  person: Person,
  subject: string,
  body: string,
}) {}
```

<figure><img src="../../.gitbook/assets/스크린샷 3.png" alt=""><figcaption></figcaption></figure>

- 값의 관점에서 Person과 string이 해석되었기 때문
- Person이라는 변수명과 string이라는 이름을 가지는 두 개의 변수를 생성하려한 것

문제를 해결하려면 어떻게 해야할까? **타입과 값을 구분**해야한다.

```typescript
function eamil({
  person,
  subject,
  body,
}: {
  person: Person;
  subject: string;
  body: string;
}) {}
```

---

### 타입 단언보다는 타입 선언을 사용하기

{% hint style="success" %}
**변수에 값을 할당하고 타입을 부여하는 방법**

1. 타입 단언
2. 타입 선언
   {% endhint %}
