# 2장 타입스크립트의 타입 시스템

## ITEM9. 타입 단언보다는 타입 선언을 사용하기

**타입 단언 보다 타입 선언을 사용합니다.** 이는 타입 선언이 명확하게 타입을 보호해 주고, 타입 오류를 통해 필요한 값을 알려주기 때문입니다. 

```ts
interface Person { name: string };
const alice: Person = {};
   // ~~~~~ Property 'name' is missing in type '{}'
   //       but required in type 'Person'
   //       애러가 발생합니다.
const bob = {} as Person;  // 애러가 발생하지 앖습니다.
```



> ### 타입 선언 
>```ts
>interface Person { name: string };
>
>const alice: Person = { name: 'Alice' };  // Type is Person
>```


> ### 타입 단언
> - 타입스크립트가 자동으로 추론한 타입이 있더라도 Person 타입으로 간주합니다.
> - 다른 타입을 강제로 변화하는 것은 불가능하지만 `unknown`을 거치면 가능합니다. `unknown`은 모든 타입의 **상위 집합**이기 때문입니다. 하지만  `unknown`을 사용하고 있다면 무언가 위험한 행위를 하고 있다는 것을 인지해야 합니다.
>```ts
> const bob = { name: 'Bob' } as Person;  // Type is Person
> const el = document.body as unknown as Person;  // OK
>```






타입 단언은 강제로 타입을 지정하기 때문에 타입 체커에게 오류를 무시하라고 하는 것입니다. 하지만 상황에 따라서 타입 선언을 사용해야 하는 경우가 있을 수 있습니다. (ex DOM 타입) 혹은 null이 아님을 단언해야 하는 경우도 있습니다. `( ! )`

```ts
const elNull = document.getElementById('foo');  // Type is HTMLElement | null
const el = document.getElementById('foo')!; // Type is HTMLElement
```