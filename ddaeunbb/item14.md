###📌 ITEM-14. 타입 연산과 제너릭 사용으로 반복 줄이기

```typescript
interface State {
  userId: string;
  pageTitle: string;
  recentFiles: string[];
  pageContents: string;
}

// 1) 첫번째 방법
type TopNavState = {
  userId: State["userId"];
  pageTitle: State["pageTitle"];
  recentFiles: State["recentFiles"];
};

// 2) 두번째 방법
type TopeNavSTate = {
  [k in "userId" | "pageContents" | "pageTitle"]: State[k];
};
```

그리고 매핑된 타입은 배열의 필드를 도는 것과 같은 방식이라고 합니다. 이 패턴은 표준 라이브러리에서도 일반적으로 찾을 수 있으며, Pick이라고 합니다.

```typeScript
// type Pick<T,K> = { [k in K]: T[k] };
type daeun = Pick<State, 'userId' | 'pageTitle' | 'recentFiles'>;
```

- 완전히 같지는 않지만, 위와 같이 활용할 수 있다고 합니다.

그리고 이전에 경험해본 적이 있긴 했었는데 매번 하나의 프로퍼티에 정해진 값만 오도록 설정해야했는데, 그런 경우 매번 타입에 추가되는 속성을 매번 적어주어야했었습니.

```typescript
interface SaveAction {
  type: 'save';
  ...
}

interface LoadAction {
  type: 'load';
}
type Action = SaveAction | LoadAction;
type ActionType = 'save' | 'load'; // 순수 입력해주어야함.
```

하지만 Action 유니온을 인덱싱하면 타입 반복 없이 ActionType을 정의할 수 있습니다.

```typescript
type ActionType = Action["type"]; // "save" or "load"
```

매우 간편 !! Pick을 활용해서도 설정할 수 있습니다. (물론 객체로)

```typescript
type ActionType = Pick<[Action, "type"]>;
// { type: "save" | "load" }
```

<br>

또한 생성하고 난 다음에 업데이트가 되는 클래스를 정의한다면, update 메서드 매개변수의 타입은 생성자와 동일한 매개변수이면서, 타입 대부분이 선택적 필드가 됩니다.

```typescript
interface Options {
  width: number;
  height: number;
  color: string;
  label: string;
}

interface OptionsUpdate {
  width?: number;
  height?: number;
  color?: string;
  label?: string;
}

class UIWidget {
  constructor(init: Options) {
    /* ... */
  }
  update(options: OptionsUpdate) {
    /* ... */
  }
}
```

즉, 타입을 한번 생성하고 난 다음에 정적으로 유지되는게 아니라 계속 업데이트를 하면서 타입을 수정할 수 있는 것인데요, 저는 이부분이 신기했습니다.

```typescript
type OptionsUpdate = { [k in keyof Options]?: Options[k] };
```

keyof는 타입을 받아서 속성 타입의 유니온을 반환합니다.

```typescript
type OptionsKeys = keyof Options;
// 타입이 'width' | 'height' | 'color' | 'label'
```

매핑된 타입이 ([k in keyof Options])를 순회하며 Options 내 k 값에 해당하는 속성이 있는지 찾습니다. ?는 각 속성을 선택적으로 만들게 됩니다. 이 패턴 역시 일반적인 표준 라이브러리에 `Partial`이라는 이름으로 포함되어 있다고 합니다.

- 값의 형태에 해당하는 타입을 정의하고 싶을 때도 있습니다.

```typescript
const INIT_OPTIONS = {
  width: 640,
  height: 480,
  color: "#00FF00",
  label: "VGA",
};

// interface Options {
//   width: number;
//   height: number;
//   color: string;
//   label: string;
// }

// 위의 주석과 같은 형태로 정해지게 됨.
type Options = typeof INIT_OPTIONS;
```

이 코드는 자바스크립트의 런타임 연산자 typeof를 사용한 것처럼 보이지만, 실제로는 타입스크립트 단계에서 연산된다고 합니다. 그리고 훨씬 더 정확하게 타입을 표현합니다.
그런데 순서가 중요한데요, 타입 정의를 먼저하고 값이 그 타입에 할당 가능하다고 선언하는 것이 좋다고 합니다. 그렇게 해야 더 명확하고, 예상하기 어려운 타입 변동을 방지할 수 있습니다.

- 함수나 메서드의 반환 값에 따라 명명된 타입을 만들고 싶을 수도 있습니다.

```typescript
function getUserInfo(userId: string) {
  //.~~
  return {
    userId,
    name,
    age,
    height,
    weight,
    favoriteColor,
  };
}
```

이때는 조건부 타입이 필요합니다. 하지만 표준 라이브러리에는 이러한 일반적 패턴의 제너릭 타입이 정의되어 있습니다. 이런 경우 ReturnType 제너릭이 정확히 들어맞습니다.

```typescript
type UserInfo = ReturnType<typeof getUserInfo>;

function daeun(a: string) {
  return {
    a,
    b: 12,
    c: "daeun",
  };
}

type Daeun = ReturnType<typeof daeun>;
// type Daeun = {
//     a: string;
//     b: number;
//     c: string;
// }
```

- 함수에서 매개변수로 매핑할 수 있는 값을 제한하기 위해 타입 시스템을 사용하는 거서럼 제너릭 타입에 매개변수를 제한할 수 있는 방법이 필요합니다. 제네릭타입에서 매개변수를 제한할 수 있는 방법은 extends를 사용하는 것입니다.

```typescript
interface Name {
  first: string;
  last: string;
}
type DancingDuo<T extends Name> = [T, T];

const couple1: DancingDuo<Name> = [
  { first: "Fred", last: "Astaire" },
  { first: "Ginger", last: "Rogers" },
]; // OK
const couple2: DancingDuo<{ first: string }> = [
  // ~~~~~~~~~~~~~~~
  // Property 'last' is missing in type
  // '{ first: string; }' but required in type 'Name'
  { first: "Sonny" },
  { first: "Cher" },
];
```

`{first: string}`은 Name을 확장하지 않기 때문에 오류가 발생합니다.
