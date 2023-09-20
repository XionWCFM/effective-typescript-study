# 타입 좁히기

타입 좁히기는 타입스크립트가 넓은 타입으로부터 좁은 타입으로 진행하는 과정을 말한다.

타입을 좁히는 것에는 다양한 방법이 존재한다.

- null 체크
- 분기문으로 예외 처리
- `instanceof` 사용
- 속성 체크
- `Array.isArray`와 같은 내장 함수 사용
- 명시적 '태그' 붙이기

### null 체크

```ts
const el = document.getElementById('foo'); // 타입이 HTMLElement | null
if (el) {
  el; // 타입이 HTMLElement
  el.innerHTML = 'Party Time'.blink();
} else {
  el; // 타입이 null
  alert('No element #foo');
}
```

타입 체커는 이러한 조건문에서 타입 좁히기를 잘 해내지만, 타입 별칭이 존재한다면 그러지 못할 수도 있다. 타입 별칭에 대한 자세한 내용은 아이템 24에서 다룬다.

### 분기문으로 예외처리

분기문에서 예외를 던지거나 함수를 반환하여 블록의 나머지 부분에서 변수의 타입을 좁힐 수 있다.

```ts
const el = document.getElementById('foo'); // 타입이 HTMLElement | null
if (!el) throw new Error('Unable to find #foo');
el; // 이제 타입은 HTMLElment
el.innerHTML = 'Party Time'.blink();
```

### `instanceof` 사용

```ts
function contains(text: string, search: string | RegExp) {
  if (search instanceof RegExp) {
    search; // 타입이 RegExp
    return !!search.exec(text);
  }
  search; // 타입이 string
  return text.includes(search);
}
```

### 속성 체크

```ts
interface A {
  a: number;
}
interface B {
  b: number;
}

function pickAB(ab: A | B) {
  if ('a' in ab) {
    ab; // 타입이 A
  } else {
    ab; // 타입이 B
  }
  ab;
}
```

### `Array.isArray`와 같은 내장 함수 사용

```ts
function contains(text: string, terms: string | string[]) {
  const termList = Array.isArray(terms) ? terms : [terms];
  termList; // 타입이 string[]
  // ...
}
```

### 명시적 태그 붙이기

명시적 태그를 붙이는 패턴은 '태그된 유니온(tagged union)' 또는 '구별된 유니온(desciminated union)'이라고 불린다.

```ts
interface UploadEvent {
  type: 'upload';
  filename: string;
  contents: string;
}
interface DownloadEvent {
  type: 'download';
  filename: string;
}
type AppEvent = UploadEvent | DownloadEvent;
function handleEvent(e: AppEvent) {
  switch (e.type) {
    case 'download':
      e; // 타입이 DownloadEvent
      break;
    case 'upload':
      e; // 타입이 UploadEvent
      break;
  }
}
```

만약 타입스크립트가 타입을 식별하지 못한다면, 식별을 돕기 위해 커스텀 함수를 도입할 수 있다.

```ts
function isInputElement(el: HTMLElement): el is HTMlInpuElement {
  return 'value' in el;
}

function getElementContent(el: HTMLElement) {
  if (isInputElement(el)) {
    el; // 타입이 HTMLInputElement
    return el.value;
  }
  el; // 타입이 HTMLElement
  return el.textContent;
}
```

이러한 기법을 **'사용자 정의 타입 가드'**라고 한다. 반환 타입의 `el is HTML InputElement`는 함수의 반환이 `true`인 경우 타입 체커에게 매개변수의 타입을 좁힐 수 있다고 알려준다.

어떤 함수들은 타입 가드를 사용해 배열과 객체의 타입을 좁힐 수 있다. 예를 들어, 배열에서 어떤 탐색을 수행할 때 `undefined`가 될 수 있는 타입을 사용할 수 있다.

```ts
const jackson5 = ['Jackie', 'Tito', 'Jermaine', 'Marlon', 'Michael'];
const members = ['Janet', 'Michael'].map((who) =>
  jackson5.find((n) => n === who)
); // 타입이 (string | undefined)[]
```

`filter` 함수를 사용해 `undefined`를 걸러 내려고 해도 잘 동작하지 않을 것이다.

```ts
const member = ['Janet', 'Michael']
  .map((who) => jackson5.find((n) => n === who))
  .filter((who) => who !== undefined); // 타입이 (string | undefiend)[]
```

이럴 때 타입 가드를 사용하면 타입을 좁힐 수 있다.

```ts
function isDefined<T>(x: T | undefined): x is T {
  return x !== undefined;
}
const memebers = ['Janent', 'Michael']
  .map((who) => jackson5.find((n) => n === who))
  .filter(isDefined); // 타입이 string[]
```

### 타입스크립트 분기문으로 타입을 좁힐 때 주의 사항

타입스크립트는 일반적으로 조건문에서 타입을 좁히는 데 매우 능숙하다. 그러나 타입을 섣불리 판단하는 실수를 저지르기 쉬우므로 꼼꼼히 따져 봐야 한다. 예를 들어, 다음 예제는 유니온 타입에서 `null`을 제외하기 위해 잘못된 방법을 사용한 예제다.

```ts
const el = document.getElementById('foo'); // 타입이 HTMLElement | null
if (typeof el === 'object') {
  el; // 타입이 HTMLElement | null
}
```

자바스크립트에서 `typeof null`은 `object`이기 때문에 if구문에서 `null`이 제외되지 않는다. 또한 기본형 값이 잘못되어도 비슷한 사례가 발생한다.

```ts
function foo(x?: number | string | null) {
  if (!x) {
    x; // 타입이 string | number | null | undefined;
  }
}
```

빈 문자열 `''`과 `0` 모두 `false`가 되기 때문에 타입은 전혀 좁혀지지 않았고 `x`는 여전히 블록 내에서 `string` 또는 `number`가 된다.
