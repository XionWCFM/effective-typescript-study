# 인덱스 시그니처를 활용한 동적데이터 타이핑

코드를 작성하다보면 쉽게 인덱스 시그니처와 관련된 문제를 만나게 됩니다.

예컨대 데이터로 들어올 값의 타입은 예상할 수 있지만

얼마나 많은 프로퍼티가 들어올지 모르는 경우

혹은 동적으로 프로퍼티가 계속 추가될 수 있는 경우 등의 까다로운 상황들이 존재합니다.


<br/>

인덱스 시그니처는 바로 이러한 부분들을 해결합니다.

이펙티브 타입스크립트에서는 데이터 A, B, C , D와 같은 키가 있지만

얼마나 많은 키가 있는지 모르는 경우가 있습니다.

코드로 확인해보겠습니다.

```tsx
intercae Row1 {
    [column:string]: number
}

```

인덱스 시그니처를 활용한 타입입니다.

이러한 타이핑은 너무 많은 타입을 허용하게 됩니다.

옵셔널 연산자를 이용하면 어떨까요?

```tsx
interface Row2 {
    a:number;
    b?:number;
    c?:number;
    d?:number;
}
```

프로퍼티의 키를 a,b,c,d만 받을 수 있도록 범위를 좁혔고

b,c,d는 선택적으로 받을 수 있습니다.

```tsx
type Row3 = | {a:number}
            | {a:number; b:number}
            | {a:number; b:number; c:number}
            | {a:number; b:number; c:number; d:number}

```

유니온 타입을 통하여 모델링을 하면 다음과 같습니다.

가장 정확한 타이핑이지만 동시에 사용하기 번거롭다는 단점이 있습니다.


# Record 타입 사용하기

Record는 키 타입에 유연성을 제공하는 제너릭 타입입니다.

Record Type은

```tsx
Record<Key,Type>
```

형식으로 사용하며 Version 2.1부터 사용할 수 있게 된 유틸리티 타입입니다.

Record 타입은 인덱스 시그니처와 매우 유사한 성격을 지니고 있습니다.

그러나 구문관점에서 보면 인덱스 시그니처가 더 좋아보입니다.

인덱스 시그니처는 key의 의도를 더 명확하게 설명하기 때문입니다.

```tsx
intercae Row1 {
    [column:string]: number
}

type Row2 = Record<string, number>

```
Record 타입을 사용한 Row2는 키의 성격을 알 수 없습니다.

하지만 인덱스 시그니처를 사용한 경우 column이라는 key의 의도를 이해할 수 있습니다.


그러나 인덱스 시그니처는 문자열 리터럴을 key로 사용하는 경우 오류가 발생합니다.

```tsx
type human = {
    [name:'브린스'|'이석현'|'제이팍']: number // << Error!
}
```
하지만 Record 타입은 Key의 문자열 리터럴을 허용합니다.

따라서 속성을 제한하고 싶은 경우 문자열 리터럴을 이용해

Key에 허용되는 값을 제한할 수 있다는 장점이 존재합니다.

# 매핑된 타입

item 14에서 학습한 Mapped Types를 이용해서

Record Type이 수행해준 일을 비슷하게 수행할 수 있습니다.

```tsx

type MappedHuman = {
    [k in '브린스'|'이석현'|'제이팍']: number
}

```

# 가능하다면

인덱스 시그니처의 사용은 피치못하는 경우에만 이루어지는 게 좋습니다.

Record, Mapped Types 역시도 마찬가지입니다.



# 레퍼런스

https://developer-talk.tistory.com/296