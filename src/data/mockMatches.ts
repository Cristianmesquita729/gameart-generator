export interface Match {
  id: string;
  competition: string;
  competitionLogo?: string;
  homeTeam: {
    name: string;
    shortName: string;
    logo: string;
    playerImage?: string;
    playerName?: string;
  };
  awayTeam: {
    name: string;
    shortName: string;
    logo: string;
    playerImage?: string;
    playerName?: string;
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
    },
    awayTeam: {
      name: "Palmeiras",
      shortName: "PAL",
      logo: "https://upload.wikimedia.org/wikipedia/commons/1/10/Palmeiras_logo.svg",
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
    },
    awayTeam: {
      name: "São Paulo",
      shortName: "SAO",
      logo: "https://upload.wikimedia.org/wikipedia/commons/6/6f/Brasao_do_Sao_Paulo_Futebol_Clube.svg",
    },
    date: "28/03/2026",
    time: "16:00",
    venue: "Neo Química Arena",
    city: "São Paulo",
    matchday: "Rodada 5",
  },
];
