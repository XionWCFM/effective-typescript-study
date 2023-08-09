# 아이템 3 - 코드 생성과 타입이 관계없음을 이해하기

큰 그림에서 보면 타입스크립트 컴파일러는 두 가지 역할을 수행합니다.

- 최신 타입스크립트/자바스크립트를 브라우저에서 동작할 수 있도록 구버전의 자바스크립트로 트랜스파일(transpile)합니다.
- 코드의 타입 오류를 체크합니다.

위의 두 역할을 **서로 완벽히 독립적**입니다.

- 타입스크립트가 자바스크립트로 변환될 때 코드 내의 타입에는 영향을 주지 않습니다.
- 자바스크립트의 실행 시점에도 타입은 영향을 미치지 않습니다.

### 타입 오류가 있는 코드도 컴파일이 가능합니다.

타입스크립트 오류는 C나 자바 같은 언어들의 경고와 비슷합니다. 문제가 될 만한 부분을 알려주지만, 그렇다고 빌드를 멈추지 않습니다.

만약 오류가 있을 때 컴파일하지 않으려면 <i>tsconfig.json</i>에 `noEmitOnError`를 설정하거나 빌드 도구에 동일하기 적용하면 됩니다.

### 런타임에는 타입 체크가 불가능합니다.

자바스크립트로 컴파일 되는 과정에서 모든 인터페이스, 타입, 타입 구문은 그냥 제거되어 버립니다. 그러므로 런타임에 타입 정보를 유지하는 방법이 필요 합니다. (유니온 타입 사용 시 타입을 좁히기 위한 타입 가드를 해주는 것도 이에 해당하네요.)

**런타임에 타입 정보를 유지하는 방법**

- 속성이 존재하는지 체크

```tsx
interface Square {
  width: number;
}

interface Rectangle extends Square {
  height: number;
}
type Shape = Square | Rectangle;

function calculateArea(shape: Shape) {
  if ('height' in shape) {
    shape; // 타입이 Rectangle
    return shape.width * shape.height;
  } else {
    shape; // 타입이 Square
    return shape.width * shape.width;
  }
}
```

- 태그를 사용하는 방법 → kind, tag, type 등 인터페이스나 타입을 선언할 때 구분할 수 있는 속성을 부여한다.

```tsx
interface Square {
  kind: 'square';
  width: number;
}

interface Rectangle {
  kind: 'rectangle';
  width: number;
  height: number;
}
type Shape = Square | Rectangle;

function calculateArea(shape: Shape) {
  if (shape.kind === 'rectangle') {
    shape; // 타입이 Rectangle
    return shape.width * shape.height;
  } else {
    shape; // 타입이 Square
    return shape.width * shape.width;
  }
}
```

- 클래스를 활용 → 타입과 값을 둘 다 사용하는 기법

```tsx
class Square {
  constructor(public width: number) {}
}
class Rectangle extends Square {
  constructor(public width: number, public height: number) {
    super(width);
  }
}
type Shape = Square | Rectangle;

function calculateArea(shape: Shape) {
  if (shape instanceof Rectangle) {
    shape; // 타입이 Rectangle
    return shape.width * shape.height;
  } else {
    shape; // 타입이 Square
    return shape.width * shape.width; // 정상
  }
}
```

### 타입 연산은 런타임에 영향을 주지 않습니다.

### 런타임 타입은 선언된 타입과 다를 수 있습니다.

API를 잘못 파악해서 `boolean` 값이 아닌 문자열 데이터가 들어오거나, 배포된 후 API가 변경되어 데이터 타입이 변경되는 경우도 있을 수 있습니다. 이처럼 타입스크립트에서는 런타임 타입과 선언된 타입이 맞지 않을 수 있으므로 타입이 달라지는 혼란스러운 상황을 가능한 피해야 합니다.

선언된 타입이 언제든지 달라질 수 있다는 것을 명심해야 합니다.

### 타입스크립트 타입으로는 함수를 오버로드할 수 없습니다.

자바스크립트에서는 함수 오버로드라는 개념이 없습니다. 타입스크립트가 함수 오버로딩 기능을 지원하기는 하지만 온전히 타입 수준에서만 동작하며 구현체는 하나만 존재합니다.

```tsx
type CombinableType = number | string;

function add(a: number, b: number): number;
function add(a: string, b: string): string;
function add(a: number, b: string): string;
function add(a: string, b: number): string;
function add(a: CombinableType, b: CombinableType) {
  if (typeof a === 'string' || typeof b === 'string') {
    return a.toString() + b.toString();
  }
  return a + b;
}

const result = add('Jin', 'Yu');
result.split(' ');
```

### 타입스크립트 타입은 런타임 성능에 영향을 주지 않습니다.

타입과 타입 연산자는 자바스크립트 변환 시점에 제거되기 때문에 런타임의 성능에 아무런 영향을 주지 않습니다.
