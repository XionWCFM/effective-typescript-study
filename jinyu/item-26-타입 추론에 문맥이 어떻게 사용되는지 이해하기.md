# 타입 추론에 문맥이 어떻게 사용되는지 이해하기

타입스크립트는 타입을 추론할 때 단순히 값만 고려하지 않는다. 값이 존재하는 **문맥**까지 고려한다. 하지만 문맥을 고려해 타입을 추론하면 가끔 이상한 결과가 나온다. 이 때 타입 추론에 문맥이 어떻게 사용되는지 이해하고 있다면 제대로 대처할 수 있을 것이다.

자바스크립트에서는 다음과 같은 코드의 동작과 실행 순서를 바꾸지 않으면서 **표현식을 상수로 분리**해 낼 수 있다.

```js
// 인라인 형태
setLanguage('JavaScript');

// 참조 형태
let language = 'JavaScript';
setLanguage(language);
```

타입스크립트로 다음과 같이 리팩토링을 하여도 정상 동작한다.

```ts
function setLanguage(language: string) {
  /*...*/
}

setLanguage('JavaScript'); // 정상

let language = 'JavaScript';
setLanguage(language); // 정상
```

이제 위의 코드에서 문자열 타입을 더 특정해서 문자열 리터럴 타입의 유니온으로 바꿔본다.

```ts
type Language = 'JavaScript' | 'TypeScript' | 'Python';
function setLangauge(language: Language) {
  /*...*/
}

setLanguage('JavaScript'); // 정상

let language = 'JavaScript';
setLanguage(language);
// ~~~~~ 'string' 형식의 인수는
// 'Language' 형식의 매개변수에 할당될 수 없다.
```

타입스크립트는 할당 시점에 타입을 추론하기 때문에 `let language = 'JavaScript'`는 `Language` 타입이 아닌 `string`으로 추론되어 발생되는 오류이다.

이런 문제를 해결하는 두 가지 방법이 있다.

1. 타입 선언에서 `language`의 가능한 값을 제한

   ```ts
   let language: Language = 'JavaScript';
   setLanguage(language); // 정상
   ```

2. `language`를 상수로 만든다.
   ```ts
   const language: Language = 'JavaScript';
   setLanguage(language);
   ```

하지만 문맥으로부터 값을 분리하면 추후에 근본적인 문제가 발생할 수 있다. 문맥의 소실로 인해 오류가 발생하는 몇 가지 경우와 이를 어떻게 해결하는지 알아보자.

### 튜플 사용 시 주의점

문자열 리터럴과 마찬가지로 튜플 타입에서도 문제가 발생한다.

```ts
// 매개변수는 (latitude, longitude) 쌍
function panTo(where: [number, number]) {
  /*...*/
}

panTo([10, 20]); // 정상

const loc = [10, 20]; // 값을 상수화. 문맥으로부터 값을 분리.
panTo(loc);
// ~~~ 'number[]' 형식의 인수는
// '[number, number]' 형식의 매개변수에 할당될 수 없습니다.
```

오류를 고치는 방법은 두 가지 방법이 있다.

- 타입 선언

  ```ts
  const loc: [number, number] = [10, 20];
  panTo(loc);
  ```

- `as const`

  `const`는 단지 값이 가리키는 참조가 변하지 않는 얕은 상수인 반면, `as const`는 그 값이 내부까지(deeply) 상수라는 사실을 타입스크립트에게 알려준다.

  ```ts
  const loc = [10, 20] as const;
  panTo(loc);
  // ~~~ 'readonly [10, 20]' 형식은 'readonly'이며
  // 변경 가능한 형식 '[number, number]'에 할당할 수 없습니다.
  ```

  그런데 이 추론은 '너무 과하게' 정확하다. 그러므로 `panTo` 함수에 `readonly` 구문을 추가해야 한다.

  ```ts
  function panTo(where: readonly [number, number]) {
    /*...*/
  }
  const loc = [10, 20] as const;
  panTo(loc); // 정상
  ```

  `as const`는 문맥 손실과 관련한 문제를 깔끔하게 해결할 수 있지만 한 가지 단점이 있다. 만약 타입 정의에 실수가 있다면 예를 들어 튜플에 세 번째 요소를 추가한다면 오류는 타입 정의가 아니라 호출되는 곳에서 발생한다는 것이다. 특히 여러 겹 중첩된 객체에서 오류가 발생한다면 근본적인 원인을 파악하기 어렵다.

  ```ts
  const loc = [10, 20, 30] as const; // 실제 오류는 여기서 발생
  panTo(loc);
  // ~~~ 'readonly [10, 20, 30]' 형식의 인수는 'readonly [number, number]' 형식의 매개변수에 할당될 수 없습니다.
  // 'length' 속성의 형식이 호환되지 않습니다.
  // '3' 형식은 '2' 형식에 할당할 수 없습니다.
  ```

### 객체 사용 시 주의점

문맥에서 값을 분리하는 문제는 큰 객체에서 상수를 뽑아낼 때도 발생한다.

```ts
type Language = 'JavaScript' | 'TypeScript' | 'Python';
interface GovernedLanguage {
  language: Language;
  organization: string;
}

function complain(language: GovernedLanguage) {
  /*...*/
}

complain({ language: 'TypeScript', organization: 'Microsoft' }); // 정상

const ts = {
  language: 'TypeScript',
  organization: 'Microsoft',
};
complain(ts);
// ~~ '{ language: string; organization: string;}' 형식의 인수는
// 'GovernedLanguage' 형식의 매개변수에 할당될 수 없습니다.
// 'language' 속성의 형식이 호환되지 않습니다.
// 'string' 형식은 'Language' 형식에 할당될 수 없습니다.
```

`ts` 객체에서 `langauge`의 타입은 `string`으로 추론된다. 이 문제는 타입 선언(`const ts: GovernedLanuage = ...`)을 하거나 상수 단언(`as const`)을 사용해 해결한다.

### 콜백 사용 시 주의점

콜백을 다른 함수로 전달할 때, 타입스크립트는 콜백의 매개변수 타입을 추론하기 위해 문맥을 사용한다.

```ts
function callWithRandomNumbers(fn: (n1: number, n2: number) => void) {
  fn(Math.random(), Math.random());
}

callWithRandomNumbers((a, b) => {
  a; // 타입이 number
  b; // 타입이 number
  console.log(a + b);
});
```

위의 코드에서 콜백 함수를 상수로 뽑아내면 문맥 소실이 발생하고 `noImplicitAny` 오류가 발생한다. 이런 경우는 **매개변수에 타입 구문**을 추가해서 해결한다.

```ts
const fn = (a: number, b: number) => {
  console.log(a + b);
};

callWithRandomNumbers(fn);
```

또는 전체 함수 표현식에 타입 선언을 적용해 해결할 수도 있다.
