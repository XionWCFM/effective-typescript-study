# 공식 명칭에는 brand 붙이기

구조적 타이핑을 따르고 있는 타입스크립트의 특성으로 인하여 간혹 이상한 결과가 나오기도 합니다.

```tsx
interface Vector2D {
    x:number;
    y:number;
}

function calculateNorm(p:Vector2D) {
    return Math.sqrt(p.x * p.x + p.y * p.y)
}

console.log(calculateNorm({x:3, y:4})) // 5

const vec3D = {x:3, y:4, z:1}

console.log(calculateNorm(vec3D)) // 5
```

이는 타입스크립트 관점에서는 문제가 되지 않지만

사람의 입장에서는 이상한 동작으로 볼 수 있습니다.

왜냐하면 vec3D 타입은 z축을 고려해서 계산해야할 것 같지만

`calculateNorm`은 2D로만 계산을 하고있음에도

구조적 타이핑으로 인해 에러가 발생하지 않기 때문입니다.


<br/>

`calculateNorm` 함수가 3차원 벡터를 인수로 허용하지 않게 하기 위해서는

공식 명칭(nomi-nal typing)을 이용하면 가능합니다.

이는 타입이 아니라 값의 관점에서 Vector2D라고 이야기하는 것입니다.


```tsx

interface Vector2D {
    _brand:'2d';
    x:number;
    y:number;
}

function vec2D(x:number, y:number):Vector2D {
    return {x,y,_brand:'2d'}
}

function calculateNorm(p:Vector2D) {
    return Math.sqrt(p.x * p.x + p.y * p.y)
}

console.log(calculateNorm(vec2D(3,4)))

const vec3D = {x:3, y:4, z:1}

console.log(calculateNorm(vec3D))
// _brand 속성이 vec3D 객체에 없습니다.
```

클래스와 유사한 일을 수행하는 vec2D 함수를 선언하고

Vector2D 인터페이스에 _brand 속성을 강제하는 것을 통해 

calculateNorm 함수는 Vector2D 타입만 받는 것을 보장시킬 수 있습니다.

<br/>

**이 방법으로는 악의적인 사용을 막을 수는 없습니다**

```tsx
const vec3D = {x:3, y:4, z:1, _brand:'2d'}
```

와 같은 형태로 사용하는 것을 막을 수 없다는 뜻입니다.

그러나 단순한 실수를 방지하기에는 충분한 기법입니다.


# 원시타입에도 상표기법을 사용할 수 있습니다.

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

이 방법의 장점은 런타임 오버헤드가 없이 타입스크립트의 영역에서만 동작한다는 것입니다.

개인적으로는 처음에 접할 때엔 굉장히 혼란스러운 방식의 문법이었는데 

is 키워드를 이해하면 어렵지 않습니다.

## 'is' keyword

is 키워드는 사용자 정의 Type Guard 라고 볼 수 있습니다.

is 키워드는 컴파일 단계에서만 사용되며 런타임에서는 순수한 js 파일과 동일하게 동작합니다.

is 키워드를 반환 값으로 사용한 함수는 항상 boolean을 반환해야합니다.

이해가 되지 않는다면 따로 작성해둔 `item37_is.md` 문서를 참고하시기 바랍니다.


# 마치며

타입스크립트의 구조적 타이핑은 그 장점도 명확하지만

값을 세밀하게 구분하지 못하는 경우가 있다는 한계도 존재합니다.

따라서 값을 세밀하게 구분해야하는 경우

위 기법들을 이용하여 상표를 붙이는 것을 고려하는 것이 좋습니다.

상표 기법은 타입시스템 안에서 동작하지만

런타임에 상표를 검사하는 것과 동일한 효과를 얻을 수 있다는 점에서

런타임 오버헤드를 최소화 해줍니다.

