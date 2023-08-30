# 아이템9. 타입 단언보다는 타입 선언을 사용하기

타입 단언(as Type)은 강제로 타입을 지정했으니 타입 체커에게 오류를 무시하라고 하는 것이다. 따라서 런타임 오류를 줄이기 위해서 꼭 필요한 경우를 제외하고는 타입 단언을 지양하고 타입 선언(: Type)을 사용해야 한다.

## 타입 단언이 꼭 필요한 경우

- 타입스크립트는 DOM에 접근할 수 없다. 따라서 타입스크립트가 알지 못하는 정보를 제공하기 위해서는 타입 단언문을 사용해야 한다.

  ```ts
  document.querySelector('#myButton').addEventListener('click', (e) => {
    const button = e.currentTarget as HTMLButtonElement; // e.currentTarget의 원래 타입은 EventTarget이다.
  });
  ```

- null이 아니라고 확신할 수 있을 때 non-null(`!`)을 이용한다. 만약 null이 아니라고 확신할 수 없으면 타입 가드로 null을 체크해주어야 한다.

## 기타

- 모든 타입은 unknown의 서브 타입이다. 따라서 unknown이 포함된 단언문은 항상 동작하며, 임의의 타입 간에 변환을 가능하게 한다. 이는 어떠한 오류를 발생시킬 수 있음을 인지하고 사용해야 한다.
