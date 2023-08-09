## 📌 noImplicitAny, strictNullChecks 를 사용하자!

책에서는 noImplicitAny와 strictNullChecks를 프로젝트에 꼭 사용해보길 권장하고 있습니다.

- noImplicitAny: true로 설정 시,any 타입을 지정할 수 없음
- strictNullChecks: null과 undefined가 모든 타입에서 허용되는지 확인하는 설정

아래와 같이 설정해주면 됩니다.

```json
{
  "compilerOptions": {
    "target": "es5",
    "module": "commonjs",
    "noImplicitAny": true,
    "strictNullChecks": true
  }
}
```

대체로 호환성을 위해서 어떤 버전의 자바스크립트로 변환될지는 target을 es5로 설정한다고 합니다. module에서 commonjs는 require문법, es2015, esnext는 import 문법을 사용합니다.

대체로 IE호환성을 생각한다면 국룰로, es5, commonjs로 설정한다고 합니다.
<br>

##📌 추가적인 설정들

```json
{
  "compilerOptions": {
    "target": "es5",
    "module": "commonjs",

    // js 파일들 ts에서 import해서 쓸 수 있는지
    "allowJs": true,
    // 일반 js 파일에서도 에러체크 여부
    "checkJs": true,

    // tsx 파일을 jsx로 어떻게 컴파일할 것인지
    //'preserve', 'react-native', 'react' 3가지옵션
    "jsx": "preserve",

    //모든 ts파일을 js파일 하나로 컴파일해줌
    // (module이 none, amd, system일 때만 가능)
    "outFile": "./",

    //js파일 아웃풋 경로바꾸기
    "outDir": "./",
    //루트경로 바꾸기 (js 파일 아웃풋 경로에 영향줌)
    "rootDir": "./",
    //컴파일시 주석제거
    "removeComments": true,

    //strict 관련, noimplicit 어쩌구 관련 모드 전부 켜기
    "strict": true,
    //함수파라미터 타입체크 강하게
    "strictFunctionTypes": true,
    //class constructor 작성시 타입체크 강하게
    "strictPropertyInitialization": true,
    //this 키워드가 any 타입일 경우 에러내기
    "noImplicitThis": true,
    //자바스크립트 "use strict" 모드 켜기
    "alwaysStrict": true,
    //쓰지않는 지역변수 있으면 에러내기
    "noUnusedLocals": true,
    //쓰지않는 파라미터 있으면 에러내기
    "noUnusedParameters": true,
    //함수에서 return 빼먹으면 에러내기
    "noImplicitReturns": true,
    //switch문 이상하면 에러내기
    "noFallthroughCasesInSwitch": true,
    // 객체에서 없는 프로퍼티에 접근하면 에러내기
    "noPropertyAccessFromIndexSignature": true
  }
}
```

<br>

###📌 jsx
tsx 파일을 jsx로 어떻게 컴파일 할 것인지를 의미한다.

- 기본값: "preserve"
- "preserve" 는 다른 변환단계(예 : Babel ) 에 사용하도록 결과물의 일부를 유지한다.

즉, preserve로 설정하면 JSX로 컴파일되고 또 바벨이 JS로 컴파일 하는것임 허허!

- "react" 는 React.createElement를 생성하기때문에, 사용전에 JSX 변환이 필요하지 않고, 결과물은 .js 확장자를 갖게 됨.
- "react-native" 는 JSX 를 유지한다는 점은 preserve 와 같지만 결과물은 .js 확장자를 갖게 된다.

<br>

#### 참고링크

<a href="https://www.typescriptlang.org/tsconfig">타입스크립트 공식문서</a>
