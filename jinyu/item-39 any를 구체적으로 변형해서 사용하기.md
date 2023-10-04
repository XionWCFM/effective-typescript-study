# any를 구체적으로 변형해서 사용하기

`any`는 자바스크립트에서 표현할 수 있는 모든 값을 아우르는 매우 큰 범위의 타입이다. `any` 타입에는 모든 숫자, 문자열, 배열, 객체, 정규식, 함수, 클래스, DOM 엘리먼트는 물론 `null`과 `undefined`까지도 포함된다.

따라서 `any`는 굉장히 다양한 타입들을 포함하기 때문에 구체적으로 표현해주는 것이 좋다.

예를 들어 배열의 길이를 리턴하는 함수를 보자.

```ts
function getLengthBad(array: any) {
  // 이렇게 하지말자. 이 함수의 반환 값은 `any`가 된다.
  return array.length;
}

function getLength(array: any[]) {
  // 이 함수의 반환 값은 `number`가 된다.
  return array.length;
}
```

`any`보다 `any[]`를 사용하는 이유는 다음과 같다.

- 함수 내의 `array.length` 타입이 체크된다.
- 함수의 반환 타입이 `any` 대신 `number`로 추론된다.
- 함수 호출될 때 매개변수가 배열인지 체크된다.

함수의 매개변수가 배열의 배열 형태라면 `any[][]`, 객체이긴 하나 값을 알 수 없다면 `{[key:string] any}`처럼 선언하면 된다.

```ts
function hasTwelveLetterKey(o: { [key: string]: any }) {
  for (const key in o) {
    if (key.length === 12) {
      return true;
    }
  }
  return false;
}
```

`{[key:string] any}` 대신 모든 비기본형(non-primitve) 타입을 포함하는 `object` 타입을 사용할 수도 있다. `object` 타입은 객체의 키를 열거할 수는 있지만 속성에 접근할 수 없다는 점에서 `{[key:string] any}`와 약간 다르다.

```ts
function hasTwelveLetterKey(o: object) {
  for (const key in o) {
    if (key.length === 12) {
      console.log(key, o[key]);
      // ~~~~~~~~~ '{}' 형식에 인덱스 시그니처가 없으므로 요소에 암시적으로 `any` 형식이 있습니다.

      return true;
    }
  }
  return false;
}
```

객체지만 속성에 접근할 수 없어야 한다면 `unknown` 타입이 필요한 상황일 수도 있다. `unknown` 타입에 대해서는 아이템 42에서 다룬다.

함수의 타입에도 단순히 `any`를 사용해서는 안된다. 최소한으로나마 구체저화할 수 있는 세가지 방법이 있다.

```ts
type Fn0 = () => any; // 매개변수 없이 호출 가능한 모든 함수
type Fn1 = (arg: any) => any; // 매개변수 1개
type FnN = (...arg: any[]) => any; // 모든 개수의 매개변수 "Function" 타입과 동일
```
