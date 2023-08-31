# 3장 타입스크립트의 타입 추론

## ITEM22. 타입 좁히기(narrowing)

### 다양한 예시
1. null 체크
```ts
const el = document.getElementById('foo'); // Type is HTMLElement | null
if (el) {
  el // Type is HTMLElement
  el.innerHTML = 'Party Time'.blink();
} else {
  el // Type is null
  alert('No element #foo');
}
```
2. instanceof
```ts
function contains(text: string, search: string|RegExp) {
  if (search instanceof RegExp) {
    search  // Type is RegExp
    return !!search.exec(text);
  }
  search  // Type is string
  return text.includes(search);
}
```
3. 속성 체크

```ts
interface A { a: number }
interface B { b: number }
function pickAB(ab: A | B) {
  if ('a' in ab) {
    ab // Type is A
  } else {
    ab // Type is B
  }
  ab // Type is A | B
}
```

4. 사용자 정의 타입 가드(커스텀 함수)
 - `el is HTMLInputElement`는 함수의 반환이 true인 경우, 타입 체커에서 매개변수의 타입을 좁힐 수 있다고 알려 줍니다.

 - 사용자 정의 타입 가드는 주로 ` isTypeName` 형태의 함수명을 많이 사용합니다. 

 - `parameterName is Type`의 의미는 매개변수가 해당 타입인지 구분하는 키워드로 해석됩니다.

 - 따라서 return 문을 `true`로 통과하게 되면 해당 타입과 일치하는 타입임을 알려줍니다.

```ts
// 예시 1
function isInputElement(el: HTMLElement): el is HTMLInputElement {
  return 'value' in el;
}

function getElementContent(el: HTMLElement) {
  if (isInputElement(el)) {
    el; // Type is HTMLInputElement
    return el.value;
  }
  el; // Type is HTMLElement
  return el.textContent;
}
```

```ts
// 예시 2
const jackson5 = ['Jackie', 'Tito', 'Jermaine', 'Marlon', 'Michael'];
function isDefined<T>(x: T | undefined): x is T {
  return x !== undefined;
}
const members = ['Janet', 'Michael'].map(
  who => jackson5.find(n => n === who)
).filter(isDefined);  // Type is string[]
```