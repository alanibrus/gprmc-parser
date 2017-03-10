/*
2017 Alan Ibrus
*/
'use strict';

const fixGeo = function(coord, cardinalPoint) {
  const convert = function(raw, sign) {
    let pointPos = raw.indexOf('.');
    let latlng = {
      deg: raw.substr(0, pointPos-2),
      min: raw.substr(pointPos-2, 2),
      sec: parseFloat('0.' + raw.substr(pointPos+1, raw.length), 10)
    };
    latlng.deg = Math.abs(Math.round(latlng.deg * 1000000));
    latlng.min = Math.abs(Math.round(latlng.min * 1000000));
    latlng.sec = Math.abs(Math.round((latlng.sec*60) * 1000000));
    return Math.round(latlng.deg + (latlng.min/60) + (latlng.sec/3600)) * sign/1000000;
  };

  return convert(coord, (cardinalPoint === 'S' || cardinalPoint === 'W' ? -1 : 1));
};

const parseGPRMC = function(raw) {
  const splitted = raw.split(',');

  if (splitted.length !== 12 || splitted[0] !== '$GPRMC') {
    throw new TypeError('Invalid GPRMC string');
  }

  const gpsDate = splitted[9].replace(/([0-9]{2})([0-9]{2})([0-9]{2})/,
    (match, day, month, year) => {
      let yearprefix = (year > 50 ? '19' : '20'); // this controls how far back to go in the 20th century for the 2-digit date
      return yearprefix + year + '-' + month + '-' + day;
    });

  const gpsTime = splitted[1].replace(/([0-9]{2})([0-9]{2})([0-9]{2})/,
    (match, hour, minute, second) => hour + ':' + minute + ':' + second);

  return {
    'gps': {
      'date': gpsDate,
      'time': gpsTime,
      'validity': splitted[2] === 'A' ? true : false
    },
    'geo': {
      'latitude': fixGeo(splitted[3], splitted[4]),
      'longitude': fixGeo(splitted[5], splitted[6]),
      'bearing': parseFloat(splitted[8], 10)
    },
    'speed': {
      'knots': Math.round(splitted[7] * 1000) / 1000,
      'kmh': Math.round(splitted[7] * 1.852 * 1000) / 1000,
      'mph': Math.round(splitted[7] * 1.151 * 1000) / 1000
    }
  };
};

module.exports = parseGPRMC;
