'use strict';

// prettier-ignore
const months = ['January', 'February','March','April','May','June','July','August','September','October','November','December'];

class Workout {
  date = new Date();
  id = (Date.now() + '').slice(-10);

  constructor(coords, distance, duration) {
    this.coords = coords; // [lat,lng]
    this.distance = distance; // in km
    this.duration = duration; // in min
  }
}

class Running extends Workout {
  type = 'running';

  constructor(coords, distance, duration, cadence) {
    super(coords, distance, duration);
    this.cadence = cadence;
    this.calcPace();
  }
  calcPace() {
    this.pace = this.duration / this.distance;
    return this.pace;
  }
}

class Cycling extends Workout {
  type = 'cycling';

  constructor(coords, distance, duration, elevation) {
    super(coords, distance, elevation);
    this.elevation = elevation;
    this.calcSpeed();
  }

  calcSpeed() {
    this.speed = this.distance / this.duration;
    return this.speed;
  }
}

// Application Architecture
const select = selector => document.querySelector(selector);

const form = select('.form');
const containerWorkouts = select('.workouts');
const inputType = select('.form__input--type');
const inputDistance = select('.form__input--distance');
const inputDuration = select('.form__input--duration');
const inputCadence = select('.form__input--cadence');
const inputElelvation = select('.form__input--elevation');

class App {
  #map;
  #mapEvent;
  #workouts = [];

  constructor() {
    this._getPosition();
    inputType.addEventListener('change', this._toggleElevationField);
    form.addEventListener('submit', this._newWorkout.bind(this));
  }

  _getPosition() {
    if (navigator.geolocation)
      navigator.geolocation.getCurrentPosition(
        this._loadMap.bind(this),
        function () {
          alert('Could not get your position.');
        }
      );
  }

  _loadMap(position) {
    const { latitude, longitude } = position.coords;

    const originalCoords = [latitude, longitude];

    this.#map = L.map('map').setView(originalCoords, 13);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);

    this.#map.on('click', this._showForm.bind(this));
  }

  _showForm(event) {
    this.#mapEvent = event;
    form.classList.remove('hidden');
    inputDistance.focus();
  }

  _toggleElevationField() {
    inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
    inputElelvation.closest('.form__row').classList.toggle('form__row--hidden');
  }

  _newWorkout(event) {
    event.preventDefault();
    const allNumbers = (...nums) => nums.every(num => Number.isFinite(num));
    const allPositive = (...nums) => nums.every(num => num > 0);

    // Get data form form
    const type = inputType.value;
    const distance = +inputDistance.value;
    const duration = +inputDuration.value;
    const { lat, lng } = this.#mapEvent.latlng;
    const clickedCoords = [lat, lng];
    let workout;

    // If the workout is running, create running object
    if (type === 'running') {
      const cadence = +inputCadence.value;

      // Check if data is valid
      if (
        !allNumbers(distance, duration, cadence) ||
        !allPositive(distance, duration, cadence)
      )
        return alert('Inputs have to be positive numbers.');

      workout = new Running(clickedCoords, distance, duration, cadence);
      console.log(workout);
    }

    // If the workout is cycling, create cycling object
    if (type === 'cycling') {
      const elevation = +inputElelvation.value;

      // Check if data is valid
      if (
        !allNumbers(distance, duration, elevation) ||
        !allPositive(distance, duration)
      )
        return alert('Inputs have to be positive numbers.');

      workout = new Cycling(clickedCoords, distance, duration, elevation);
      console.log(workout);
    }

    // Add the new object to the workouts array
    this.#workouts.push(workout);

    // Render the workout on the array as a marker
    this.renderWorkoutMarker(workout);

    // Render the workout on the list

    // Clear input fields and hide form

    inputDistance.value =
      inputDuration.value =
      inputCadence.value =
      inputElelvation.value =
        '';
  }

  renderWorkoutMarker(workout) {
    L.marker(workout.coords)
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          className: `${workout.type}-popup`,
        })
      )
      .setPopupContent(workout.type)
      .openPopup();
  }
}

const app = new App();
