# 타입스크립트의 타입 시스템

대부분의 전통적인 프로그래밍 언어들의 타입 시스템은

완전히 정적이거나 완전히 동적으로 확실히 구분되어 있곤 합니다.

그러나 타입스크립트는 선택적이고 점진적이기 때문에

정적이면서 동적인 특성을 동시에 가집니다.

따라서 타입스크립트는 프로그램의 일부분에만 타입 시스템을 적용하는 것도 가능합니다.

이러한 특징으로 인해 타입스크립트는 점진적 마이그레이션이 가능합니다.

점진적 마이그레이션을 할 때에 가장 핵심적인 키워드는 `any`라고 할 수 있는데

왜냐하면 any는 코드의 일부분에 타입 체크를 비활성화 시키는 역할을 수행할 수 있기 때문입니다.


# any 타입 잘 사용하기

any 타입은 타입스크립트에서 없어선 안될 타입 중 하나입니다.

unknown과 함께 모든 타입의 top type 역할을 수행하며 앞서 서술한 바와 같이 타입체크를 비활성화 시켜주기 때문입니다.

그러나 any 타입은 그만큼 위험성도 높습니다.

따라서 any 타입은 잘 사용하는 것이 중요해요

# any 타입은 가능한 좁은 범위에만 사용하기

1. 함수의 반환 타입은 타입을 지정해줄 것

그렇지 않으면 그 함수를 사용하는 모든 곳에 any가 전염병처럼 퍼지게 됩니다.

2. 강제로 타입 오류를 제거하고 싶다면 차라리 @ts-ignore 키워드를 사용하세요

```tsx
// @ts-ignore
```

3. 최소한의 범위에서만 any를 사용하세요

객체 전체를 any로 지정하는 대신

값이 확실치 않은 프로퍼티에만 any를 지정하는 등의

방법을 사용하면 됩니다.

```tsx
const config:Config = {
    a:1,
    b:2,
    c:{
        key:value as any
    }
}
```

