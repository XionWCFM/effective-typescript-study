# Item 21 - 타입 넓히기

타입스크립트가 작성된 코드를 체크하는 정적 분석 시점에, 변수는 '가능한' 값들의 집합인 타입을 가집니다.
상수를 사용해서 변수를 초기화할 때 타입을 명시하지 않으면 타입 체커는 타입을 결정해야 합니다.
즉, 지정된 단일 값을 가지고 할당 가능한 값들의 집합을 유추해야 한다는 뜻입니다.
이러한 과정을 '넓히기' 라고 부릅니다.

```ts
interface Vector3 { x:number; y:number; z:number; }
function getComponent(vector: Vector3, axis: 'x' | 'y' | 'z') {
  return vector[axis];
}
```
```ts
let x = 'x';
let vec = {x: 10, y: 20, z: 30};
getComponent(vec, x);
// string 형식의 인수는 '"x" | "y" | "z"' 형식의 매개변수에 할당될 수 없습니다.
```

이 예시에서 x의 타입이 할당 시점에 넓히기가 동작해서 string으로 추론되었습니다.
string 타입은 '"x" | "y" | "z"' 타입에 할당이 불가능하므로 오류를 발생시켰습니다.

<br>

### 넓히기를 제어할 수 있는 방법

```ts
const x = 'x'; // 타입이 'x'
let vec = {x: 10, y: 20, z: 30};
getComponent(vec, x); // 정상
```

const로 선언하여 더 좁은 타입으로 추론할 수 있습니다.

하지만 const는 객체와 배열의 경우에 문제를 발생시킬 수 있습니다.

```ts
const v = { x: 1 };
v.x = 3;
v.x = '3'; // '3'형식은 'number' 형식에 할당할 수 없습니다.
v.y = 4; // '{ x: number; }' 형식에 'y' 속성이 없습니다.
v.name = 'Pythagoras'; // '{ x: number; }' 형식에 'name' 속성이 없습니다.
```

<br>

### 타입스크립트의 기본 동작을 재정의하여 추론 강도 제어하기

1. 명시적 타입 구문을 제공하기

```ts
const v: {x:1|3|5} = {
  x: 1,
};
```

2. 타입 체커에 추가적인 문맥 제공하기

3. const 단언문 사용하기
```ts
const v1 = {
  x: 1,
  y: 2,
}; // { x: number, y: number; }

const v2 = {
  x: 1 as const,
  y: 2,
}; // { x: 1, y: number; }

const v3 = {
  x: 1,
  y: 2,
} as const; // { readonly x: 1, readonly y: 2; }
```