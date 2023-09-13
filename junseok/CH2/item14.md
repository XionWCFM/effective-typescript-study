# 2장 타입스크립트의 타입 시스템

## ITEM14. 타입연산과 제너릭 사용으로 반복 줄이기(map-between-types)
- 타입 정의에서도 DRY(Don't repeat yourself)의 장점을 적용할 수 있습니다. 이때 반복을 줄이는 가장 간단한 방법은 타입에 이름을 붙이는 것입니다. (타입 별칭)
```ts
interface State {
  userId: string;
  pageTitle: string;
  recentFiles: string[];
  pageContents: string;
}
// 중복되어 사용
interface TopNavState {
  userId: string;
  pageTitle: string;
  recentFiles: string[];
}

// 여전히 중복되어 사용
type TopNavState = {
  userId: State['userId'];
  pageTitle: State['pageTitle'];
  recentFiles: State['recentFiles'];
};

// 다음과 같이 축약 할 수 있습니다.
type TopNavState = {
  [k in 'userId' | 'pageTitle' | 'recentFiles']: State[k]
};
```

- 이는 일반적으로 표준 라이브러리 [`Pick`](https://www.typescriptlang.org/docs/handbook/utility-types.html#picktype-keys)에서 찾을 수 있는 패턴입니다.

```ts
type TopNavState = Pick<State, 'userId' | 'pageTitle' | 'recentFiles'>;
```

- 매핑된 타입관 `keyof`를 사용하면 유용하게 필요한 타입을 작성할 수 있습니다.
```ts
interface Options {
  width: number;
  height: number;
  color: string;
  label: string;
}
type OptionsUpdate = {[k in keyof Options]?: Options[k]};
```

- typeof를 사용하여 기존의 변수에 대응하는 타입을 생성할 수 있습니다. 이는 타입스크립트 단계에서 연산이 됩니다. 
```ts
const INIT_OPTIONS = {
  width: 640,
  height: 480,
  color: '#00FF00',
  label: 'VGA',
};
type Options = typeof INIT_OPTIONS;
```

- 제네릭 타입에서 매개변수를 제한 할 수 있는 방법은 `extends`(부분집합)를 사용하는 것입니다. `extends`를 사용하면 제너릭 매개변수가 특정 타입을 확장한다고 선언할 수 있습니다.

```ts
interface Name {
  first: string;
  last: string;
}
type DancingDuo<T extends Name> = [T, T];

const couple1: DancingDuo<Name> = [
  {first: 'Fred', last: 'Astaire'},
  {first: 'Ginger', last: 'Rogers'}
];  // OK
const couple2: DancingDuo<{first: string}> = [
                       // ~~~~~~~~~~~~~~~
                       // Property 'last' is missing in type
                       // '{ first: string; }' but required in type 'Name'
  {first: 'Sonny'},
  {first: 'Cher'}
];
```