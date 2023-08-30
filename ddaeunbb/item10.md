###📌 ITEM-10. 객체 래퍼 타입 피하기

#### 래퍼 객체란?

래퍼 객체란 `string` 타입을 예시로 들었을 때, `charAt` 메서드를 사용한다고 가정해보겠습니다.

자바스크립트는 기본형을 `String` 객체로 래핑하고, 메서드를 호출하고 마지막에 래핑한 객체를 버립니다. 버리는 이객체를 래퍼객체라고 합니다.

객체 레퍼 타입은 종종 당황스러운 동작을 보일 때가 있는데요,

```javascript
x = "hello"
> x.language = 'English'
'English'
> x.language
undefined
```

실제로 String객체로 변환된 후, `x.language`에 속성이 추가되고 바로 가비지 콜렉터 대상이 되어 버려진 것입니다.
다른 기본형에도 객체 래퍼 타입이 존재합니다. `number`, `boolean`, `symbol`, `bigint` 모두 존재합니다. 하지만 `null`과 `undefined`에는 객체 래퍼가 없습니다.
<br>

#### 래퍼 객체의 문제점?

아래는 정상적으로 동작하는 것처럼 보입니다.

```typescript
function getStringLen(foo: String) {
  return foo.length;
}

getStringLen("hello"); // 정상작동
getStringLen(new String("hello")); // 정상작동
```

하지만 string을 매개변수로 받는 메서드에 `String`객체를 전달하는 순간 문제가 발생합니다.
<br>

```typescript
function isGretting(phrase: String) {
  return ["hello", "good day"].includes(phrase);
}
// 'String' 형식의 인수는 'string'형식의 매개변수에 할당될 수 없습니다.
// 'string'은 기본 개체지만 'String'은 래퍼 개체입니다.
// 가능한 경우 'string'을 사용하세요.
```

즉 위의 예시는 `string`은 `String`에 할당할 수 있지만 그 반대는 할당할 수 없다는 에러가 뜨게 됩니다.

```typescript
const s: String = "primitive";
const n: Number = 1022;
const b: Boolean = true;
```

위와 같이 기본형 타입을 객체 래퍼에 할당할 수 있지만, 책에서는 굳이 이렇게 사용해서 할 필요가 없다고 이야기하고 있습니다. 따라서 기본형타입을 사용하는 것을 권장하고 있습니다.

> new 없이 BigInt와 Symbol을 호출하는 경우는 기본형을 생성하기 때문에 사용해도 괜찮습니다.

```javascript
> typeof BigInt(1234)
"bigint
> typeof Symbol('sym')
"symbol
```

하지만 위는 '값'이고 타입은 아닙니다.
