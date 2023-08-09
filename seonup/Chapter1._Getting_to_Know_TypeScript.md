# intro

타입스크립트는 고수준 언어인 자바스크립트로 컴파일되며, 실행 역시 타입스크립트가 아닌 자바스크립트로 이루어진다. 인터프리터(파이썬이나 루비 같은)로 실행되는 것도 아니고, 저수준 언어로 컴파일(자바나 C 같은)되는 것도 아니다.

_\*고수준 언어는 사람이 이해하기 쉬운 언어를 말하고, 저수준 언어는 기계가 이해하기 쉬운 언어를 말한다_

# 아이템 1. 타입스크립트와 자바스크립트 관계 이해하기

## 타입스크립트는 자바스크립트의 상위 집합이다

모든 자바스크립트 문법은 타입스크립트로 표현될 수 있지만, 타입스크립트 문법은 자바스크립트로 표현될 수 없는 별도의 문법이 존재한다.

```ts
function greet(who: string) {
  console.log('Hello', who);
}
```

예를 들어, 위 코드에서 매개변수에 작성된 `: string`는 타입스크립트의 문법으로 자바스크립트에서 실행하면 `SyntaxError: Unexpected token :` 에러를 띄운다.

## 타입스크립트는 자바스크립트의 런타임 동작을 모델링한다

자바스크립트의 런타임 동작을 모델링하는 타입스크립트는 런타임에 발생할 수 있는 오류를 미리 찾아낼 수 있다는 특징을 가지지만, 자바스크립트를 모델링하기 때문에 타입 체크를 엄격하게 하는 다른 언어와 달리 **런타임 오류가 될만한 일부 코드를 정상으로 인식하기도 한다.**

```ts
const x = 2 + '3'; // 정상. string 타입입니다.
const y = '2' + 3; // 정상. string 타입입니다.
```

위 코드에서 `+`연산자의 좌항은 number 타입이고 우항은 string 타입이기 때문에 타입 체커가 오류를 던질 것 같지만, 문자 타입의 피연산자가 있을 경우 다른 타입의 피연산자를 문자 타입으로 형변환하는 자바스크립트 `+`연산자의 특징을 모델링하여 정상으로 인식한다.

# 아이템 2. 타입스크립트 설정 이해하기

타입스크립트의 설정은 어디서 소스 파일을 찾을지, 어떤 종류의 출력을 생성할지 제어하는 내용과 언어 자체의 핵심 요소들을 제어하는 설정을 포함한다. 때문에 어떻게 설정하느냐에 따라 완전히 다른 언어처럼 느껴질 수 있다.

타입스크립트의 설정은 커멘드 라인으로 명령어를 입력하거나 tsconfig.json 설정 파일을 이용하여 설정할 수 있는데, 협업하는 동료나 다른 도구들이 알 수 있도록 하려면 커멘드라인 설정 대신 tsconfig.json 설정 파일을 이용하는 것이 좋다.

## 설정 옵션

설정을 제대로 사용하기 위해서는 `noImplicitAny`와 `strictNullChecks`를 이해해야 한다.

### `noImplicitAny`

단어 그대로 암시적인 `any` 타입을 허용하지 않겠다는 옵션으로, 설정시 코드를 작성할 때 명시적으로 `any`를 선언해 주거나 더 분명한 타입을 사용해야 한다.

타입스크립트는 타입 정보를 가질 때 가장 효과적(문제 발견, 가독성 향상, 개발자의 생산성 향상)이기 때문에 모든 변수에 타입을 명시하는 것에 익숙해지는 것이 좋으므로, 자바스크립트로 되어 있는 기존 프로젝트를 타입스크립트로 전환하는 상황이 아니라면 `noImplicitAny`를 설정하는 것이 좋다.

### `strictNullChecks`

`strictNullChecks`는 `null`과 `undefined`가 모든 타입에서 허용되는지 확인하는 설정으로, `noImplicitAny`와 함께 설정해야 하며, 설정시 `Uncaught TypeError: undefined is not an object`와 같은 런타임 에러를 방지할 수 있다.

`strictNullChecks`를 설정했을 때, 아래와 같이 변수의 타입이 `null`나 `undefined`를 포함한 유니언 타입으로 추론되어 발생하는 타입 에러를 방지하려면 `null`나 `undefined`를 체크하는 타입 가드(type guard)나 단언문(assertion)을 추가해야 한다.

```ts
const el = document.getElementById('status');
el.textContent = 'Ready'; // Object is possibly 'null'

// 타입 가드 사용
if (el) {
  el.textContent = 'Ready'; // OK, null has been excluded
}

// non-null(!) 단언문 사용
el!.textContent = 'Ready'; // OK, we've asserted that el is non-null
```

# 아이템 3. 코드 생성과 타입이 관계없음을 이해하기

- 최신 타입스크립트/자바스크립트를 브라우저에서 동작할 수 있도록 구버전의 자바스크립트로 트랜스파일한다.
- 코드의 타입 오류를 체크한다.

