# gprmc-parser
Parse and convert GPRMC strings to readable JSON format

# Install
```
npm install gprmc-parser
```

# Usage

```
const gprmcParser = require('gprmc-parser');
console.log(gprmcParser('$GPRMC,220516,A,5133.82,N,00042.24,W,173.8,231.8,130694,004.2,W*70'));
/*
{ gps: { date: '1994-06-13', time: '22:05:16', validity: true },
  geo: { latitude: 51.563667, longitude: -0.704, bearing: 231.8 },
  speed: { knots: 173.8, kmh: 321.878, mph: 200.044 } }
*/
```
