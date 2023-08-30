### 타입 연산과 제너릭 사용으로 반복 줄이기

> 타입 중복은 코드 중복만큼 많은 문제를 발생시킨다.

- 상수를 사용해서 반복을 줄이기

  ```typescript
  function distance(a: { x: number; y: number }, b: { x: number; y: number }) {
    return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
  }

  // 중복 제거 코드
  interface Point2D {
    x: number;
    y: number;
  }

  function distance(a: Point2D, b: Point2D) {
    /*...*/
  }
  ```

- 전체 애플리케이션의 상태를 표현하는 타입의 부분집합으로 타입 만들기

  ```typescript
  interface State {
    userId: string;
    pageTitle: string;
    recentFiles: string[];
    pageContens: string;
  }

  interface TopNavState {
    userId: string;
    pageTitle: string;
    recentFiles: string[];
  }
  ```

  - 이 경우 TopNavState를 확장하여 State를 구성하는 것보다 State의 부분 집합으로 TopNavState를 정의하는 것이 바람직하다.
  - State를 인덱싱하여 속성의 타입에서 중복을 제거할 수 있다.

  ```typescript
  type TopNavState = {
    userId: State['userId'];
    pageTitle: State['pageTitle'];
    recentFiles: State['recentFiles'];
  };
  ```

- '매핑된 타입'을 사용하면 반복되는 코드를 제거할 수 있다.

  ```typescript
  type TopNavState = {
    [k in 'userId' | 'pageTitle' | 'recentFiles']: State[k];
  };

  type TopNavState = Pick<State, 'userId' | 'pageTitle' | 'recentFiles'>;
  ```

  - '매핑된 타입'은 배열의 필드를 루프 도는 것과 같은 방식이다. 👉🏻 Pick

{% hint="info"%}

### Pick

Pick은 T와 K 두 가지 타입을 받아서 결과 타입을 반환한다.

```typescript
interface Product {
  id: number;
  name: string;
  price: number;
  brand: string;
  stock: number;
}

// 상품 목록을 받아오기 위한 api
function fetchProduct(): Promise<Product[]> {
  // ... id, name, price, brand, stock 모두를 써야함
}

type shoppingItem = Pick<Product, 'id' | 'name' | 'price'>;

// 상품의 상세정보 (Product의 일부 속성만 가져온다)
function displayProductDetail(shoppingItem: shoppingItem) {
  // id, name, price의 일부만 사용 or 별도의 속성이 추가되는 경우가 있음
  // 인터페이스의 모양이 달라질 수 있음
}
```

{% endhint %}
