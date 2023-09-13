# 타입 좁히기

1. null 체크

```ts
const el = document.getElementById('foo'); // el타입은 HTMLElement | null
if (el) {
  el.innerHTML = 'Party Time'.blink(); // el타입은 HTMLElement
} else {
  alert("No element #foo"); // el타입은 null
}
```

2. 분기문에서 예외를 던지거나 함수를 반환

```ts
const el = document.getElementById('foo'); // el타입은 HTMLElement | null
if (!el) throw new Error('Unable to find #foo');
el.innerHTML = 'Party Time'.blink(); // el타입은 HTMLElement
```

3. instanceof

```ts
function contains(text: string, search: string|RegExp) {
  if (search instanceof RegExp) {
    return !!search.exec(text); // search 타입은 RegExp
  }
  return text.includes(search); // search 타입은 string
}
```

4. 속성 체크

```ts
interface A { a: number }
interface B { b: number }
function pickAB(ab: A | B) {
  if ('a' in ab) {
    ab // 타입은 A
  } else {
    ab // 타입은 B
  }
  ab // 타입은 A | B
}
```

5. 명시적 태그 붙이기

```ts
interface UploadEvent { type: 'upload'; filename: string; contents: string }
interface DownloadEvent { type: 'download'; filename: string; }
type AppEvent = UploadEvent | DownloadEvent;

function handleEvent(e: AppEvent) {
  switch (e.type) {
    case 'download':
      e  // 타입은 DownloadEvent
      break;
    case 'upload':
      e;  // 타입은 UploadEvent
      break;
  }
}
```

6. 사용자 정의 타입 가드

```ts
function isInputElement(el: HTMLElement): el is HTMLInputElement {
  return 'value' in el;
}

function getElementContent(el: HTMLElement) {
  if (isInputElement(el)) {
    el; // 타입은 HTMLInputElement
    return el.value;
  }
  el; // 타입은 HTMLElement
  return el.textContent;
}
```