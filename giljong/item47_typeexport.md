# 라이브러리 제작자를 위한 가이드입니다.

일반 프로젝트에서는 그리 사용할 일이 많지 않을 것 같습니다.

```tsx

export function getGift(name:SecretName, gift:string):SecretSanta {

}
```
만약 라이브러리 제작자가 이러한 코드를 작성하고 내보냈다고 가정해봅시다.

SecretName , SecretSanta 타입을 따로 export 하지 않았지만

사용자는 getGift에 유틸리티타입들을 이용하여 타입을 추출할 수 있습니다.

따라서 라이브러리 제작자는 타입을 숨기지 말고 그냥 export 해주는 편이 좋습니다.

왜냐하면 어차피 getGift를 외부에 노출하는 순간 타입도 같이 노출되기 때문입니다.

```tsx
type MySanta = ReturnType<typeof getGift>
type MyName = Parameters<typeof getGift>[0]
```

이런 식으로요!

하지만 이 방법은 번거로우니까 그냥 처음부터 export 해주는 게 더 좋을 것입니다.

# 마치며

리턴타입은 자주 빼오긴 했는데 파라미터 타입 빼오는 부분은 처음봐서 가져와봤습니다.