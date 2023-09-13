# 2장 타입스크립트의 타입 시스템

## ITEM12. 함수 표현식에 타입 적용하기(type-entire-functions)
- 불필요한 코드의 반복을 줄입니다. 

```ts
function add(a: number, b: number) { return a + b; }
function sub(a: number, b: number) { return a - b; }
function mul(a: number, b: number) { return a * b; }
function div(a: number, b: number) { return a / b; }


type BinaryFn = (a: number, b: number) => number;
const add: BinaryFn = (a, b) => a + b;
const sub: BinaryFn = (a, b) => a - b;
const mul: BinaryFn = (a, b) => a * b;
const div: BinaryFn = (a, b) => a / b;
```

- 매개변수나 반환 값에 타입을 명시하기보다는 함수 표현식 전체에 타입 구문을 적용하는 것이 좋습니다. 
- 다른 함수의 시그니처를 참조하려면 `typeof fn`을 사용하면 됩니다.



> 함수선언문
>```ts
>function rollDice1(sides: number): number { /* COMPRESS */ return 0; /* END */ }
>```

> 함수표현식
>```ts
>const rollDice2 = function(sides: number): number {  return 0; }; 
>const rollDice3 = (sides: number): number =>  0;
>```