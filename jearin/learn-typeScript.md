# 타입스크립트 알아보기

### 타입스크립트 설정 이해하기

tsconfig.json에서 compilerOptions을 설정할 수 있다. 그 중 `noImplicitAny`와 `strictNullChecks`를 이해해놓자.

#### **`noImplicitAny`**

타입을 명시할 수 있도록 도와주는 옵션. 명시되지 않은 타입을 타입스크립트가 추론할 때 any 로 추론하게 되면 컴파일 에러를 발생시킨다.

```json
"noImplicitAny": true
```

<figure><img src="../../.gitbook/assets/스크린샷.png" alt=""><figcaption></figcaption></figure>

타입스크립트는 타입 정보를 가질 때 가장 효과적이기 때문에 되도록이면 noImplicitAny를 설정하고 시작하는 것이 좋다.

#### **`strictNullChecks`**

null과 undefined가 모든 타입에서 허용되는지 확인하는 설정이다.

```json
"strictNullChecks": true
```

true로 설정되어 있는 경우, 명시된 타입과 다르게 null을 넣었을 때 에러를 발생시킨다. (undefined 동일)

<figure><img src="../../.gitbook/assets/스크린샷 (2).png" alt=""><figcaption></figcaption></figure>

argument가 number 또는 null이라면 명시적으로 드러내야한다.

```typescript
const x: number | null = null;
```

---

### 코드 생성과 타입이 관계없음을 이해하기

컴파일러는 두 가지 동작을 수행한다

1. 타입스크립트 문법을 자바스크립트 문법으로 변환하기
2. 타입오류 체크하기

{% hint style="warning" %}
**타입 오류가 있는 코드도 컴파일이 가능하다**

\
_<mark style="color:red;">**컴파일은 타입 체크와 독립적으로 이뤄지기 때문에 가능하다.**</mark>_ 하지만 문제가 있는 코드를 컴파일하는 건 문제가 있지 않을까? 그래서 오류가 있을 때 컴파일하지 않게 하려면 tsconfig.json에 `noEmitOnError`를 설정하거나 빌드 도구에 동일하게 적으면 된다.
{% endhint %}

#### 런타임에는 타입체크가 불가능하다.

런타임 시점에 타입스크립트 타입은 모두 제거되어버린다. 그렇기 때문에 타입을 명확하게 하려면 런타임에 타입 정보를 유지하는 방법이 필요하다.

{% hint style="info" %}

#### 런타임에 타입 정보를 유지하는 방법

- 타입 속성이 존재하는지 체크
- 런타임에 접근가능한 타입 정보를 명시적으로 저장하는 '태그' 기법

```typescript
interface Square {
  kind: 'square';
  width: number;
}
interface Rectangle {
  kind: 'rectangle';
  height: number;
  width: number;
}
type Shape = Square | Rectangle;

function calculate(shape: Shape) {
  if (shape.kind === 'rectangle') {
    shape;
    return shape.width * shape.height;
  } else {
    shape;
    return shape.width * shape.width;
  }
}
```

- 클래스로 만들어 타입과 값을 둘 다 사용하는 방법
  {% endhint %}

---

### 구조적 타이핑에 익숙해지기

구조적 타이핑이 무엇을 의미하는걸까?&#x20;

구조적 타이핑이란 객체 어떤 타입에 부합하는 변수와 메서드를 가질 경우, 객체를 해당 타입에 속하는 것으로 간주하는 방식이다.&#x20;

```typescript
const person1 = {
  name: 'Alice',
  age: 30,
  greet: function () {
    console.log(
      `Hello, my name is ${this.name} and I'm ${this.age} years old.`
    );
  },
};

const person2 = {
  name: 'Bob',
  age: 25,
  greet: function () {
    console.log(`Hi there! I'm ${this.name} and I'm ${this.age} years old.`);
  },
};

function printPersonInfo(person) {
  console.log(`Name: ${person.name}, Age: ${person.age}`);
}

// Both 'person1' and 'person2' have the same structure
printPersonInfo(person1); // Output: Name: Alice, Age: 30
printPersonInfo(person2); // Output: Name: Bob, Age: 25
```

printPersonInfo 함수에는 person 매개변수에 대한 특정 클래스나 타입 선언이 필요하지 않다. 객체에 속성 이름과 나이만 있으면 이 함수에 전달해서 활용할 수 있다.

이러한 구조적 타이핑을 통해서 유연하고 재사용 가능한 코드를 만들 수 있다. 하지만 객체에 예상되는 속성이나 메서드가 없는 경우 예기치 않은 동작이 발생할 수 있다는 단점이 있다.&#x20;

---

### any 타입 지양하기

> _**특별한 경우가 아니면 any를 사용하지 말자! any는 위험한 존재다.**_ \
>
> 1. any 타입에는 **타입 안정성**이 없다.
> 2. any는 **함수 시그니처**를 무시해버린다.&#x20;
> 3. any 타입에는 **언어 서비스**가 적용되지 않는다.&#x20;
> 4. any 타입은 코드 리팩토링 때 버그를 감춘다.
> 5. any는 **타입 설계**를 감춰버린다.&#x20;
> 6. any는 타입시스템의 신뢰도를 떨어뜨린다.&#x20;

as any를 사용하게 되면 number 타입으로 선언했음에도 불구하고, string 타입을 할당할 수 있게된다.&#x20;

```typescript
let age: number;
age = '12'; // Type 'string' is not assignable to type 'number'.
age = '12' as any; // ok
age += 1; // 런타임엔 정상이지만, age는 "121"이 된다.
```

_<mark style="background-color:yellow;">**함수 시그니처**</mark>_

호출하는 쪽은 약속된 타입의 입력을 제공하고, 함수는 약속된 타입의 출력을 반환한다. \
그러나 any를 사용하면 이런 약속을 어길 수 있다.&#x20;

```typescript
function calculateAge(birthDate: Date): number {
  //...
}

let birthDate: any = '1990-01-01';
calcualteAge(birthDate);
```

birthDate 매개변수는 string이 아닌 Date 타입이어야한다. 하지만 any를 사용하게 되는 경우 calculateAge의 시그니처를 무시하게 되는 것이다.&#x20;