타입스크립트 컴파일러가 두 가지 역할을 독립적으로 수행하는 것을 토대로, 타입스크립트가 할 수 있는 일과 할 수 없는 일을 살펴볼 수 있다.

## 타입 오류가 있는 코드도 컴파일이 가능하다

컴파일은 타입 체크와 독립적으로 동작하기 때문에, 타입 오류가 있는 코드도 컴파일이 가능하다. 즉, 문제가 될 부분을 알려주지만 빌드를 멈추지는 않는다. 이러한 특징은 문제가 된 오류를 수정하지 않더라도 애플리케이션의 다른 부분을 테스트할 수 있다는 이점을 가져온다.

오류가 있을 때 컴파일 하지 않으려면 tsconfig.json에 `noEmitOnError`를 설정하거나 빌드 도구에 동일하게 적용하면 된다.

## 런타임에는 타입 체크가 불가능하다

타입스크립트의 타입은 '제거 가능(erasable)'하다. 모든 인터페이스, 타입, 타입 구문은 자바스크립트로 컴파일되는 과정에서 모드 제거된다.

만약, 유니온 타입으로 정의된 타입을 전달받는 함수가 있다면 `if (체크대상 instanceof 타입) { ... }` 처럼 타입 가드를 작성하더라도 컴파일시 타입이 제거되기 때문에 런타임에서 오류가 발생할 수 있다. (instanceof 연산자는 런타임에 평가되고 타입은 컴파일시 지워지기 때문) 이러한 오류는 아래와 같은 런타임에 타입 정보를 유지하는 방식으로 해결할 수 있다.

### 런타임에 접근 가능한 속성 체크를 하는 방식

```ts
interface Square {
  width: number;
}
interface Rectangle extends Square {
  height: number;
}
type Shape = Square | Rectangle;

function calculateArea(shape: Shape) {
  if ('height' in shape) {
    shape; // Type is Rectangle
    return shape.width _ shape.height;
  } else {
    shape; // Type is Square
    return shape.width _ shape.width;
  }
}
```

### 태그 기법을 사용하여 런타임에 접근 가능한 타입 정보를 명시적으로 저장하는 방식

아래 코드는 **태그된 유니온(tagged union)**의 예시다. 태그된 유니온이자 구별된 유니온(discriminated union)이라 불리는 이 방법은 **타입을 식별하기 위해 명시적인 '태그'를 붙이는 것**으로, 각 타입에 타입을 식별할 수 있는 필드를 추가하는 것으로 간단하게 해결할 수 있다. 아래 예제에서는 `shape` 객체에 `kind` 필드를 추가해주었다.

```ts
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

function calculateArea(shape: Shape) {
  if (shape.kind === 'rectangle') {
    shape; // Type is Rectangle
    return shape.width _ shape.height;
  } else {
    shape; // Type is Square
    return shape.width _ shape.width;
  }
}
```

### 타입을 클래스로 만드는 방식

런타임에 접근 불가능한 타입과 런타임에 접근 가능한 값을 모두 사용하여 타입을 클래스로 만드는 방식도 있다.

```ts
class Square {
  constructor(public width: number) {}
}
class Rectangle extends Square {
  constructor(public width: number, public height: number) {
    super(width);
  }
}
type Shape = Square | Rectangle; // 타입으로 참조

function calculateArea(shape: Shape) {
  if (shape instanceof Rectangle) {
    shape; // 값으로 참조. Type is Rectangle
    return shape.width * shape.height;
  } else {
    shape; // 값으로 참조. Type is Square
    return shape.width * shape.width; // OK
  }
}
```

## 타입 연산은 런타임에 영향을 주지 않는다

`as number`와 같은 타입 단언문은 타입 연산이므로 런타임에 영향을 주지 않는다. 값의 정제가 필요하다면 런타임의 타입을 체크하도록 하고 자바스크립트 연산을 통해 변환을 수행해야 한다.

## 런타임 타입은 선언된 타입과 다를 수 있다

타입 선언문으로 API 요청을 통해 들어오는 값의 타입을 지정했다고 가정했을 때, 런타임에는 타입 선언문이 제거되기 때문에 API 요청으로 Response 받는 값은 런타임에 타입을 알 수 있으므로 두 타입이 다를 수 있다.

## 타입스크립트 타입으로는 함수를 오버로드할 수 없다

타입스크립트의 함수 오버로딩 기능은 하나의 함수(구현체)에 대해 여러개의 타입 선언문을 작성할 수 있다. 즉, 타입의 수준에서만 함수 오버로딩이 가능하다.

## 타입스크립트 타입은 런타임 성능에 영향을 주지 않는다

타입과 타입 연산자는 컴파일시 제거되기 때문에 런타임의 성능에는 영향을 주지 않는다.

- 런타임 오버헤드가 없는 대신 빌드타임 오버헤드가 있다. 오버헤드가 커지면 빌드 도구에서 트랜스파일만(transpile only)를 설정하여 타입 체크를 건너뛸 수 있다.
- 컴파일시 컴파일 타깃을 낮춰 호환성을 키울지, 컴파일 타깃을 높여 호환성을 포기하고 성능 중심으로 할 지 선택해야 하나, 이러한 특징은 타입과는 무관하다.

