# what is 'is' ??

```tsx 

const whatisIs = (unknown:unknown):unknown is string => {
  return true
}

```
이 문법에서 is 키워드는 타입스크립트에서만 동작하는 키워드입니다.

is 키워드는 도대체 무엇을 도와주는 것일까요?


# is 키워드를 한마디로 정의하면

**사용자 정의 타입가드 키워드** 라고 생각할 수 있습니다.

is 키워드를 이용하면 타입가드를 더욱 유연하게 사용할 수 있습니다.

이해를 돕기 위해 예시를 보겠습니다.

```tsx

type Awesome = 'awesome'
const foo = (hi:unknown):hi is Awesome => {
    if(hi === 'awesome') {
        return true
    }
    return false
}

const consumer = (awesome:Awesome) => {
    return awesome
}

const hey = (he:string|number) => {
    if(foo(he)) {
        consumer(he)
        console.log(typeof he)

    }
    consumer(he) // error
}

const hi:Awesome = 'awesome'
hey(hi) // 출력 됨
hey('awesome') // 출력 됨
hey('gds') // 출력 안됨
```

위 예제에서 foo 함수는 is 키워드를 이용하여 

매개변수의 타입을 Awesome 타입으로 좁힌 결과를 반환합니다.

is 키워드를 반환값으로 가지는 함수의 경우에는

**반환 타입이 항상 `boolean` 이어야 합니다.**

foo(he)를 통해 타입이 Awesome으로 좁히는 것을 성공한 경우

Awesome 타입의 매개변수만 받을 수 있는 consumer 함수에

에러 없이 he 변수를 매개변수로 전달할 수 있습니다.

<br/>

그러나 그렇지 않은 경우에는 typescript는 에러를 반환하게 됩니다.

# is 키워드가 강력한 이유

```tsx

type Awesome = 'awesome'
const foo = (hi:unknown):hi is Awesome => {
    if(typeof hi === 'string') {
        return true
    }
    return false
}

const consumer = (awesome:Awesome) => {
    return awesome
}

const hey = (he:string|number) => {
    if(foo(he)) {
        consumer(he)
        console.log(typeof he)

    }
    consumer(he) // error
}

const hi:Awesome = 'awesome'
hey(hi) // 출력 됨
hey('awesome') // 출력 됨
hey('gds') // 출력 안됨
```

위 예제에서 foo 함수는 매개변수의 type 이 string 이기만 하면

hi is Awesome을 반환합니다.

이렇게 되면 실제로 매개변수의 타입이 Awesome 타입을 충족하지 않더라도

foo 함수의 호출결과 true가 반환되면 해당 매개변수는 Awesome 타입으로 사용할 수 있습니다.

이 특징을 잘 활용하면 재미있는 타입 검사를 시행할 수 있습니다.


# is 키워드를 이용하면 원시값에도 상표를 붙여줄 수 있다.

```tsx
type AbsolutePath = string & {_brand:'abs'}
function isAbsolutePath(path:string):path is AbsolutePath {
    return path.startsWith('/')
}

function listAbsolutePath(path:AbsolutePath) {

}

function f(path:string) {
    if(isAbsolutePath(path)) {
        listAbsolutePath(path)
        // 호출가능
    }
    listAbsolutePath(path) 
    // AbsoultePath 형식이 아니라 string 타입이라 에러
}
```

이 예제에서 AbsolutePath 타입은 string 타입과 {_brand:'abs'} 타입의 교집합을 정의합니다.

이는 자바스크립트의 관점에서 절대 이루어질 수 없는 타입 정의입니다.

왜냐하면 원시값인 string 에는 string의 프로토타입에 프로퍼티를 추가시켜주지 않고서는

프로퍼티를 붙여줄 수 없기 때문입니다.

<br/>

이는 string 변수에 프로퍼티를 붙여줄 경우 그 string 변수에 프로퍼티가 할당되는 게 아니라

래퍼객체를 통해 해당 변수를 래퍼객체로 래핑하여 생성한 후 

그 래퍼객체에 프로퍼티를 달아주는 일을 수행 한 뒤 래퍼 객체가 소멸하는 것에서 기인하는 문제입니다.


<br/>

그러나 앞서 서술한 is 키워드의 특징으로 인하여

위 예제에서 AbsolutePath 타입을 만족시키는 값을 만들어낼 수 있습니다.

이렇게 코드를 작성하게 되면 AbsolutePath 타입을 만족시키기 위해

반드시 거쳐가야하는 타입가드 함수가 생기게 되며

타입가드를 통해 더욱 안전하게 매개변수의 값을 관리할 수 있어집니다.


# 마치며

원시값에 상표를 붙여준다는 발상이 정말 놀라웠습니다.

is 키워드를 잘 이해하고 사용하면 좋을 것 같네요
