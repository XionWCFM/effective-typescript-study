# 매핑된 타입을 이용한 코드 줄이기

```tsx
type TopNavState = {
    userId:State['userId'];
    pageTitle:State['pageTitle'];
    recentFiled:State['recentFiles']
}

```

특정 타입을 인덱싱하여 속성의 타입에서 중복을 제거하는 방법을 사용할 수 있습니다.

그러나 이 코드는 매핑된 타입을 이용하여 더욱 간결하게 단축할 수 있습니다.

예를 들어보겠습니다.


```tsx
type State = {
    userId: string;
    pageTitle:string;
    recentFiles:string;
}

type TopNavState = {
    [k in 'userId' | 'pageTitle' | 'recentFiles'] : State[k] 
}

```

이렇게 in 문을 이용하여 매핑되는 타입들을 구현할 수 있습니다.

만약 정확히 같은 타입을 매핑된 타입으로 확장하고자 한다면 어떨까요?

```tsx
type State = {
    userId: string;
    pageTitle:string;
    recentFiles:string;
}

type TopNavState = {
    [Property in keyof State] : State[Property] 
}

```
keyof 문을 조합하여 사용하는 것을 통해 더욱 단축하여 적을 수 있습니다.

다만 이 경우 State에 포함된 모든 프로퍼티들을

TopNavState가 받을 수 있음을 의미하게됩니다.

이를 조금 다르게 표현하기 위해 유틸리티 타입을 활용하여 보겠습니다.

```tsx

type State = {
  userId: string;
  pageTitle: string;
  recentFiles: string;
};

type PickState = {
  [Property in keyof Pick<State, 'userId'>]: State[Property];
};

const brince: PickState = {
  userId: '석현',
};

```

유틸리티 타입 Pick을 이용하는 것을 통해

State 타입에서 필요한 프로퍼티만 뽑아서 포함시킬 수 있도록 작성했습니다.

이러한 MappedTypes, utility type , generic 은

타입스크립트의 타입의 DRY(don't repeat yourself)

원칙을 지키는 데 큰 도움을 줍니다.


<br/>

또한 타입들간의 매핑을 위해 keyof, typeof , returnType 등

타입스크립트에서 제공하는 연산자들을 적절히 활용할 줄 아는 것도 중요합니다.

