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
    title: '2048',
    imageUrl:
      'https://lh3.googleusercontent.com/ZV0IXSCwUofCS6RabwNJ_yp4vwcxEenGYwscnbWtESd-6xt7JYRc6-PpWJAXUtbhJC74SCDt6970NS1ftvHTeC47XGE=s1280-w1280-h800',
    link: '#',
    embedUrl: 'https://play2048.co/'
  },
  {
    id: '2',
    title: 'Tetris',
    imageUrl:
      'https://play-lh.googleusercontent.com/gELFf6cqNm0gnW3gy3bV0rFS2bVOPiJCicSX7epCbOTkuCbZ1cMBUOFijq85DHTwZg=w526-h296-rw',
    link: '#',
    embedUrl: 'https://tetris.com/play-tetris'
  },
  {
    id: '3',
    title: 'Pacman',
    imageUrl:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQp0n7vfSP7h3k69dg-Q5mr1v57Uv4XtwWYlw&s',
    link: '#',
    embedUrl: 'https://www.google.com/logos/2010/pacman10-i.html'
  },
  {
    id: '4',
    title: 'Snake',
    imageUrl:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTsR2zQKHQ_HosECFokoc75SfbX2qPj8whlMg&s',
    link: '#',
    embedUrl: 'https://playsnake.org/'
  },
  {
    id: '5',
    title: 'Minesweeper',
    imageUrl:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQW2NGykzY3J9y-CMxTjyaU4kTEQ6u00gAlw&s',
    link: '#',
    embedUrl: 'ttps://minesweeper.online/'
  },
  {
    id: '6',
    title: 'Sudoku',
    imageUrl:
      'https://store-images.s-microsoft.com/image/apps.20177.9007199266246402.7c18c93d-0b98-4bdb-8459-2bf2a69a1bbf.84b8a60e-d086-4293-a29b-f3ad993e5fab?mode=scale&q=90&h=1080&w=1920',
    link: '#',
    embedUrl: 'https://www.sudokuweb.org/'
  }
]

export const twoPlayerGames: Game[] = recentGames
export const singlePlayerGames: Game[] = recentGames
export const featuredGames: Game[] = recentGames
