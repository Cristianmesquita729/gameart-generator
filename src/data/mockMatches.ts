export interface Match {
  id: string;
  competition: string;
  competitionLogo?: string;
  homeTeam: {
    name: string;
    shortName: string;
    logo: string;
    playerImage: string;
    playerName: string;
  };
  awayTeam: {
    name: string;
    shortName: string;
    logo: string;
    playerImage: string;
    playerName: string;
  };
  date: string;
  time: string;
  venue: string;
  city: string;
  matchday?: string;
}

export const mockMatches: Match[] = [
  {
    id: "1",
    competition: "Brasileirão Série A",
    homeTeam: {
      name: "Flamengo",
      shortName: "FLA",
      logo: "https://upload.wikimedia.org/wikipedia/commons/2/2e/Flamengo_bridge_logo.svg",
      playerImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Gerson_Santos_da_Silva_%28cropped%29.jpg/220px-Gerson_Santos_da_Silva_%28cropped%29.jpg",
      playerName: "Gerson",
    },
    awayTeam: {
      name: "Palmeiras",
      shortName: "PAL",
      logo: "https://upload.wikimedia.org/wikipedia/commons/1/10/Palmeiras_logo.svg",
      playerImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Raphael_Veiga_2023.jpg/220px-Raphael_Veiga_2023.jpg",
      playerName: "Raphael Veiga",
    },
    date: "28/03/2026",
    time: "20:00",
    venue: "Maracanã",
    city: "Rio de Janeiro",
    matchday: "Rodada 5",
  },
  {
    id: "2",
    competition: "Brasileirão Série A",
    homeTeam: {
      name: "Corinthians",
      shortName: "COR",
      logo: "https://upload.wikimedia.org/wikipedia/pt/b/b4/Corinthians_simbolo.png",
      playerImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Yuri_Alberto_2023.jpg/220px-Yuri_Alberto_2023.jpg",
      playerName: "Yuri Alberto",
    },
    awayTeam: {
      name: "São Paulo",
      shortName: "SAO",
      logo: "https://upload.wikimedia.org/wikipedia/commons/6/6f/Brasao_do_Sao_Paulo_Futebol_Clube.svg",
      playerImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Lucas_Moura_2023.jpg/220px-Lucas_Moura_2023.jpg",
      playerName: "Lucas Moura",
    },
    date: "28/03/2026",
    time: "16:00",
    venue: "Neo Química Arena",
    city: "São Paulo",
    matchday: "Rodada 5",
  },
  {
    id: "3",
    competition: "Copa Libertadores",
    homeTeam: {
      name: "Grêmio",
      shortName: "GRE",
      logo: "https://upload.wikimedia.org/wikipedia/commons/8/83/Gremio_logo.svg",
      playerImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Suarez_2023.jpg/220px-Suarez_2023.jpg",
      playerName: "Suárez",
    },
    awayTeam: {
      name: "Boca Juniors",
      shortName: "BOC",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Boca_Juniors_logo.svg/200px-Boca_Juniors_logo.svg.png",
      playerImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Edinson_Cavani_2023.jpg/220px-Edinson_Cavani_2023.jpg",
      playerName: "Cavani",
    },
    date: "28/03/2026",
    time: "21:30",
    venue: "Arena do Grêmio",
    city: "Porto Alegre",
    matchday: "Fase de Grupos",
  },
  {
    id: "4",
    competition: "Premier League",
    homeTeam: {
      name: "Manchester City",
      shortName: "MCI",
      logo: "https://upload.wikimedia.org/wikipedia/en/e/eb/Manchester_City_FC_badge.svg",
      playerImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Erling_Haaland_2023.jpg/220px-Erling_Haaland_2023.jpg",
      playerName: "Haaland",
    },
    awayTeam: {
      name: "Liverpool",
      shortName: "LIV",
      logo: "https://upload.wikimedia.org/wikipedia/en/0/0c/Liverpool_FC.svg",
      playerImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Mohamed_Salah_2023.jpg/220px-Mohamed_Salah_2023.jpg",
      playerName: "Salah",
    },
    date: "28/03/2026",
    time: "13:30",
    venue: "Etihad Stadium",
    city: "Manchester",
    matchday: "Matchweek 30",
  },
];
