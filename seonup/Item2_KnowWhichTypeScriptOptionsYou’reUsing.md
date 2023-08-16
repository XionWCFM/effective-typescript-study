# 아이템2. 타입스크립트 설정 이해하기

타입스크립트의 설정은 어디서 소스 파일을 찾을지, 어떤 종류의 출력을 생성할지 제어하는 내용과 언어 자체의 핵심 요소들을 제어하는 설정을 포함한다. 때문에 어떻게 설정하느냐에 따라 완전히 다른 언어처럼 느껴질 수 있다.

타입스크립트의 설정은 커멘드 라인으로 명령어를 입력하거나 tsconfig.json 설정 파일을 이용하여 설정할 수 있는데, 협업하는 동료나 다른 도구들이 알 수 있도록 하려면 커멘드라인 설정 대신 tsconfig.json 설정 파일을 이용하는 것이 좋다.

## 설정 옵션

설정을 제대로 사용하기 위해서는 `noImplicitAny`와 `strictNullChecks`를 이해해야 한다.

### `noImplicitAny`

단어 그대로 암시적인 `any` 타입을 허용하지 않겠다는 옵션으로, 설정시 코드를 작성할 때 명시적으로 `any`를 선언해 주거나 더 분명한 타입을 사용해야 한다.

타입스크립트는 타입 정보를 가질 때 가장 효과적(문제 발견, 가독성 향상, 개발자의 생산성 향상)이기 때문에 모든 변수에 타입을 명시하는 것에 익숙해지는 것이 좋으므로, 자바스크립트로 되어 있는 기존 프로젝트를 타입스크립트로 전환하는 상황이 아니라면 `noImplicitAny`를 설정하는 것이 좋다.

### `strictNullChecks`

`strictNullChecks`는 `null`과 `undefined`가 모든 타입에서 허용되는지 확인하는 설정으로, `noImplicitAny`와 함께 설정해야 하며, 설정시 `Uncaught TypeError: undefined is not an object`와 같은 런타임 에러를 방지할 수 있다.

`strictNullChecks`를 설정했을 때, 아래와 같이 변수의 타입이 `null`나 `undefined`를 포함한 유니언 타입으로 추론되어 발생하는 타입 에러를 방지하려면 `null`나 `undefined`를 체크하는 타입 가드(type guard)나 단언문(assertion)을 추가해야 한다.

```ts
const el = document.getElementById('status');
el.textContent = 'Ready'; // Object is possibly 'null'

// 타입 가드 사용
if (el) {
  el.textContent = 'Ready'; // OK, null has been excluded
}

// non-null(!) 단언문 사용
el!.textContent = 'Ready'; // OK, we've asserted that el is non-null
```
