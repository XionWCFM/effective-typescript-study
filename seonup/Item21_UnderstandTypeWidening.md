# 아이템 21. 타입 넓히기

타입스크립트는 할당된 값으로 유추가 가능한 타입의 집합으로 타입을 추론한다. 이를 타입 넓히기라고 부른다.
`const`로 선언된 변수에 원시값이 할당되면 해당 변수는 값의 변경이 불가능하다. 따라서 타입스크립트는 타입 추론시 타입을 최대한 좁게 추론하는 반면, let은 값이 변경될 가능성을 두고 타입 넓히기를 한다.

```ts
let x = 'x'; // type x = string; => 'x'가 아닌 string으로 넓혀져서 추론된다.
const y = 'y'; // type y = 'y';
```

## 객체의 각 요소는 `let` 변수에 할당된 것처럼 타입이 넓혀져서 추론된다.

`const`로 선언된 변수에 객체를 할당할 경우, 변수에 할당된 객체의 주소값은 변경되지 않지만 내부 속성의 값은 변경될 수 있다. 때문에 타입스크립트는 객체의 타입을 추론할 때 내부 속성에 대한 타입을 추론할 때 `let`으로 선언된 변수의 타입을 추론하듯 타입 넓혀서 추론한다.

```ts
const v = {
  x: 1,
}; // type v = { x: number; };

v.x = 3; //=> 가능
v.x = 'hello'; //=> 불가능
```

이때 타입을 특정하려면, 명시적으로 타입 구문을 추가하거나 const 단언문(`as const`)을 사용해야 한다.

```ts
// 명시적 타입 구문
const v: { x: 1 } = {
  x: 1,
}; // type v = { x: 1; };

// const 단언문
const v = {
  x: 1,
} as const; // type v = { x: 1; };
```