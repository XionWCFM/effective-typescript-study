# 추론 가능한 타입을 사용해 장황한 코드 방지하기

- 타입 추론이 된다면 명시적 타입 구문은 필요하지 않음.
- 오히려 가독성을 해침.
- 타입을 확신하지 못한다면 편집기를 통해 체크하면 됨.

예를 들어 타입 구문을 사용을 해도 `number`로 추론이 가능하기 때문에 타입 구문을 안해줘도 됨.

```ts
let x: number = 12;
let y: = 10; // 타입이 number 추론 됨. 그래서 일반적으로 원시 값은 타입 구문을 명시 안해줘도 됨.
```

하지만 타입이 추론될 수 있음에도 여전히 타입을 명시하고 싶은 몇 가지 상황이 있을 수 있음.

### 객체 리터럴을 정의할 때

```ts
const elmo: Product = {
  name: "Tickle Me Elmo",
  id: "048188 627152",
  price: 28.99,
};
```

객체 리터럴을 정의할 때 타입을 명시하면 **잉여 속성 체크**가 동작함. 잉여 속성 체크는 선택적 속성이 있는 타입의 오타 같은 오류를 자는데 효과적이다.

### 함수의 반환 타입을 명시하여 오류를 방지

함수의 반환에도 타입을 명시하여 오유를 방지할 수 있다. 타입 추론이 가능할지라도 구현상의 오류가 함수를 호출한 곳까지 영향을 미치지 않도록 하기 위해 타입 구문을 명시하는게 좋다.

주식 시세를 조회하는 함수의 에시를 살펴보자.

```ts
function getQuote(ticker: string) {
  return fetch(`https://quotes.example.com/?q=${tick}`).then((response) =>
    response.json()
  );
}
```

이미 조회한 종목을 다시 요청하지 않도록 캐시를 추가하자.

```ts
const cache: { [ticker: string]: number } = {};

function getQuote(ticker: string) {
  if (ticker in cache) {
    return cache[ticker];
  }

  return fetch(`https://quotes.example.com/?q=${tick}`)
    .then((response) => response.json())
    .then((quote) => {
      cache[ticker] = quote;
      return quote;
    });
}
```

그런데 위의 코드에는 오류가 있다. `getQuote`는 항상 `Promise`를 반환하므로 if 구문에는 `cache[ticker]`가 아니라 `Promise.resolove(cache[ticker])`가 반환 되도록 해야 한다. 위의 코드를 실행해보면 오류가 발생하는데 `getQuote` 내부가 아닌 `getQuote`를 호출한 코드에서 발생한다.

```ts
getQuote("MSFT").then(considerBuying);
// ~~~~ 'number | Promise<any>' 형식에 'then' 속성이 없습니다.
//      'number' 형식에 'then' 속성이 없습니다.
```

오류의 위치를 제대로 표시해주는 이점 외에도 반환 타입을 명시해야 하는 이유가 두 가지 더 있습니다.

1. 반환 타입을 명시하면 함수에 대해 더 명확하게 알 수 있다.
   반환 타입을 명시하려면 구현하기 전에 입력 타입과 출력 타입이 무엇인지 알아야 한다. 미리 타입을 명시하는 방법은 함수를 구현하기 전에 테스트를 먼저 작성하는 테스트 주도 개발과 비슷하다.
2. 명명된 타입을 사용하기 위해서
   다음 함수에서는 반환 타입을 명시하지 않는다면, 타입스크립트는 `{x: number, y: number}`로 추론합니다.

   ```ts
   interface Vector2D {
     x: number;
     y: number;
   }
   function add(a: Vector2D, b: Vector2D) {
     return { x: a.x + b.x, y: a.y + b.y };
   }
   ```

   만약 해당 함수의 리턴 타입이 추론된 `{x: number, y: number}`가 아닌 `Vector2D` 타입으로 명시해서 보여준단면 직관적인 표현이 가능하다. 그리고 반환 값을 별도의 타입으로 정의하면 타입에 대한 주석을 작성할 수 있어서 자세한 설명을 추가할 수도 있다. 추론된 반환 타입이 복잡해질수록 명명된 타입을 제공하는 것이 큰 이점이 된다.