# 아이템 4. 구조적 타이핑에 익숙해지기

타입스크립트는 객체가 어떤 타입에 부합하는 변수와 메서드를 가질 경우 객체를 해당 타입에 속하는 것으로 간주하는 덕 타이핑(duck typing) 기반의 자바스크립트를 모델링하여, 매개변수 값이 요구사항을 만족한다면 타입이 무엇인지 신경 쓰지 않고 동작한다. 이를 구조적 타이핑(structural typing)이라 하는데, 구조적 타이핑은 **타입 간의 관계를 선언하지 않고도 구조적으로 동일한 타입을 가지면 허용해주는 것**을 말한다.

```ts
interface Vector2D {
  x: number;
  y: number;
}

function calculateLength(v: Vector2D) {
  return Math.sqrt(v.x * v.x + v.y * v.y);
}

interface NamedVector {
  name: string;
  x: number;
  y: number;
}

const v: NamedVector = { x: 3, y: 4, name: 'Zee' };

calculateLength(v); // OK, result is 5
```

## 구조적 타이핑은 오류를 발생시킬 수 있다

```ts
interface Vector2D {
  x: number;
  y: number;
}

function calculateLength(v: Vector2D) {
  return Math.sqrt(v.x * v.x + v.y * v.y);
}

interface NamedVector {
  name: string;
  x: number;
  y: number;
}
interface Vector3D {
  x: number;
  y: number;
  z: number;
}

function normalize(v: Vector3D) {
  const length = calculateLength(v);

  return {
    x: v.x / length,
    y: v.y / length,
    z: v.z / length,
  };
}

normalize({ x: 3, y: 4, z: 5 }); // => { x: 0.6, y: 0.8, z: 1 }로 예상밖의 결과를 출력함
```

위 코드는 구조적 타이핑으로 인해 원하는 결과값을 얻을 수 없는 문제가 발생한 예제이다. `normalize`의 인수로 전달된 값은 `Vector3D` 타입인데 함수 내부에서 `calculateLength`에 전달되는 인수는 구조적 타이핑에 의해 `Vector2D`로 연산되어 `z` 속성이 무시되었다.

함수를 작성할 때 타입을 선언하면 의도한 매개변수만 함수의 인수로 전달될 것이라 생각하지만, **타입스크립트의 타입은 열려있기 때문에(타입의 확장에 열려있다) 타입에 선언된 속성 외에 임의의 속성을 추가하더라도 오류가 발생하지 않는다.**

클래스 역시 구조적 타이핑 규칙을 따른다. 때문에 클래스의 인스턴스가 예상과 다를 수 있음을 인지해야 한다.

## 구조적 타이핑은 유닛 테스트 구현에 용이하다

구조적 타이핑을 사용하면 실제 DB 모킹하지 않아도 DB 인터페이스를 사용하여 간단하게 테스트 코드를 작성할 수 있다.

```ts
interface PostgresDB {
  runQuery: (sql: string) => any[];
}
interface Author {
  first: string;
  last: string;
}
interface DB {
  runQuery: (sql: string) => any[];
}

function getAuthors(database: DB): Author[] {
  const authorRows = database.runQuery(`SELECT FIRST, LAST FROM AUTHORS`);
  return authorRows.map((row) => ({ first: row[0], last: row[1] }));
}

test('getAuthors', () => {
  const authors = getAuthors({
    runQuery(sql: string) {
      return [
        ['Toni', 'Morrison'],
        ['Maya', 'Angelou'],
      ];
    },
  });
  expect(authors).toEqual([
    { first: 'Toni', last: 'Morrison' },
    { first: 'Maya', last: 'Angelou' },
  ]);
});
```

# 아이템 5. any 타입 지양하기

타입스크립트의 타입 시스템은 any 타입에 의해 점진적(gradual)이고 선택적(optional)이다. 코드에 타입을 조금씩 추가할 수 있어 점진적이고, 언제든지 타입 체커를 해제할 수 있어 선택적이다. 이러한 any 타입은 아래와 같은 위험성이 있기 때문에 사용을 지양해야 한다.

- any 타입에는 타입 안정성이 없다.
- any는 약속된 타입의 입력을 받아 약속된 타입의 출력을 반환하는 함수 시그니처(contract)를 무시한다.
- any 타입을 사용하면 언어 서비스를 받지 못한다. 언어 서비스는 자동완성 기능과 적절한 도움말 등 개발자와 협업하는 동료의 생산성을 향상시키므로 타입스크립트 경험의 핵심 요소이다.
- any 타입은 코드 리팩터링 때 버그를 감춘다.
- any는 타입 설계를 감춘다.
- any는 타입시스템의 신뢰도를 떨어뜨린다. 휴먼 에러를 잡아주지 못하며, 코드의 신뢰성을 떨어뜨린다.

# 참고

- [타입스크립트에서 타입을 좁히는 방법](https://www.yongdam.sh/blog/effective-typescript-narrowing)
