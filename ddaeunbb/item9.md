###📌 ITEM-9. 타입 단언보다는 타입 선언을 사용하기

```typescript
iterface Person {
  name: string;
}

const alice: Person = {name: 'Alice'};
const bob = {name: 'Bob'} as Person;
```

위의 두 가지 방법이 같아 보이지만 그렇지 않습니다. 첫 번째 alice는 타입 선언이고 아래는 bob은 타입 단언을 한 것입니다.

타입 단언 같은 경우는 타입스크립트가 추론한 타입이 있더라도 Person 타입으로 간주합니다.

```typescript
const alice: Person = {};
// 'Person' 유형에 필요한 'name' 속성이 없습니다.
const bob = {} as Person;
```

타입 선언은 할당되는 값이 해당 인터페이스를 만족하는지 검사합니다. 앞의 예제는 에러를 표시해주지만, 타입단언을 해준 부분은 오류를 표시하지 않습니다.

이외에 다른 속성이 있는 경우, 에러를 표시해주지만 타입 단언은 에러를 띄우지 않습니다.
<br>

#### 타입 단언이 적절할 때

```typescript
document.querySelector("#myButton").addEventListener("click", (e) => {
  const button = e.currentTarget as HTMLButtonElement;
});
```

타입스크립트는 DOM에 접근할 수 없기 때문에 #myButton이 버튼 엘리먼트인지 알지 못합니다. 따라서 타입스크립트가 알지 못하는 정보를 우리가 가지고 있을 경우에 타입 단언을 쓰는 것이 타당합니다. (정보를 확실히 알 경우에)

또한 null이 아님을 단언하는 경우도 있습니다.
<br>

```typescript
const elNull = document.qetElementById("foo");
// 타입은 HTMLElement | null
const el = document.qetElementById("foo")!;
// 타입은 HTMLElement
```

`!`는 boolean의 부정문입니다. 하지만 접미사로 쓰인 `!`은 Null이 아니라는 단언문으로 쓰이게 됩니다.
이런 단언문은 A가 B의 부분집합인 경우에 타입 단언문을 사용할 수 있습니다.

위의 예시에서는 `HTMLElement`는 `HTMLElement | null`의 서브 타입이기 때문에 사용할 수 있는 것입니다.
