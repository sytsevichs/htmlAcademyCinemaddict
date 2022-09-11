const MOVIES_NUMBER_DEFAULT = 5;
const COMMENTS_NUMBER_DEFAULT = 5;
const MOVIES_INFO = [
  {
    id: 1,
    title: 'Made for Each Other',
    alternativeTitle: 'Made for Each Other',
    totalRating: 6.3,
    poster: './images/posters/made-for-each-other.png',
    ageRating: 18,
    director: 'John Cromwell',
    writers: [
      'Jo Swerling',
      'Rose Franken',
      'Frank Ryan'
    ],
    actors: [
      'Carole Lombard',
      'James Stewart'
    ],
    release: {
      date: '1939-02-10T00:00:00.000Z',
      releaseCountry: 'USA'
    },
    runtime: 92,
    genre: ['Comedy','Drama','Romance'],
    description: 'While on a business trip, an ambitious young lawyer meets and immediately falls in love with a stranger. They wed the following day, and tragedy soon strikes.'
  },
  {
    id: 2,
    title: 'Popeye the Sailor Meets Sindbad the Sailor',
    alternativeTitle: 'Папай-морячок встречается с Синдбадом-мореходом',
    totalRating: 7.3,
    poster: './images/posters/popeye-meets-sinbad.png',
    ageRating: 6,
    director: 'Dave Fleischer',
    writers: [
      'Izzy Sparber',
      'Joe Stultz',
      'Bill Turner'
    ],
    actors: [
      'Gus Wickie',
      'Jack Mercer'
    ],
    release: {
      date: '1937-11-27T00:00:00.000Z',
      releaseCountry: 'USA'
    },
    runtime: 16,
    genre: ['Animation','Short','Adventure'],
    description: 'The legendary sailors Popeye and Sindbad do battle to see which one is the greatest.'
  },
  {
    id: 3,
    title: 'Sagebrush Trail',
    alternativeTitle: 'След в полыни',
    totalRating: 5.4,
    poster: './images/posters/sagebrush-trail.jpg',
    ageRating: 16,
    director: 'Armand Schaefer',
    writers: [
      'Lindsley Parsons(',
      'Will Beale',
    ],
    actors: [
      'John Wayne',
      'Nancy Shubert'
    ],
    release: {
      date: '1933-12-15T00:00:00.000Z',
      releaseCountry: 'USA'
    },
    runtime: 54,
    genre: ['Western'],
    description: 'A man framed for murder escapes prison and goes west, where he joins a gang with the real killer involved.'
  },
  {
    id: 4,
    title: 'Santa Claus Conquers the Martians',
    alternativeTitle: 'Santa Claus Defeats the Aliens',
    totalRating: 2.7,
    poster: './images/posters/santa-claus-conquers-the-martians.jpg',
    ageRating: 0,
    director: 'Nicholas Webster',
    writers: [
      'Glenville Mareth',
      'Paul L. Jacobson',
    ],
    actors: [
      'John Call',
      'Leonard Hicks'
    ],
    release: {
      date: '1964-11-14T00:00:00.000Z',
      releaseCountry: 'USA'
    },
    runtime: 81,
    genre: ['Comedy','Adventure','Family'],
    description: 'The Martians kidnap Santa Claus because there is nobody on Mars to give their children presents.'
  },
  {
    id: 5,
    title: 'The Dance of Life',
    alternativeTitle: 'Burlesque',
    totalRating: 6.8,
    poster: './images/posters/the-dance-of-life.jpg',
    ageRating: 18,
    director: 'John Cromwell',
    writers: [
      'George Manker Watters',
      'Arthur Hopkins',
    ],
    actors: [
      'Hal Skelly',
      'Nancy Carroll'
    ],
    release: {
      date: '1929-08-16T00:00:00.000Z',
      releaseCountry: 'USA'
    },
    runtime: 115,
    genre: ['Drama'],
    description: 'A vaudeville comic and a pretty young dancer aren\'t having much luck in their separate careers, so they decide to combine their acts, and to save money on the road, they get married.'
  },
  {
    id: 6,
    title: 'The Great Flamarion',
    alternativeTitle: 'Strange Affair',
    totalRatigng: 6.5,
    poster: './images/posters/the-great-flamarion.jpg',
    ageRating: 18,
    director: 'Anthony Mann',
    writers: [
      'Anne Wigton',
      'Heinz Herald',
    ],
    actors: [
      'Erich von Stroheim',
      'Mary Beth Hughes'
    ],
    release: {
      date: '1945-01-13T00:00:00.000Z',
      releaseCountry: 'USA'
    },
    runtime: 115,
    genre: ['Drama','Mystery'],
    description: 'Part of an entertainment act, a beautiful but unscrupulous female performer manipulates all the men in her life in order to achieve her aims.'
  },
  {
    id: 7,
    title: 'The Man with the Golden Arm',
    alternativeTitle: 'Чeловек с золотой рукой',
    totalRating: 7.3,
    poster: '/images/posters/the-man-with-the-golden-arm.jpg',
    ageRating: 18,
    director: 'Otto Preminger',
    writers: [
      'Walter Newman',
      'Lewis Meltzer',
    ],
    actors: [
      'Frank Sinatra',
      'Eleanor Parker'
    ],
    release: {
      date: '1955-12-15T00:00:00.000Z',
      releaseCountry: 'USA'
    },
    runtime: 119,
    genre: ['Drama'],
    description: 'A junkie must face his true self to kick his drug addiction.'
  },
];


const EMOTIONS = [
  {
    id: 1,
    name: 'smile'
  },
  {
    id: 2,
    name: 'puke'
  },
  {
    id: 3,
    name: 'sleeping'
  },
  {
    id: 4,
    name: 'angry'
  },
];

const MovieDescriptionLength = {
  MIN : 0,
  MAX : 139
};


const comments = [
  'Cras aliquet varius magna, non porta ligula feugiat eget.',
  'Fusce tristique felis at fermentum pharetra.',
  'Aliquam id orci ut lectus varius viverra.',
  'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
  'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.',
  'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.',
  'Sed sed nisi sed augue convallis suscipit in sed felis.',
  'Aliquam erat volutpat.',
  'Nunc fermentum tortor ac porta dapibus.',
  'In rutrum ac purus sit amet tempus.',
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
];

const firstNames = [
  'Ivan',
  'Petr',
  'Sidor',
  'Vasily',
  'Semen',
];

const secondNames = [
  'Ivanov',
  'Petrov',
  'Sidorov',
  'Vasilyov',
  'Semenov',
];

export {
  MOVIES_NUMBER_DEFAULT,
  COMMENTS_NUMBER_DEFAULT,
  MOVIES_INFO,
  EMOTIONS,
  MovieDescriptionLength,
  comments,
  firstNames,
  secondNames,
};
