import { Game } from './game-page'

// const allGame: Game[] = [
//   {
//     id: '1',
//     title: '2048',
//     embedUrl: 'https://play2048.co/',
//     imageUrl:
//       'https://lh3.googleusercontent.com/ZV0IXSCwUofCS6RabwNJ_yp4vwcxEenGYwscnbWtESd-6xt7JYRc6-PpWJAXUtbhJC74SCDt6970NS1ftvHTeC47XGE=s1280-w1280-h800',
//     link: 'https://play2048.co/'
//   },
//   {
//     id: '2',
//     title: 'Tic Tac Toe',
//     embedUrl: 'https://playtictactoe.org/',
//     imageUrl:
//       'https://lh3.googleusercontent.com/9z9jJ2Z4qK8bBk7G2y6Zz7iJ5K8bQ2QrD1VXQ8V6D2U8J7J3=s1280-w1280-h800',
//     link: 'https://playtictactoe.org/'
//   },
//   {
//     id: '3',
//     title: 'Solitaire',
//     embedUrl: 'https://playsolitaire.co/',
//     imageUrl:
//       'https://lh3.googleusercontent.com/9z9jJ2Z4qK8bBk7G2y6Zz7iJ5K8bQ2QrD1VXQ8V6D2U8J7J3=s1280-w1280-h800',
//     link: 'https://playsolitaire.co/'
//   },
//   {
//     id: '4',
//     title: 'Sudoku',
//     embedUrl: 'https://playsudoku.co/',
//     imageUrl:
//       'https://lh3.googleusercontent.com/9z9jJ2Z4qK8bBk7G2y6Zz7iJ5K8bQ2QrD1VXQ8V6D2U8J7J3=s1280-w1280-h800',
//     link: 'https://playsudoku.co/'
//   },
//   {
//     id: '5',
//     title: 'P Minesweeper',
//     embedUrl: 'https://playsudoku.co/',
//     imageUrl:
//       'https://lh3.googleusercontent.com/9z9jJ2Z4qK8bBk7G2y6Zz7iJ5K8bQ2QrD1VXQ8V6D2U8J7J3=s1280-w1280-h800',
//     link: 'https://playsudoku.co/'
//   },
//   {
//     id: '6',
//     title: 'Puzzle',
//     embedUrl: 'https://playsudoku.co/',
//     imageUrl:
//       'https://lh3.googleusercontent.com/9z9jJ2Z4qK8bBk7G2y6Zz7iJ5K8bQ2QrD1VXQ8V6D2U8J7J3=s1280-w1280-h800',
//     link: 'https://playsudoku.co/'
//   },
//   {
//     id: '7',
//     title: 'Chess',
//     embedUrl: 'https://playsudoku.co/',
//     imageUrl:
//       'https://lh3.googleusercontent.com/9z9jJ2Z4qK8bBk7G2y6Zz7iJ5K8bQ2QrD1VXQ8V6D2U8J7J3=s1280-w1280-h800',
//     link: 'https://playsudoku.co/'
//   },
//   {
//     id: '8',
//     title: 'Checkers',
//     embedUrl: 'https://playsudoku.co/',
//     imageUrl:
//       'https://lh3.googleusercontent.com/9z9jJ2Z4qK8bBk7G2y6Zz7iJ5K8bQ2QrD1VXQ8V6D2U8J7J3=s1280-w1280-h800',
//     link: 'https://playsudoku.co/'
//   },
//   {
//     id: '9',
//     title: 'Puzzle',
//     embedUrl: 'https://playsudoku.co/',
//     imageUrl:
//       'https://lh3.googleusercontent.com/9z9jJ2Z4qK8bBk7G2y6Zz7iJ5K8bQ2QrD1VXQ8V6D2U8J7J3=s1280-w1280-h800',
//     link: 'https://playsudoku.co/'
//   },
//   {
//     id: '10',
//     title: 'Puzzle',
//     embedUrl: 'https://playsudoku.co/',
//     imageUrl:
//       'https://lh3.googleusercontent.com/9z9jJ2Z4qK8bBk7G2y6Zz7iJ5K8bQ2QrD1VXQ8V6D2U8J7J3=s1280-w1280-h800',
//     link: 'https://playsudoku.co/'
//   },
//   {
//     id: '11',
//     title: 'Puzzle',
//     embedUrl: 'https://playsudoku.co/',
//     imageUrl:
//       'https://lh3.googleusercontent.com/9z9jJ2Z4qK8bBk7G2y6Zz7iJ5K8bQ2QrD1VXQ8V6D2U8J7J3=s1280-w1280-h800',
//     link: 'https://playsudoku.co/'
//   },
//   {
//     id: '12',
//     title: 'Puzzle',
//     embedUrl: 'https://playsudoku.co/',
//     imageUrl:
//       'https://lh3.googleusercontent.com/9z9jJ2Z4qK8bBk7G2y6Zz7iJ5K8bQ2QrD1VXQ8V6D2U8J7J3=s1280-w1280-h800',
//     link: 'https://playsudoku.co/'
//   },
//   {
//     id: '13',
//     title: 'Puzzle',
//     embedUrl: 'https://playsudoku.co/',
//     imageUrl:
//       'https://lh3.googleusercontent.com/9z9jJ2Z4qK8bBk7G2y6Zz7iJ5K8bQ2QrD1VXQ8V6D2U8J7J3=s1280-w1280-h800',
//     link: 'https://playsudoku.co/'
//   },
//   {
//     id: '14',
//     title: 'Puzzle',
//     embedUrl: 'https://playsudoku.co/',
//     imageUrl:
//       'https://lh3.googleusercontent.com/9z9jJ2Z4qK8bBk7G2y6Zz7iJ5K8bQ2QrD1VXQ8V6D2U8J7J3=s1280-w1280-h800',
//     link: 'https://playsudoku.co/'
//   }
// ]
// export const recentGames: Game[] = [allGame[0], allGame[1], allGame[2], allGame[3], allGame[4]]
// export const popularGames: Game[] = [allGame[5], allGame[6], allGame[7], allGame[8], allGame[9]]
// export const singlePlayerGames: Game[] = [
//   allGame[0],
//   allGame[1],
//   allGame[2],
//   allGame[3],
//   allGame[4]
// ]
// export const twoPlayerGames: Game[] = [allGame[5], allGame[6], allGame[7], allGame[8], allGame[9]]
// export const featuredGames: Game[] = [
//   allGame[10],
//   allGame[11],
//   allGame[12],
//   allGame[13],
//   allGame[14]
// ]
export const recentGames: Game[] = [
  {
    id: '1',
    title: 'Recent Game 1',
    imageUrl: '/placeholder.svg?height=100&width=200',
    link: '#',
    embedUrl: 'https://example.com/embed/game1'
  },
  {
    id: '2',
    title: 'Recent Game 2',
    imageUrl: '/placeholder.svg?height=100&width=200',
    link: '#',
    embedUrl: 'https://example.com/embed/game2'
  },
  {
    id: '3',
    title: 'Recent Game 3',
    imageUrl: '/placeholder.svg?height=100&width=200',
    link: '#',
    embedUrl: 'https://example.com/embed/game3'
  },
  {
    id: '4',
    title: 'Recent Game 4',
    imageUrl: '/placeholder.svg?height=100&width=200',
    link: '#',
    embedUrl: 'https://example.com/embed/game4'
  }
]

