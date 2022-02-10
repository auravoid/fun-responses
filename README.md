# Fun Responses

![npm](https://img.shields.io/npm/v/fun-responses?style=for-the-badge)![npm bundle size](https://img.shields.io/bundlephobia/min/fun-responses?style=for-the-badge)![npm](https://img.shields.io/npm/dt/fun-responses?style=for-the-badge)![Website](https://img.shields.io/website?down_color=grey&down_message=offline&label=Responses&style=for-the-badge&up_color=green&up_message=online&url=https%3A%2F%2Fapi.voidprojects.dev%2F)

### NPM Install
```bash
npm install fun-responses
```

### How to use:
```javascript
const fun = require('fun-responses');

async function run() {
    // Joke
    console.log(await fun.joke())
    // Pickup Line
    console.log(await fun.pickup())
    // Topics and Open-Ended Questions
    console.log(await fun.topic())
    // Roasts
    console.log(await fun.roast())
    // Toasts
    console.log(await fun.toast())
}
run()
```

### Upcoming:
 - Fortune cookie responses
