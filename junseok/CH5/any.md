# CH5 any 다루기 

## ITEM 38. any 타입은 가능한 좁은 범위에서만 사용하기 

- 타입스크립트의 타입 시스템은 선택적이고 점진적이기 때문에 정적이면서도 동적인 특성을 동시에 가집니다. 따라서 타입스크트는 프로그램의 일부분에만 타입 시스템을 적용할 수 있습니다. 

- 함수의 반환 타입을 추론할 수 있는 경우에도 함수의 반환 타입을 명시하는 것이 좋습니다. 

- 강제로 타입 오류를 제거하려면 any 대신 `@ts-ignore` 사용하는 것이 좋습니다.

```ts
interface Foo {
  foo: string
}
interface Bar {
  bar: string
}
declare function expressionReturningFoo(): Foo
function processBar(b: Bar) {
  /* ... */
}
function f1() {
  const x = expressionReturningFoo()
  // @ts-ignore
  processBar(x)
  return x
}

export default {}
```

## ITEM 39. any를 구체적으로 변형해서 사용하기

- any 값을 사용할 때는 정말로 모든 값이 허용되어야만 하는지 면밀히 검토해야 합니다. 

- any 보다 더 정확하게 모델링할 수 있도록 `any[]` 또는` {[key: string]: any}` 또는 `()=>any` 처럼 구체적인 형태를 사용해야 합니다.

## ITEM 40. 함수 안으로 타입 단언문 감추기 

- 내부 로직이 복잡해서 안전한 타입르로 구현하기 어려운 경우, 함수 내부에는 타입 단언을 사용하고 함수 외부로 드러나는 타입 정의를 정확히 명시하는 정도로 끝내는 것이 좋습니다. 

- 불가피하게 타입 단언, any를 사용해야 하는 경우에는 정확한 정의를 가지는 함수안으로 숨기도록 합시다. 

## ITEM 42. 모르는 타입의 값에는 any 대신 unknown을 사용하기 

- `any가` 위험한 이유는 다음 두 가지 특징에서 비롯됩니다.
    1. 어떠한 타입이든 any 타입에 할당 가능하다.
    2. any 타입은 어떠한 타입으로도 할당가능하다.
    
    타입 체커는 집합기반이기 때문에, any를 사용하면 타입 체커가 무용지물이 된다는 것을 기억해야 합니다. 

- `unknown`은 any 대신 사용할 수 있는 타입 시스템에 부합하는 타입입니다.  `unknown`은 any의 특징 중 첫 번째 속성을 만족하지만, 두 번째 속성은 만족하지 않습니다. (`unknown`은 오직 `unknown`과 `any`애만 할당 가능)

- `never`타입은 `unknown`타입과 정반대입니다. 첫 번째 속성은 만족하지 않지만, 두번 째 속성은 만족합니다.


`unknown`타입인 채로 값을 사용하려면 오류가 발생하빈다. `unknown`인 값에 함수 호출을 하거나 연산을 하려고 해도 마찬가지입니다. `unknown`상태로 사용하려고 하면 오류가 발생하기 때문에, 적절한 타입으로 변환하도록 강제해야 합니다. 


```ts
function parseYAML(yaml: string): any {
  // ...
}
interface Book {
  name: string;
  author: string;
}
function safeParseYAML(yaml: string): unknown {
  return parseYAML(yaml);
}
const book = safeParseYAML(`
  name: Villette
  author: Charlotte Brontë
`) as Book;
alert(book.title);
        // ~~~~~ Property 'title' does not exist on type 'Book'
book('read');
// ~~~~~~~~~ this expression is not callable
```


- 제너릭보다는 `unknown`을 반환하고 사용자가 직접 단언문을 사용하거나 원하는 대로 타입을 좁히도록 강제하는 것이 좋습니다. 

- `unknown`과 유사하지만 조금 다른 타입으로 `object` 또는 `{}`를 사용하는 코드가 존재합니다. `object` 또는 `{}`를 사용하는 방법 역시 `unknown`만큼 범위가 넓은 타입이지만, `unknown`보다는 범위가 약간 좁습니다. 
    - `{}` 타입은 null 과 undefined를 제외한 모든 값을 포합합니다. 
    - `object` 타입은 모든 비기본형 타입(object는 원시 타입이 아닌 타입을 나타냅니다. 예를 들어, number, string, boolean, bigint, symbol, null, 또는 undefined 가 아닌 나머지를 의미합니다.)으로 이루어집니다. 
    ```ts
    declare function create(o: object | null): void;

    create({ prop: 0 }); // 성공
    create(null); // 성공

    create(42); // 오류
    create("string"); // 오류
    create(false); // 오류
    create(undefined); // 오류
    ```

- 대부분 타입을 확정하지 못하는 경우 `unknown`을 사용합니다. 정말로 `null` `undefined`가 사용 불가능하다고 판단되는 경우에만 `{}`를 사용합니다. 

## ITEM 43. 몽키 패치보다는 안전한 타입을 사용하기 

- 자바스크립트는 객체에 쉽게 새로운 프로퍼티를 추가할 수 있습니다. 이는 전역 객체 (`window`, `document`)에서도 가능합니다. 
- 하지만 타입스크립트는 새롭게 추가된 프로퍼티에 대한 정보를 알 수 없습니다. 이때 any등으로 타입을 단언하면 해결할 수 있지만, 타입 보호를 벗어나야 한다는 문제점이 있습니다. 따라서 이를 해결하는 가장 좋은 방법은 **`보강`**입니다. 보강의 장점은 다음과 같습니다. 
    1. 타입이 더 안전합니다. 타입 체커는 오타나 잘못된 타입의 할당을 오류로 표시합니다. 
    2. 속성에 주석을 붙일 수 있습니다. 
    3. 속성에 자동완성을 사용할 수 있습니다. 
    4. 몽키 패치가 어떤 부분에 적용되었는지 정확한 기록이 남습니다. 
- 추가적으로 모듈의 관점에서 (타입스크립트 파일이 `export`, `import`를 사용하는 경우) 제대로 동작하게 하려면 `global`선언을 추가해야 합니다. 

```ts
export {};
declare global {
  interface Document {
    /** Genus or species of monkey patch */
    monkey: string;
  }
}
document.monkey = 'Tamarin';  // OK
```

- 위와 같이 전역으로 설정하는 방법 이외에 타입 단언문을 구체적으로 작성하여 사용할 수 있습니다. 
```ts
interface MonkeyDocument extends Document {
  /** Genus or species of monkey patch */
  monkey: string;
}

(document as MonkeyDocument).monkey = 'Macaque';
```

## ITEM 44. 타입 커버리지를 추적하여 타입 안전성 유지하기
- any의 개수를 추적하는 좋은 방법이 있습니다. 

```
npx type-coverge
```

- 타입 커버리지의 정보를 수집해 볼 수도 있습니다. 
```
npx type-coverge --detail
```

- `noImplicitAny`가 설정되어 있어도, 명시적 any 또는 서드파티 타입 선언(`@types`)을 통해 any 타입은 코드 내에 여전히 존재할 수 있다는 점을 주의 해야 합니다. 

- 작성한 프로그램의 타입이 얼마나 잘 선언되었는지 추적해야 합니다. 추적함으로써 any의 사용을 줄여 나갈 수 있고 타입 안전성을 꾸준히 높일 수 있습니다. 