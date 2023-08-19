# npm 의 type-cover-age 패키지로 any 추적

npm의 type-cover-age 패키지를 통해 any를 추적할 수 있습니다

```
npx type-coverage
9985 / 10117 98.69%
```

이는 프로젝트의 10117개의 심벌 중 9985개가 

any가 아니거나 any의 별칭이 아닌 타입을 갖고 있다는 것을 의미합니다.

```
npx type-coverage --detail
path/top/code.ts:1:10 getColumnInfo

```

detail 플래그를 붙이는 것을 통해 any의 근원지를 찾을 수 있습니다.

# 마치며

any 타입은 최대한 사용을 억제하는 방향으로 설계를 해왔는데

자바스크립트 -> 타입스크립트로의 점진적 마이그레이션을 고려하고 있을 때에는 유용하게 사용할 것 같습니다.

