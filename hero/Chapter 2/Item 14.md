## Item 14 - 타입 연산과 제너릭 사용으로 반복 줄이기

### 인터페이스 확장으로 반복 줄이기
```ts
// 수정 전
interface Person {
  firstName: string;
  lastName: string;
}
interface PersonWithBirthDate {
  firstName: string;
  lastName: string;
  birth: Date;
}

// 수정 후
interface Person {
  firstName: string;
  lastName: string;
}
interface PersonWithBirthDate extends Person {
  birth: Date;
}
```

<br>

### 타입에 이름을 붙여서 반복 줄이기
```ts
// 수정 전
function distance(a: {x:number, y:number}, b: {x:number, y:number}) {
  return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
}

// 수정 후
interface Point2D {
  x: number;
  y: number;
}
function distance(a: Point2D, b: Point2D) { ... }
```

<br>

### 같은 타입 시그니처를 명명된 타입으로 분리하기
```ts
// 수정 전
function get(url: string, opts: Options): Promise<Response> { ... }
function post(url: string, opts: Options): Promise<Response> { ... }

// 수정 후
type HTTPFunction = (url: string, opts: Options) => Promise<Response>;
const get: HTTPFunction = (url, opts) => { ... };
const post: HTTPFunction = (url, opts) => { ... };
```

<br>

### 이미 존재하는 타입을 확장하기
```ts
type PersonWithBirthDate = Person & { birth: Date };
```

<br>

### 매핑된 타입을 사용해서 중복 제거하기
```ts
interface State {
  userId: string;
  pageTitle: string;
  recentFiles: string[];
  pageContents: string;
}

type TopNavState = {
  [k in 'userId' | 'pageTitle' | 'recentFiles']: State[k]
};
```
매핑된 타입은 배열을 순회하는 것과 같은 방식이며, 표준 라이브러리에서 `Pick`과 같습니다.
`Pick`은 제너릭 타입입니다. T와 K 두 가지 타입을 받아서 결과 타입을 반환합니다.
```ts
type Pick<T, K> = { [k in K]: T[k] };
// -> K가 T 타입과 무관하고 범위가 너무 넓음, K는 T의 키의 부분 집합이 되어야 함
type Pick<T, K> = { [k in K extends keyof T]: T[k] };
```

위 예제를 Pick을 사용해서 바꾸면,
```ts
type TopNavState = Pick<State, 'userId' | 'pageTitle' | 'recentFiles'>;
```

<br>

선택적 필드로 만들고 싶다면?
```ts
interface Options {
  width: number;
  height: number;
  color: string;
  label: string;
}
interface OptionsUpdate {
  width?: number;
  height?: number;
  color?: string;
  label?: string;
}
class UIWidget {
  constructor(init: Options) { /* ... */ }
  update(options: OptionsUpdate) { /* ... */ }
}
```
매핑된 타입과 `keyof`를 사용하면 됩니다.
```ts
type OptionsUpdate = {[k in keyof Options]?: Options[k]};
```
`keyof`는 타입을 받아서 속성 타입의 유니온을 반환합니다.
```ts
type OptionsKeys = keyof Options;
// "width" | "height" | "color" | "label"
```

`Partial`을 사용하면 비슷합니다.
```ts
interface Options {
  width: number;
  height: number;
  color: string;
  label: string;
}
class UIWidget {
  constructor(init: Options) { /* ... */ }
  update(options: Partial<Options>) { /* ... */ }
}
```