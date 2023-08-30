###📌 ITEM-12. 함수 표현식에 타입 적용하기
타입스크립트에서는 함수 문장(statement)와 표현식을 다르게 인식합니다. <span style="color:red">하지만 함수의 매개변수부터 반환값까지 전체를 함수 타입으로 선언하여 함수 표현식에 재사용할 수 있다는 장점이 있기 때문에 함수 표현식을 사용하는 것이 좋습니다.</span>

```typescript
type DiceRollFn = (sides: number) => number;
const daeun: DiceRollFn = sides => ~~
```

### 사용성이 좋은 이유

- 불필요한 코드의 반복 제거

```typescript
function add(a: number, b: number) {
  return a + b;
}

function sub(a: number, b: number) {
  return a - b;
}
...
```

위와 같이 사칙연산과 관련된 함수가 있다고 가정했을 시, 매번 매개변수의 type을 지정해주어야합니다.

```typescript
type Binaryfn = (a: number, b: number) => number;

const add: Binaryfn = (a, b) => a + b;
const sub: Binaryfn = (a, b) => a - b;
```

위와 같이 함수 표현식으로 설정하게 되면 코드의 중복을 줄일 수 있습니다.
<br />

- 이미 존재하는 타입을 활용할 수 있다.
  fetch 함수와 같은 타입 선언은 `lib.dom.d.ts`에서 찾아볼 수 있습니다.

```typescript
function fetch(
  input: RequestInfo | URL,
  init?: RequestInit | undefined
): Promise<Response>;
```

따라서 위처럼 fetch함수의 타입이 정의되어있기때문에 이를 재활용해서 정의하려는 함수에 쓸 수있습니다.

```typescript
async function Daeun(input: RequestInfo, init?: RequestInit){
  const response = awiat fetch(input, init);
  if(!response.ok){
    // 비동기 함수 내에서는 거절된 프로미스를 반환합니다.
    throw new Error('Request failed: ' + response.status)
  }
  return response;
}
```

이 코드도 잘 작동하지만 아래와 같이도 사용할 수 있다.

```typescript
const Daeun: typeof fetch = async (input, init) => {
  const response = await fetch(input, init);
  if (!response.ok) {
    // 비동기 함수 내에서는 거절된 프로미스를 반환합니다.
    throw new Error("Request failed: " + response.status);
  }
  return response;
};
```

함수 문장을 함수 표현식으로 바꾸고 함수 전체에 타입을 적용하였다. (typeof)
확연히 더 편한 것 같다..^^;;
또한 타입 구문은 반환 타입을 보장하기 때문에 `throw new Error`를 써야한다. 만약 return 을 하게 된다면 에러를 마주하게 된다.
