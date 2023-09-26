# string 타입보다 더 구체적인 타입 사용하기

`string` 타입으로 변수를 선언하려 한다면, 혹시 그 보다 더 좁은 타입이 적절하지는 않을지 검토해봐야 한다.

음악 컬렉션을 만들기 위해 앨범의 타입을 정의한다고 가정해보자.

```ts
interface Album {
  artist: string;
  title: string;
  releaseDate: string; // YYYY-MM-DD
  recordingType: string; // 예를 들어, "live" 또는 "studio"
}
```

`string` 타입이 남발된 모습이다. 이러한 설계는 다음 예시처럼 엉뚱한 값을 설정할 수 있다.

```ts
const kindOfBlue: Album = {
  artist: 'Miles Davis',
  title: 'Kind of Blue',
  releaseDate: 'August 17th, 1959', // 날짜 형식이 다름
  recordingType: 'Studio', // 오타
}; // 정상
```

또한 `string` 타입의 범위가 넓기 때문에 제대로 된 `Album` 객체를 사용하더라도 매개변수 순서가 잘못된 것이 오류로 드러나지 않는다.

```ts
function recordRelease(title: string, date: string) {
  /*...*/
}
recordRelease(kindOfBlue.releaseDate, kindOfBlue.title); // 오류여야 하지만 정상
```

이러한 `string` 타입이 남용된 코드를 "문자열을 남발하여 선언되었다(stringly typed)"라고 표현한다.

앞의 오류를 방지하기 위해 타입의 범위를 좁혀야 한다. `Album` 객체의 경우 `releaseDate`는 `Date` 객체를 사용해서 날짜 형식으로만 제한하고 `recordingType`의 경우 `"live"`와 `"studio"` 단 두개의 값으로 유니온 타입으로 정의하는게 좋아보인다.

```ts
type RecordingType = 'live' | 'studio';

interface Album {
  artist: string;
  title: string;
  releaseDate: Date;
  recordingType: RecordingType;
}
```

`keyof` 연산자로 더욱 세밀하게 객체의 속성 체크가 가능합니다. 어떤 배열에서 한 필드의 값만 추출하는 함수를 작성한다고 생각해보자.

```ts
function pluck(record, key) {
  return records.map((r) => r[key]);
}
```

`pluck` 함수의 시그니처를 다음처럼 작성할 수 있다.

```ts
function pluck(records: any[], key: string): any[] {
  return records.map((r) => r[key]);
}
```

타입 체크가 되긴 하지만 `any` 타입이 있어서 정밀하지 못하다. 특히 반환 값에 `any`를 사용하는 것은 매우 좋지 않은 설계이다.

```ts
function pluck<T>(records: T[], key: string): any[] {
  return records.map((r) => r[key]);
  // ~~~~ '{}' 형식에 인덱스 시그니처가 없으므로 요소에 암시적으로 'any' 형식이 있습니다.
}
```

타입스크립트는 `key`의 타입이 `string`이기 때문에 범위가 너무 넓다는 오류를 발생시킨다. `Album` 객체에서 `key`는 단 네 개의 값("artist", "title", "releaseDate", "recordingType")만이 유효하다. 다음 예씨는 `keyof Album` 타입으로 얻게 되는 결과이다.

```ts
type K = keyof Album;
// 타입이 "artist" | "title" | "releaseDate" | "recordingType"
```

그러므로 `string`을 `keyof T`로 바꾸면 된다.

```ts
function pluck<T>(records: T[], key: keyof T) {
  return records.map((r) => r[key]);
}
```

위의 코드는 타입 체커가 `function pluck<T>(records: T[], key: keyof T): T[keyof T][]`로 추론이 됩니다. 하지만 `T[keyof T]`는 `T` 객체 내의 가능한 모든 값의 타입이 된다. 하지만 `key`의 값으로 하나의 문자열을 넣게 되면 그 범위가 너무 넓어서 적절한 타입이라고 보기 어렵다.

```ts
const releaseDates = pluck(albums, 'releaseDate'); // 타입이 (string | Date)[]
```

`releaseDates`의 타입은 `(string | Date)[]`가 아니라 `Date[]`이어야 한다. `keyof T`는 `string`에 비하면 훨씬 범위가 좁기는 하지만 그래도 여전히 넓다. 따라서 범위를 더 좁히기 위해서 `keyof T`의 부분 집합으로 두 번째 제너릭 매개변수를 도입해야 한다.

```ts
function pluck<T, K extends keyof T>(records: T[], key: K): T[K][] {
  return records.map((r) => r[key]);
}

pluck(albums, 'releaseDate'); // 타입이 Date[]
pluck(albums, 'artist'); // 타입이 string[]
pluck(albums, 'recordingType'); // 타입이 RecordingType[]
pluck(albums, 'recordingDate'); // "recordingDate" 형식의 인수는 ... 형식의 매개변수에 할당될 수 없습니다.
```

`string`은 `any`와 비슷한 문제를 가지고 있다. 따라서 잘못 사용하게 되면 무효한 값을 허용하고 타입 간의 관계도 감추어 버린다. 이러한 문제점은 타입 체커를 방해하고 실제 버그를 찾지 못하게 만든다.
