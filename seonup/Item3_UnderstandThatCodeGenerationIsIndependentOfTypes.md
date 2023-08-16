# 아이템3. 코드 생성과 타입이 관계없음을 이해하기

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

## 참고

- [타입스크립트에서 타입을 좁히는 방법](https://www.yongdam.sh/blog/effective-typescript-narrowing)
