# async function 

타입스크립트에서 Promise 생성 대신 async / await를 사용하면 좋은 점은 다음과 같습니다.

1. async 함수는 항상 프로미스를 반환하도록 강제됩니다.

2. async 함수에서 프로미스를 반환하면 또 다른 프로미스로 래핑되지 않습니다.

3. 일반적으로 코드가 간결하고 직관적이게 됩니다.

# Promise.race를 이용한 타임아웃 유틸 만들기

```tsx
const timeout = (millis:number):Promise<never> => {
    return new Promise((resolve,reject) => {
        setTimeout(() => reject('timeout'), millis)
    })
}

const fetchWithTimeout = async (url:string, ms:number) => {
    return Promise.race([fetch(url), timeout(ms)])
}
```

일정 시간이 지나면 리젝된 프로미스를 반환하는 timeout 함수를 만들고

Promise.race를 실행시키는 것을 통해 일정 시간이 지나면

fetch를 실패한것으로 취급하게 하는 fetchWithTimeout 함수를 생성했습니다.
