# 기타

## typeof에서의 object

타입 가드를 작성할 때 typeof로 object 타입인지를 확인하면 object에 null이 포함된다. 따라서 typeof 연산자를 이용하여 object 타입을 체크하는 타입가드를 작성할 때, 그 값이 null 인지 한번 더 체크가 필요하다.

```ts
// 잘못된 타입 체크
function getElement(elOrId: string | HTMLElement | null): HTMLElement {
  if (typeof elOrId === 'object') {
    return elOrId;
    // ~~~~~~~~~~~~~~ 'HTMLElement | null' is not assignable to 'HTMLElement'
  } else if (elOrId === null) {
    return document.body;
  } else {
    const el = document.getElementById(elOrId);
    return el;
    // ~~~~~~~~~~ 'HTMLElement | null' is not assignable to 'HTMLElement'
  }
}

// 수정된 코드
function getElement(elOrId: string | HTMLElement | null): HTMLElement {
  if (elOrId === null) {
    return document.body;
  } else if (typeof elOrId === 'object') {
    return elOrId;
  } else {
    const el = document.getElementById(elOrId);
    return el === null ? document.body : el;
  }
}
```
