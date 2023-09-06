## Item 19 - 추론 가능한 타입을 사용해 장황한 코드 방지하기

### 타입스크립트의 많은 타입 구문은 사실 불필요합니다.

```ts
let x: number = 12; // x
let x = 12; // o
```

타입스크립트는 자동적으로 타입을 추론하기 때문에, 타입 추론이 된다면 명시적인 타입 구문은 불필요합니다.

```ts
const person: {
  name: string;
  born: {
    where: string;
    when: string;
  };
  died: {
    where: string;
    when: string;
  }
} = {
  name: 'Sojourner Truth',
  born: {
    where: 'Swartekill, NY',
    when: 'c.1797',
  },
  died: {
    where: 'Battle Creek, MI',
    when: 'Nov. 26, 1883'
  }
};
// X

const person = {
  name: 'Sojourner Truth',
  born: {
    where: 'Swartekill, NY',
    when: 'c.1797',
  },
  died: {
    where: 'Battle Creek, MI',
    when: 'Nov. 26, 1883'
  }
};
// O
```
```ts
function square(nums: number[]) {
  return nums.map(x => x * x);
}
const squares = square([1, 2, 3, 4]); // number[]
```

타입스크립트는 위의 예제와 같이 복잡한 객체나 배열도 올바르게 타입 추론을 할 수 있습니다.

<br>

### 타입이 추론될 수 있어도 타입을 명시하면 좋은 상황들

#### 객체 리터릴을 정의할 때

```ts
const elmo: Product = {
  name: 'Tickle Me Elmo',
  id: '048188 627152',
  price: 28.99,
}
```
이 정의에 타입을 명시하면 잉여 속성 체크가 동작합니다.

타입 구문을 제거한다면 객체를 선언한 곳이 아니라 객체가 사용되는 곳에서 타입 오류가 발생합니다.

```ts
const furby = { // 타입 구문 제거
  name: 'Furby',
  id: 630509430963,
  price: 35,
};
logProduct(furby);
        // ~~~~~ ... 형식의 인수는 'Product' 형식의 매개변수에 할당될 수 없습니다.
        //       'id' 속성의 형식이 호환되지 않습니다.
        //       'number' 형식은 'string' 형식에 할당할 수 없습니다.
```

타입 구문을 명시하면 실수가 발생한 부분에 오류를 표시합니다.
```ts
const furby: Product = { // 타입 구문 제거
  name: 'Furby',
  id: 630509430963,
  // ~~ 'number' 형식은 'string' 형식에 할당할 수 없습니다.
  price: 35,
};
logProduct(furby);
```

<br>

#### 함수의 반환에 타입을 명시하기

```ts
const cache: {[ticker: string]: number} = {};
function getQuote(ticker: string) {
  if (ticker in cache) {
    return cache[ticker];
  }
  return fetch(`https://quotes.example.com/?q=${ticker}`)
      .then(response => response.json())
      .then(quote => {
        cache[ticker] = quote;
        return quote;
      });
}
```

이 코드에서 getQuote는 항상 Promise를 반환하기 때문에 if 구문에서 cache[ticker]가 아니라 Promise.resolve(cache[ticker])가 반환되도록 해야 합니다. 하지만 getQuote 내부가 아니라 호출한 코드에서 오류가 발생합니다.

```ts
getQuote('MSFT').then(considerBuying);
                // 'number | Promise<any>' 형식에 'then' 속성이 없습니다.
                // 'number' 형식에 'then' 속성이 없습니다. 
```

반환 타입을 제대로 명시하면 올바른 위치에 오류가 표시됩니다.

```ts
const cache: {[ticker: string]: number} = {};
function getQuote(ticker: string) {
  if (ticker in cache) {
    return cache[ticker];
        // 'number' 형식은 'Promise<number>' 형식에 할당할 수 없습니다.
  }
  // ...
}
```

<br>

### 팁

린터를 사용하고 있다면 eslint 규칙 중 no-inferrable-types를 사용항여 작성된 모든 타입 구문이 정말 필요한지 확인할 수 있습니다.