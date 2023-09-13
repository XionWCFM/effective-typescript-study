# 2장 타입스크립트의 타입 시스템

## ITEM16. number 인덱스 시그니처 보다는 Array, 튜플, ArrayLike를 사용하기(number-index)
- 자바스크립트 런타임에는 ECMAScript 표준이 서술하는 것처럼 문자열 키로 인식을 하지만, 타입스크립트에서 혼란을 바로잡기 위해 숫자 키를 허용하고, 문자열 키와 다른 것으로 인식합니다. (실제 러타임에 사용되는 것은 string 타입입니다.)
```ts
interface Array<T> {
    // ...
    [n:number]: T
}
```

- 인덱스 시그니처에 number를 사용하기 보다는 Array, 튜플, ArrayLike를 사용하기(number-index)