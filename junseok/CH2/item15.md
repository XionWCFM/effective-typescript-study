# 2장 타입스크립트의 타입 시스템

## ITEM15. 동적 데이터에 인덱스 시그니처 사용하기(index-for-dynamic)
```ts
type Rocket = {[property: string]: string};
```
위의 코드가 인텍스 시그니처를 사용한 예시이며, 세 가지의 의미를 담고 있습니다.
- 키의 이름: 키의 위치만 표시하는 용도입니다.
- 키의 타입: string이나 number 또는 symbil 조합이어야 하지만, 보통은 string을 사용합니다.
- 값의 타입: 어떤 값이든 될 수 있습니다.