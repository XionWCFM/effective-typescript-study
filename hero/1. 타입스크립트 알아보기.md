## 타입스크립트와 자바스크립트의 관계

타입스크립트는 자바스크립트의 상위 집합라고 할 수 있지만, 반대는 성립하지 않습니다.
- 자바스크립트 파일은 js(jsx), 타입스크립트 파일은 ts(tsx)지만 타입스크립트는 자바스크립트의 상위 집합이기 때문에 js 코드는 ts라고 할 수 있습니다. 이것은 js에서 ts로 마이그레이션할 때 굉장한 이점이 됩니다.

타입스크립트는 자바스크립트의 런타임 동작을 모델링하는 시스템이기 때문에 런타임 오류를 발생시키는 오류를 찾습니다. 하지만 모든 오류를 찾아내지는 못합니다.
- 타입스크립트는 자바스크립트 동작을 모델링하지만, 자바스크립트에서 허용되는 동작이 타입스크립트에서는 오류가 되는 경우가 있으므로 이런 엄격함은 취향 차이입니다.

<br>

---

<br>

## 타입스크립트 설정 이해하기

타입스크립트 컴파일러는 매우 많은 설정을 가지고 있고, 어떻게 설정하는냐에 따라 다른 언어처럼 느껴질 수 있습니다.
많은 설정 중에서 noImplicitAny, strictNullChecks는 꼭 이해하는 것이 좋습니다.

### noImplicitAny

이 설정은 변수들이 미리 정의된 타입을 가져야 하는지를 제어합니다.
```ts
function add(a, b) {
  return a + b;
}
// noImplicitAny 설정이 해제되어있다면 유효
```
이 함수의 타입은 자동으로 추론이 되서 모두 any으로 추론이 됩니다. any는 유용할 수 있지만 매우 주의해서 사용해야하는 타입입니다.

noImplicitAny 설정이 되어 있는 상태로 any를 사용하려면 명시적으로 `:any`를 적어주어야 합니다. 더 좋은 방법은 그냥 다른 타입을 설정하는 것입니다.

가능한 noImplicitAny 설정을 사용하여 분명한 타입을 명시하는 것이 좋을 것입니다.

### strictNullChecks

이 설정은 null과 undefined가 모든 타입에서 허용되는지 확인합니다.

```ts
const x: number = null; // strictNullChecks가 해제되었을 경우 유효, 사용하면 에러

const x: number | null = null; // 의도를 명시적으로 드러내어 에러 해결
```

null을 허용하지 않으려면 null을 체크하는 코드나 !을 사용하여 해결하면 됩니다.

만약 타입스크립트에서 아주 엄격한 체크를 하려면 strict 설정을 하면 됩니다.

<br>

---

<br>

## 코드 생성과 타입이 관계없음을 이해하기

타입스크립트 컴파일러의 역할
- 구버전의 자바스크립트로 변환
- 타입 오류 체크

타입스크립트가 자바스크립트로 변환될 때 코드의 타입에 영향을 주지 않습니다.
또한 타입은 자바스크립트의 실행 시점에 영향을 미치지 않습니다.

### 타입 오류가 있는 코드도 컴파일이 가능

컴파일과 타입 체크는 독립적이기 때문입니다.

타입 오류가 있어도 알려주기만 할 뿐, 빌드를 멈추지는 않습니다.

오류가 있을 때 컴파일하지 않으려면 `tsconfig.json` 파일에 `nooEmitOnError`를 설정하거나 빌드 도구에 동일하게 적용합니다.

### 런타임에는 타입 체크 불가능

타입스크립트의 타입은 자바스크립트로 컴파일되는 과정에서 모든 인터페이스, 타입 등은 제거됩니다.

런타임에 타입 정보를 유지하는 방법

1. 속성이 존재하는지 체크하기
```ts
interface Square { width: number; }
interface Rectangle extends Square { height: number; }
type Shape = Square | Rectangle;

function calculateArea(shape: Shape) {
  if ('height' in shape) { ... }
  ...
}
```

2. 런타임에 접근 가능한 타입 정보를 명시적으로 저장하기 (태그 기법)
```ts
interface Square { 
  kind: 'square';
  width: number; 
}
interface Rectangle extends Square { 
  kind: 'rectangle';
  height: number;
  width: number; 
}
type Shape = Square | Rectangle;

function calculateArea(shape: Shape) {
  if (shape.kind === 'rectangle') { ... }
  ...
}
```

3. 타입을 클래스로 만들기

### 타입 연산은 런타임에 영향을 주지 않습니다.

### 런타임 타입은 선언된 타입과 다를 수 있습니다.

### 타입스크립트 타입으로는 함수를 오버로드할 수 없습니다.

타입스크립트가 함수 오버로딩 기능을 지원하기는 해도 타입 수준에서만 동작합니다.

하나의 함수에 대해 여러개의 선언문을 작성할 순 있지만, 구현체는 하나뿐입니다. 자바스크립트로 변환되면서 제거되기 때문입니다.

### 타입스크립트 타입은 런타임 성능에 영향을 주지 않습니다.

타입과 타입 연산자는 자바스크립트 변환 시점에 제거되기 때문입니다.

하지만 런타임 오버헤드가 없는 대신, 빌드타임 오버헤드가 있습니다.

<br>

---

<br>

## 구조적 타이핑에 익숙해지기

자바스크립트는 어떤 함수의 매개변수 값이 모두 제대로 주어지면, 그 값이 어떻든 그냥 사용합니다. 이를 덕 타이핑 기반이라고 합니다.

타입스크립트도 이런 동작을 그대로 모델링합니다. 따라서 구조적 타이핑을 사용합니다.

구조적 타이핑이란 코드 구조 관점에서 타입이 서로 호환되는지의 여부를 판단하는 것입니다. 타입스크립트에서는 타입 체크 시 해당 변수가 가지고 있는 '모양'에 집중합니다.

```ts
interface Animal {
  kind: string;
  bark(): void;
}

class Dog implements Animal {
  kind = "dog"
  bark = () => {
      console.log(`bow wow`);
  }
}

class Wolf { 
  kind = "wolf"
  bark  = () => {
    console.log(`Awwwww`);
  }
}

const dog = new Dog(); 
const wolf = new Wolf();

function barkBark(animal: Animal): void {
  animal.bark();
}

barkBark(dog); // bow wow
barkBark(wolf); // Awwwww
```
위 예시처럼 Wolf는 Animal을 상속받지 않았지만, Animal과 `모양`이 같으므로 barkBark함수가 정상 호출되었습니다.

<br>

---

<br>

## any 타입 지양하기

any를 사용하면 타입스크립트의 많은 장점들을 사용할 수 없습니다. 만약 사용해야한다면 any의 위험성을 알고 있어야 합니다.

### any 타입에는 안전성이 없습니다.

```ts
let age: number;
age = '12' as any;
age += 1;
// 런타임 정상, 결과는 age = '121'
```

### any 타입은 언어 서비스가 적용되지 않습니다.

타입스크립트는 타입이 있다면 자동완성 기능과 도움말을 제공합니다. 하지만 any 타입을 사용한다면 이러한 기능을 제공받지 못합니다.

### any 타입은 코드 리팩토링 때 버그를 감춥니다.

### any는 타입 설계를 감춰버립니다.

### any는 타입시스템의 신뢰도를 떨어뜨립니다.