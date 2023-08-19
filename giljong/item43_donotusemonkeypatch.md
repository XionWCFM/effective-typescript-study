# what is monkeypatch?

몽키패치는 원래 소스코드를 변경하지 않고

런타임에 코드 기본 동작을 추가, 변경, 억제하는 기술을 의미합니다.

몽키패치는 자바스크립트의 세계에서는 손쉽게 할 수 있습니다.

```tsx
RegExp.prototype.legend = 'jaelin'
/jaelin/.monkey // jaelin
```

정규식 /jaelin/ 에 monkey라는 프로퍼티를 추가한적이 없음에도

프로토타입으로 인하여 /jaelin/은 .monkey라는 프로퍼티를 갖게 됩니다.

이러한 몽키패치는 기존 코드와의 충돌을 유발하기도 하며

(이미 있는 값을 몽키패치하는 경우 큰 문제가 발생합니다.)

```tsx
window.console = 'console'
console.log('') // error 더이상 console은 log 메서드를 갖고있지 않음
```

이런 몽키패치는 제한적인 상황(폴리필 등)에서만 사용할 것이 권장됩니다.

# 타입스크립트에서의 몽키패치

타입스크립트에서의 몽키패치는 이와 또 다른 문제를 발생시킵니다.

바로 타입체커가 정의된 인터페이스의 타입은 알고 있지만

임의로 몽키패치한 속성에 대해서는 알 수 없다는 문제입니다.

```tsx
document.monkey = 'giljong'
// document 유형에는 moneky 속성이 없습니다.
```

이 오류를 해결하는 방법으로는 as 단언문을 이용하거나

interface의 기능 중 하나인 보강(augmentation)을 이용하는 것이 있습니다.

# 보강 (augmentation)


```tsx
interface Document {
    monkey:string
}

document.monkey = 'giljong' // no error
```

그러나 모듈의 관점에서 제대로 인터페이스가 동작하게 하려면 

global 선언을 추가해야합니다.

```tsx
export {}

declare global {
    interface Document {
        monkey:string;
    }
}

```



# 보강의 모듈 스코프 문제

인터페이스의 보강은 전역적으로 적용되기 때문에

다른 라이브러리, 코드로부터 분리할 방법이 없습니다.

또한 애플리케이션이 실행되는 동안 속성을 할당하면

실행 시점에서 보강을 적용할 방법이 없습니다.

(타입스크립트는 대부분의 경우 런타임에 영향을 주지 않기 때문입니다.)



# 마치며

그러나 라이브러리 , 점진적 마이그레이션 등 특수한 상황이 아닌 경우에는

애초에 몽키패치를 하지 않는 것이 더 권장됩니다.

애초에... 하지 말고.. 해야한다면 보강을 적극적으로 활용하는게 좋을 것 같습니다.

