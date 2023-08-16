## Item 9 - 타입 단언보다는 타입 선언을 사용하기

```ts
interface Person { name: string };

const alice: Person = { name: 'Alice' };  // 타입 선언
const bob = { name: 'Bob' } as Person;    // 타입 단언

// 둘 다 타입은 Person
```

타입 선언은 할당되는 값이 인터페이스를 만족하는지 검사해서 오류를 표시할 수 있지만, 타입 단언을 할 경우 강제로 타입을 지정하는 것이기 때문에 오류를 무시할 수 있습니다.
따라서 웬만하면 타입 단언보다는 타입 선언을 사용하는 것이 좋습니다.

하지만 타입 단언을 사용하는 것이 더 좋을 때도 있습니다.

```ts
document.querySelector('#button').addEventListener('click', e => {
  const button = e.currentTarget as HTMLButtonElement;
})
```

위의 예와 같이 타입스크립트는 DOM에 접근할 수 없기 때문에 우리가 알고 있는 타입으로 직접 타입 단언을 해주면 좋습니다.

또한 !을 사용해서 null이 아니라고 단언을 해주는 경우도 있습니다.