'use strict';

// prettier-ignore
const months = ['January', 'February','March','April','May','June','July','August','September','October','November','December'];

const select = selector => document.querySelector(selector);

const form = select('.form');
const containerWorkouts = select('.workouts');
const inputType = select('.form__input--type');
const inputDistance = select('.form__input--distance');
const inputDuration = select('.form__input--duration');
const inputCadence = select('.form__input--cadence');
const inputElelvation = select('.form__input--elevation');

if (navigator.geolocation)
  navigator.geolocation.getCurrentPosition(
    function (position) {
      const { latitude, longitude } = position.coords;

      const originalCoords = [latitude, longitude];

      var map = L.map('map').setView(originalCoords, 13);

      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      map.on('click', function (event) {
        const { lat, lng } = event.latlng;
        const clickedCoords = [lat, lng];
        L.marker(clickedCoords)
          .addTo(map)
          .bindPopup(
            L.popup({
              maxWidth: 250,
              minWidth: 100,
              autoClose: false,
              closeOnClick: false,
              className: 'running-popup',
            })
          )
          .openPopup();
      });
    },
    function () {
      alert('Could not get your position.');
    }
  );
