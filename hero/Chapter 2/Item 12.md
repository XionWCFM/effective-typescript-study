## Item 12 - 함수 표현식에 타입 적용하기

타입스크립트에서는 함수의 매개변수부터 반환값까지 전체를 타입으로 선언하여 함수 표현식에 재사용할 수 있기 때문에 함수 표현식을 사용하는 것이 좋습니다.

```ts
type BinaryFn = (a: number, b: number) => number;

// 함수 문장
function add(a: number, b: number) {return a + b;}
function sub(a: number, b: number) {return a - b;}
function mul(a: number, b: number) {return a * b;}
function div(a: number, b: number) {return a / b;}

// 함수 표현
const add: BinaryFn = (a, b) => a + b;
const sub: BinaryFn = (a, b) => a - b;
const mul: BinaryFn = (a, b) => a * b;
const div: BinaryFn = (a, b) => a / b;
```

표현식을 사용해서 타입을 설정하면 사용하지 않았을 때보다 코드를 적게 쓸 수 있고, 로직이 분명해집니다. 또한 반환 타입을 보장하기 때문에 오류를 더 잘 찾아낼 수 있습니다.