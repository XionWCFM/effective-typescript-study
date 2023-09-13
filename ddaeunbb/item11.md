###📌 ITEM-11. 잉여 속성 체크의 한계 인지하기

```typescript
interface Room {
  numDoors: number;
  ceilingHeightFt: number;
}
const r: Room = {
  numDoors: 1,
  ceilingHeightFt: 10,
  elephant: "present",
  // 'Room' 형식에 'elephant'가 없습니다.
};
```

위와 같이 `const r`에 `elephan` 속성이 잇는 것에 대해 오류가 발생하고 있습니다.

다음 아래 예시를 확인해봅시다.

```typescript
const obj = {
  numDoors: 1,
  ceilingHeightFt: 10,
  elephant: "present",
};

const r: Room = obj; // 정상
```

obj의 타입은 Room 타입의 부분 집합을 포함하므로 Room에 할당 가능하며 타입 체커도 통과합니다.
<br>

- 첫 번째 예제에서는 '잉여 속성 체크' 라는 과정이 수행되었습니다.
- 하지만 잉여 속성 체크 역시 조건에 따라 동작하지 않는다는 한계가 있습니다.

#### 리터럴 체크는 하지만, 객체 리터럴이 아니면 체크 되지 않는다.

```typescript
interface Options {
  title: string;
  darkMode?: boolean;
}

// 객체 리터럴이 아닌 경우
// title 속성을 갖고 있어서 정상작동
const o1: Options = document;
const o2: Options = new HTMLAnchorElement();

function hello(options: Options) {
  return options.title;
}

const a = {
  title: "daeun",
  age: 123,
};

// 이것도 객체 리터럴이 아니기때문에 정상작동
hello(a);
```

따라서 위의 예시처럼 잉여 속성 체크는 기본적으로 객체 리터럴에 알 수 없는 속성을 허용하지 않음으로써 아까 첫번째 예시처럼 `Room`에 다른 속성을 부여할 수 없게 됩니다. 하지만 바로 위의 예시들은 객체 리터럴이 아니기때문에 잉여 속성 체크가 되지 않습니다.

```typescript
interface Options {
  title: string;
  darkMode?: boolean;
}

const o: Options = {
  title: "daeun",
  darkMode: true,
  plus: "nono", // 에러 발생
};
```

하지만 위처럼 객체 리터럴로 기입하게 되면 에러가 뜨게 됩니다.
<br>

#### 잉여 속성 체크는 타입 단언문에도 적용되지 않는다.

```typescript
interface Options {
  title: string;
  darkMode?: boolean;
}

const o = {
  title: "daeun",
  darkMode: true,
  plus: "nono",
} as Options; // 정상작동
```

따라서 단언문보다 선언문을 사용하는 것이 권장된다는 걸 또 알 수 있습니다.
<br>

- 즉, 잉여 속성 체크는 <span style="color: red">속성 이름의 오타</span>같은 실수를 잡는데 효과적입니다.
- 이외에도 엄격한 구조를 지키고 싶다면 잉여 속성 체크를 활용하는 것이 효과적일 것 같습니다.
