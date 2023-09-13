# 3장 타입스크립트의 타입 추론

## ITEM21. 타입 넓히기(widening)
타입스크립트의 타입 넓히기를 제어할 수 있는 방법이 있습니다.
### const 선언
- let 대신 const 변수를 선언하면 더 좁은 타입이 됩니다.
```ts
interface Vector3 { x: number; y: number; z: number; }
function getComponent(vector: Vector3, axis: 'x' | 'y' | 'z') {
  return vector[axis];
}
const x = 'x';  // type is "x"
let vec = {x: 10, y: 20, z: 30};
getComponent(vec, x);  // OK
```

### 타입스크립트의 기본 동작을 재정의 하는 세 가지 방법


1. 명시적 구문을 제공
```ts
const v: {x: 1|3|5} = {
  x: 1,
};  // Type is { x: 1 | 3 | 5; }
```

2. 타입 체커에 추가적인 문맺을 제공

3. const 단언문활용
- const 단언문과 변수 선언에 쓰이는 `let`, `const`를 혼동해서는 안됩니다.
```ts
interface Vector3 { x: number; y: number; z: number; }
function getComponent(vector: Vector3, axis: 'x' | 'y' | 'z') {
  return vector[axis];
}
const v1 = {
  x: 1,
  y: 2,
};  // Type is { x: number; y: number; }

const v2 = {
  x: 1 as const,
  y: 2,
};  // Type is { x: 1; y: number; }

const v3 = {
  x: 1,
  y: 2,
} as const;  // Type is { readonly x: 1; readonly y: 2; }
```