export const twoPlayerGames: Game[] = [
  {
    id: '5',
    title: '2-Player Game 1',
    imageUrl: '/placeholder.svg?height=100&width=200',
    link: '#',
    embedUrl: 'https://example.com/embed/game5'
  },
  {
    id: '6',
    title: '2-Player Game 2',
    imageUrl: '/placeholder.svg?height=100&width=200',
    link: '#',
    embedUrl: 'https://example.com/embed/game6'
  },
  {
    id: '7',
    title: '2-Player Game 3',
    imageUrl: '/placeholder.svg?height=100&width=200',
    link: '#',
    embedUrl: 'https://example.com/embed/game7'
  },
  {
    id: '8',
    title: '2-Player Game 4',
    imageUrl: '/placeholder.svg?height=100&width=200',
    link: '#',
    embedUrl: 'https://example.com/embed/game8'
  }
]

export const singlePlayerGames: Game[] = [
  {
    id: '9',
    title: 'Single-Player Game 1',
    imageUrl: '/placeholder.svg?height=100&width=200',
    link: '#',
    embedUrl: 'https://example.com/embed/game9'
  },
  {
    id: '10',
    title: 'Single-Player Game 2',
    imageUrl: '/placeholder.svg?height=100&width=200',
    link: '#',
    embedUrl: 'https://example.com/embed/game10'
  },
  {
    id: '11',
    title: 'Single-Player Game 3',
    imageUrl: '/placeholder.svg?height=100&width=200',
    link: '#',
    embedUrl: 'https://example.com/embed/game11'
  },
  {
    id: '12',
    title: 'Single-Player Game 4',
    imageUrl: '/placeholder.svg?height=100&width=200',
    link: '#',
    embedUrl: 'https://example.com/embed/game12'
  }
]

export const featuredGames: Game[] = [
  {
    id: '13',
    title: 'Featured Game 1',
    imageUrl: '/placeholder.svg?height=100&width=200',
    link: '#',
    embedUrl: 'https://example.com/embed/game13'
  },
  {
    id: '14',
    title: 'Featured Game 2',
    imageUrl: '/placeholder.svg?height=100&width=200',
    link: '#',
    embedUrl: 'https://example.com/embed/game14'
  },
  {
    id: '15',
    title: 'Featured Game 3',
    imageUrl: '/placeholder.svg?height=100&width=200',
    link: '#',
    embedUrl: 'https://example.com/embed/game15'
  },
  {
    id: '16',
    title: 'Featured Game 4',
    imageUrl: '/placeholder.svg?height=100&width=200',
    link: '#',
    embedUrl: 'https://example.com/embed/game16'
  }
]
