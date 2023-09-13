# 아이템16. number 인덱스 시그니처보다는 Array, 튜플, ArrayLike를 사용하기

## 타입스크립트는 숫자 키를 허용한다

자바스크립트의 객체 모델은 이상한 점들이 있다.

1. 자바스크립트에서는 객체의 속성에 문자열이 아닌 다른 타입이 들어오면 암묵적으로 toString 메서드를 호출하고 문자열로 변환한 값을 속성의 key로 등록한다.
2. 자바스크립트에서 배열은 객체이다. 때문에 배열의 인덱스에 접근하기 위해 `[]` 내부에 숫자를 사용하면 인덱스는 암묵적으로 문자열로 변환되고 배열의 요소에 접근한다. 배열의 요소에 접근하기 위해 숫자가 적힌 문자열(ex '1')을 작성하면 배열의 요소에 접근이 가능하다.
3. Object.keys() 또한 자바스크립트의 배열을 반환하기 때문에 string[]을 값으로 가진다.

타입스크립트는 위와 같은 혼란을 바로 잡기 위해 숫자 키를 허용하고, 문자열 키와 다른 것으로 인식한다.

```ts
interface Array<T> {
  // ...
  [n: number]: T;
}
```

## 배열을 순회하는 방법

```ts
const keys = Object.keys(xs); // string[]

// for in 문: X 속성 키에 접근할 수 없음
for (const key in xs) {
  key; // string
  const x = xs[key]; // number
}

// for of 문: O
for (const x of xs) {
  x; // number
}

// forEach: O
xs.forEach((x, i) => {
  x; // number
  i; // number
});

// for loop: O
for (let i = 0; i < xs.length; i++) {
  const x = xs[i]; // number
  if (x < 0) break;
}
```

## 어떤 길이를 가지는 배열과 비슷한 형태의 튜플을 원하면 ArrayLike 타입 사용

```ts
function checkedAccess<T>(xs: ArrayLike<T>, i: number): T {
  if (i < xs.length) {
    return xs[i];
  }

  throw new Error(`배열의 끝을 지나서 ${i}를 접근하려고 했습니다.`);
}
```

## 길이와 숫자 인덱스 시그니처만 있을 경우 ArrayLike를 사용해야 함
